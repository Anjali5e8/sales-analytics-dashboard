import { render, screen } from "@testing-library/react";
import { OrdersTable } from "../components/OrdersTable";
import type { Order } from "../types";

const make = (n: number): Order[] =>
  Array.from({ length: n }, (_, i) => ({
    id: `ORD-${i}`, date: "2026-01-01", region: "North", category: "Home", amount: 500, status: "Delivered" as const,
  }));

describe("OrdersTable", () => {
  it("shows a helpful empty state", () => {
    render(<OrdersTable rows={[]} />);
    expect(screen.getByText(/No orders match these filters/)).toBeInTheDocument();
  });

  it("renders only a window of rows for large lists", () => {
    render(<OrdersTable rows={make(5000)} />);
    const rendered = screen.getAllByRole("row").length - 1; // minus header row
    expect(rendered).toBeGreaterThan(0);
    expect(rendered).toBeLessThan(30);
    expect(screen.getByRole("table")).toHaveAttribute("aria-rowcount", "5000");
  });
});
