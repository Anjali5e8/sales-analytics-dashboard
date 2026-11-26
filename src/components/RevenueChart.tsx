import { memo } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useAppSelector } from "../hooks";
import { selectMonthlyRevenue } from "../features/ordersSlice";
import { formatINR } from "../format";

function RevenueChartBase() {
  const data = useAppSelector(selectMonthlyRevenue);
  if (data.length === 0) return <div className="empty">No revenue to chart for these filters.</div>;
  return (
    <div className="chart" role="img" aria-label="Monthly revenue bar chart">
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="#D9DEE7" />
          <XAxis dataKey="month" tickLine={false} axisLine={false} />
          <YAxis tickFormatter={(v: number) => `${Math.round(v / 100000)}L`} tickLine={false} axisLine={false} width={44} />
          <Tooltip formatter={(v: number) => formatINR(v)} cursor={{ fill: "#E4E8F0" }} />
          <Bar dataKey="revenue" fill="#3B4FD8" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export const RevenueChart = memo(RevenueChartBase);
