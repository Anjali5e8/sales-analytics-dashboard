import { createAsyncThunk, createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchOrders } from "../api";
import type { Filters, Order } from "../types";
import type { RootState } from "../store";

export type LoadStatus = "idle" | "loading" | "succeeded" | "failed";

interface OrdersState {
  items: Order[];
  status: LoadStatus;
  error: string | null;
  filters: Filters;
}

export const initialFilters: Filters = { region: "All", category: "All", query: "" };

const initialState: OrdersState = { items: [], status: "idle", error: null, filters: initialFilters };

export const loadOrders = createAsyncThunk("orders/load", () => fetchOrders());

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    setRegion(state, action: PayloadAction<string>) {
      state.filters.region = action.payload;
    },
    setCategory(state, action: PayloadAction<string>) {
      state.filters.category = action.payload;
    },
    setQuery(state, action: PayloadAction<string>) {
      state.filters.query = action.payload;
    },
    clearFilters(state) {
      state.filters = initialFilters;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadOrders.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loadOrders.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(loadOrders.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Something went wrong.";
      });
  },
});

export const { setRegion, setCategory, setQuery, clearFilters } = ordersSlice.actions;
export default ordersSlice.reducer;

// Selectors are memoised with createSelector so filtering 5,000 rows only re-runs
// when the items or the filters actually change.
const selectItems = (s: RootState) => s.orders.items;
export const selectFilters = (s: RootState) => s.orders.filters;

export const selectFiltered = createSelector([selectItems, selectFilters], (items, f) => {
  const q = f.query.trim().toLowerCase();
  return items.filter(
    (o) =>
      (f.region === "All" || o.region === f.region) &&
      (f.category === "All" || o.category === f.category) &&
      (q === "" || o.id.toLowerCase().includes(q)),
  );
});

export const selectKpis = createSelector([selectFiltered], (rows) => {
  const live = rows.filter((o) => o.status !== "Cancelled");
  const revenue = live.reduce((sum, o) => sum + o.amount, 0);
  const delivered = rows.filter((o) => o.status === "Delivered").length;
  return {
    revenue,
    orders: rows.length,
    avgOrder: live.length ? Math.round(revenue / live.length) : 0,
    deliveredRate: rows.length ? Math.round((delivered / rows.length) * 100) : 0,
  };
});

export const selectMonthlyRevenue = createSelector([selectFiltered], (rows) => {
  const byMonth = new Map<string, number>();
  for (const o of rows) {
    if (o.status === "Cancelled") continue;
    const key = o.date.slice(0, 7);
    byMonth.set(key, (byMonth.get(key) ?? 0) + o.amount);
  }
  return [...byMonth.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([month, revenue]) => ({ month, revenue }));
});
