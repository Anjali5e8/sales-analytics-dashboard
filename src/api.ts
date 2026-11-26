import type { Order, Status } from "./types";

export const REGIONS = ["North", "South", "East", "West"];
export const CATEGORIES = ["Electronics", "Apparel", "Home", "Grocery"];
const STATUSES: Status[] = ["Delivered", "Delivered", "Delivered", "Pending", "Cancelled"];

// Deterministic pseudo-random generator so the demo data is stable between reloads.
function rng(seed: number) {
  return () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
}

function buildOrders(count: number): Order[] {
  const rand = rng(42);
  const start = Date.UTC(2026, 0, 1);
  return Array.from({ length: count }, (_, i) => {
    const day = Math.floor(rand() * 300);
    return {
      id: `ORD-${String(10000 + i)}`,
      date: new Date(start + day * 86_400_000).toISOString().slice(0, 10),
      region: REGIONS[Math.floor(rand() * REGIONS.length)],
      category: CATEGORIES[Math.floor(rand() * CATEGORIES.length)],
      amount: Math.round(300 + rand() * 24_700),
      status: STATUSES[Math.floor(rand() * STATUSES.length)],
    };
  });
}

/**
 * Stand-in for a REST call. To use a real backend, replace the body with:
 *   const res = await fetch("/api/orders");
 *   if (!res.ok) throw new Error(`Request failed (${res.status})`);
 *   return res.json();
 * Open the app with ?fail=1 to see the error state.
 */
export async function fetchOrders(): Promise<Order[]> {
  await new Promise((r) => setTimeout(r, 700));
  if (typeof window !== "undefined" && window.location.search.includes("fail=1")) {
    throw new Error("Could not load orders. Check your connection and try again.");
  }
  return buildOrders(5000);
}
