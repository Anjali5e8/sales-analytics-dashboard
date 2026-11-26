import { memo, useState } from "react";
import type { Order } from "../types";
import { formatINR } from "../format";

export const ROW_HEIGHT = 40;
export const VIEWPORT_HEIGHT = 400;
const OVERSCAN = 5;

const Row = memo(function Row({ order, top }: { order: Order; top: number }) {
  return (
    <div className="trow" role="row" style={{ transform: `translateY(${top}px)`, height: ROW_HEIGHT }}>
      <span role="cell">{order.id}</span>
      <span role="cell">{order.date}</span>
      <span role="cell">{order.region}</span>
      <span role="cell">{order.category}</span>
      <span role="cell" className="num">{formatINR(order.amount)}</span>
      <span role="cell"><b className={`pill ${order.status.toLowerCase()}`}>{order.status}</b></span>
    </div>
  );
});

/** Windowed table: only the rows inside the scroll viewport (plus a small buffer) are in the DOM. */
function OrdersTableBase({ rows }: { rows: Order[] }) {
  const [scrollTop, setScrollTop] = useState(0);

  if (rows.length === 0) {
    return <div className="empty">No orders match these filters. Clear a filter to see more.</div>;
  }

  const start = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - OVERSCAN);
  const end = Math.min(rows.length, Math.ceil((scrollTop + VIEWPORT_HEIGHT) / ROW_HEIGHT) + OVERSCAN);

  return (
    <div className="table" role="table" aria-label="Orders" aria-rowcount={rows.length}>
      <div className="thead" role="row">
        <span role="columnheader">Order</span>
        <span role="columnheader">Date</span>
        <span role="columnheader">Region</span>
        <span role="columnheader">Category</span>
        <span role="columnheader" className="num">Amount</span>
        <span role="columnheader">Status</span>
      </div>
      <div className="tbody" style={{ height: VIEWPORT_HEIGHT }} onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}>
        <div style={{ height: rows.length * ROW_HEIGHT, position: "relative" }}>
          {rows.slice(start, end).map((o, i) => (
            <Row key={o.id} order={o} top={(start + i) * ROW_HEIGHT} />
          ))}
        </div>
      </div>
    </div>
  );
}

export const OrdersTable = memo(OrdersTableBase);
