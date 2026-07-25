import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useGetDashboardGraphDataQuery } from "../api/dashboardEndPoints";
import { CHART_INK, SERIES_BLUE, SERIES_GREEN } from "./chartTheme";

/** Stock vs Disbursement per unit/period — two validated series, one y-axis. */
const GraphChartV2 = () => {
  const { data } = useGetDashboardGraphDataQuery({});

  return (
    <div style={{ height: 320 }}>
      <ResponsiveContainer>
        <BarChart
          data={data?.data}
          barGap={4}
          barCategoryGap="28%"
          margin={{ top: 8, right: 12, bottom: 4, left: -8 }}
        >
          <CartesianGrid
            vertical={false}
            stroke={CHART_INK.grid}
            strokeDasharray="0"
          />
          <XAxis
            dataKey="name"
            axisLine={{ stroke: CHART_INK.axis }}
            tickLine={false}
            tick={{ fill: CHART_INK.muted, fontSize: 12 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: CHART_INK.muted, fontSize: 12 }}
            width={44}
          />
          <Tooltip
            cursor={{ fill: "rgba(37,99,235,0.06)" }}
            contentStyle={{
              borderRadius: 10,
              border: `1px solid ${CHART_INK.grid}`,
              fontSize: 12,
              boxShadow: "0 8px 24px -12px rgba(16,24,40,.4)",
            }}
          />
          <Legend
            iconType="circle"
            wrapperStyle={{ fontSize: 12, color: CHART_INK.secondary, paddingTop: 6 }}
          />
          <Bar
            dataKey="total_asset"
            fill={SERIES_BLUE}
            name="Total Asset"
            radius={[4, 4, 0, 0]}
            maxBarSize={38}
            isAnimationActive={false}
          />
          <Bar
            dataKey="total_assign_asset"
            fill={SERIES_GREEN}
            name="Total Disbursement"
            radius={[4, 4, 0, 0]}
            maxBarSize={38}
            isAnimationActive={false}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GraphChartV2;
