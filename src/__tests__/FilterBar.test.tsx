import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { makeStore } from "../store";
import { FilterBar } from "../components/FilterBar";

function setup() {
  const store = makeStore();
  render(
    <Provider store={store}>
      <FilterBar />
    </Provider>,
  );
  return store;
}

describe("FilterBar", () => {
  it("updates the store when the region changes", async () => {
    const store = setup();
    await userEvent.selectOptions(screen.getByLabelText("Region"), "South");
    expect(store.getState().orders.filters.region).toBe("South");
  });

  it("updates the store when searching by order id", async () => {
    const store = setup();
    await userEvent.type(screen.getByLabelText("Order ID"), "ORD-1");
    expect(store.getState().orders.filters.query).toBe("ORD-1");
  });

  it("resets every filter with Clear filters", async () => {
    const store = setup();
    await userEvent.selectOptions(screen.getByLabelText("Category"), "Home");
    await userEvent.click(screen.getByRole("button", { name: "Clear filters" }));
    expect(store.getState().orders.filters).toEqual({ region: "All", category: "All", query: "" });
  });
});
