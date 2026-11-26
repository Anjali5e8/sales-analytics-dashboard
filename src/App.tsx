import { lazy, Suspense, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./hooks";
import { loadOrders, selectFiltered } from "./features/ordersSlice";
import { FilterBar } from "./components/FilterBar";
import { KpiRow } from "./components/KpiRow";
import { OrdersTable } from "./components/OrdersTable";

// Recharts is the heaviest dependency, so the chart loads as a separate chunk.
const RevenueChart = lazy(() => import("./components/RevenueChart").then((m) => ({ default: m.RevenueChart })));

export default function App() {
  const dispatch = useAppDispatch();
  const status = useAppSelector((s) => s.orders.status);
  const error = useAppSelector((s) => s.orders.error);
  const rows = useAppSelector(selectFiltered);

  useEffect(() => {
    dispatch(loadOrders());
  }, [dispatch]);

  return (
    <main className="page">
      <header>
        <h1>Sales performance</h1>
        <p>Orders from January to October 2026, across four regions.</p>
      </header>

      <FilterBar />

      {status === "loading" || status === "idle" ? (
        <div className="state" aria-busy="true">Loading orders…</div>
      ) : status === "failed" ? (
        <div className="state error" role="alert">
          <p>{error}</p>
          <button type="button" onClick={() => dispatch(loadOrders())}>Try again</button>
        </div>
      ) : (
        <>
          <KpiRow />
          <section>
            <h2>Monthly revenue</h2>
            <Suspense fallback={<div className="state">Loading chart…</div>}>
              <RevenueChart />
            </Suspense>
          </section>
          <section>
            <h2>Orders <small>{rows.length.toLocaleString("en-IN")} shown</small></h2>
            <OrdersTable rows={rows} />
          </section>
        </>
      )}
    </main>
  );
}
