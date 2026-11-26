# Sales Analytics Dashboard

A BI-style dashboard built to practise the skills analytics product teams look for: React, TypeScript, Redux Toolkit, performance work and tests.

## Run it
```bash
npm install
npm run dev        # http://localhost:5173  (add ?fail=1 to see the error state)
npm test           # Jest + React Testing Library
npm run build
```

## What it demonstrates
- **State with Redux Toolkit:** one `orders` slice holds items, load status, error and filters. `createAsyncThunk` handles the API call (`loadOrders`). Memoised selectors (`createSelector`) derive filtered rows, KPIs and monthly revenue, so nothing is recomputed unless items or filters change.
- **REST integration:** `src/api.ts` mocks the endpoint; swap the body for `fetch("/api/orders")` (instructions in the file). The UI has loading, error (with retry) and empty states.
- **Performance:** the 5,000-row table is virtualised (only visible rows plus a small buffer are in the DOM); components are wrapped in `memo`; the chart is code-split with `React.lazy` so Recharts loads as a separate chunk.
- **Reusable components:** `FilterBar`, `KpiRow`, `RevenueChart`, `OrdersTable`, each with one job.
- **Tests:** Jest + React Testing Library cover the slice (loading, failure, filters, KPIs), the filter bar and the virtualised table.

## Interview talking points
- Why Redux Toolkit here: filters and loaded data are shared by the KPIs, chart and table, so one source of truth avoids prop drilling.
- Why `createSelector`: filtering is the expensive step, so it is cached.
- How to measure: React DevTools Profiler (re-renders) and Lighthouse; record before/after numbers once you have run them yourself.
- What you would add next: server-side pagination, URL-synced filters, date-range filter.
