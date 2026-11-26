import { memo } from "react";
import { useAppSelector } from "../hooks";
import { selectKpis } from "../features/ordersSlice";
import { formatINR } from "../format";

function KpiRowBase() {
  const k = useAppSelector(selectKpis);
  const items = [
    ["Revenue", formatINR(k.revenue)],
    ["Orders", k.orders.toLocaleString("en-IN")],
    ["Average order", formatINR(k.avgOrder)],
    ["Delivered", `${k.deliveredRate}%`],
  ];
  return (
    <dl className="kpis">
      {items.map(([label, value]) => (
        <div key={label}>
          <dt>{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
}

export const KpiRow = memo(KpiRowBase);
