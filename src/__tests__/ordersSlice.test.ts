import { makeStore } from "../store";
import { clearFilters, loadOrders, selectFiltered, selectKpis, setCategory, setQuery, setRegion } from "../features/ordersSlice";
import * as api from "../api";
import type { Order } from "../types";

jest.mock("../api", () => ({ ...jest.requireActual("../api"), fetchOrders: jest.fn() }));
const fetchOrders = api.fetchOrders as jest.Mock;

const orders: Order[] = [
  { id: "ORD-1", date: "2026-01-05", region: "North", category: "Home", amount: 1000, status: "Delivered" },
  { id: "ORD-2", date: "2026-01-09", region: "South", category: "Home", amount: 2000, status: "Pending" },
  { id: "ORD-3", date: "2026-02-02", region: "South", category: "Apparel", amount: 3000, status: "Cancelled" },
];

describe("orders slice", () => {
  it("loads orders and tracks status", async () => {
    fetchOrders.mockResolvedValueOnce(orders);
    const store = makeStore();
    const pending = store.dispatch(loadOrders());
    expect(store.getState().orders.status).toBe("loading");
    await pending;
    expect(store.getState().orders.status).toBe("succeeded");
    expect(store.getState().orders.items).toHaveLength(3);
  });

  it("stores the error message when loading fails", async () => {
    fetchOrders.mockRejectedValueOnce(new Error("Network down"));
    const store = makeStore();
    await store.dispatch(loadOrders());
    expect(store.getState().orders.status).toBe("failed");
    expect(store.getState().orders.error).toBe("Network down");
  });

  it("filters by region, category and order id, and clears filters", async () => {
    fetchOrders.mockResolvedValueOnce(orders);
    const store = makeStore();
    await store.dispatch(loadOrders());

    store.dispatch(setRegion("South"));
    expect(selectFiltered(store.getState()).map((o) => o.id)).toEqual(["ORD-2", "ORD-3"]);

    store.dispatch(setCategory("Home"));
    expect(selectFiltered(store.getState()).map((o) => o.id)).toEqual(["ORD-2"]);

    store.dispatch(setQuery("ord-1"));
    expect(selectFiltered(store.getState())).toHaveLength(0);

    store.dispatch(clearFilters());
    expect(selectFiltered(store.getState())).toHaveLength(3);
  });

  it("excludes cancelled orders from revenue", async () => {
    fetchOrders.mockResolvedValueOnce(orders);
    const store = makeStore();
    await store.dispatch(loadOrders());
    const kpis = selectKpis(store.getState());
    expect(kpis.revenue).toBe(3000);
    expect(kpis.avgOrder).toBe(1500);
    expect(kpis.deliveredRate).toBe(33);
  });
});
