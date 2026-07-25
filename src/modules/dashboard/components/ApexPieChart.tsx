import {
  Bar,
  BarChart,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useGetDashboardBloodDataQuery } from "../api/dashboardEndPoints";
import { CHART_INK, SINGLE_HUE } from "./chartTheme";

interface BloodData {
  total_a_positive: number;
  total_b_positive: number;
  total_ab_positive: number;
  total_o_positive: number;
  total_a_negative: number;
  total_b_negative: number;
  total_ab_negative: number;
  total_0_negative: number;
}

/**
 * Blood-group distribution.
 *
 * Was an 8-slice pie with eight hand-picked colours — no set of 8 hues can pass
 * the colour-blind all-pairs floors a pie demands, so identity rode on colour
 * alone and failed for CVD viewers. This is one series (a count) across eight
 * categories = a magnitude comparison, whose correct form is a bar chart: one
 * hue, sorted, directly labelled. Colour does no work, so there is nothing to
 * fail. Sorting also makes "most common group" instantly readable.
 */
const BloodGroupChart = () => {
  const { data, isLoading, error } = useGetDashboardBloodDataQuery() as {
    data?: { data?: BloodData };
    error?: any;
    isLoading: boolean;
  };

  const b = data?.data;
  const rows = [
    { name: "A+", value: b?.total_a_positive || 0 },
    { name: "A-", value: b?.total_a_negative || 0 },
    { name: "B+", value: b?.total_b_positive || 0 },
    { name: "B-", value: b?.total_b_negative || 0 },
    { name: "AB+", value: b?.total_ab_positive || 0 },
    { name: "AB-", value: b?.total_ab_negative || 0 },
    { name: "O+", value: b?.total_o_positive || 0 },
    { name: "O-", value: b?.total_0_negative || 0 },
  ].sort((x, y) => y.value - x.value);

  const max = Math.max(...rows.map((r) => r.value), 1);

  if (isLoading)
    return (
      <div style={{ padding: "40px 0", textAlign: "center", color: CHART_INK.muted }}>
        Loading…
      </div>
    );
  if (error)
    return (
      <div style={{ padding: "40px 0", textAlign: "center", color: CHART_INK.muted }}>
        Could not load blood group data
      </div>
    );

  return (
    <ResponsiveContainer width="100%" height={270}>
      <BarChart
        data={rows}
        layout="vertical"
        margin={{ top: 4, right: 30, bottom: 4, left: 8 }}
        barCategoryGap={6}
      >
        <XAxis type="number" hide domain={[0, max]} />
        <YAxis
          type="category"
          dataKey="name"
          width={38}
          axisLine={false}
          tickLine={false}
          tick={{ fill: CHART_INK.secondary, fontSize: 12, fontWeight: 600 }}
        />
        <Tooltip
          cursor={{ fill: "rgba(37,99,235,0.06)" }}
          contentStyle={{
            borderRadius: 10,
            border: `1px solid ${CHART_INK.grid}`,
            fontSize: 12,
            boxShadow: "0 8px 24px -12px rgba(16,24,40,.4)",
          }}
          formatter={(v: any) => [`${v} people`, "Count"]}
        />
        {/* 4px rounded data-end anchored to the baseline. */}
        <Bar
          dataKey="value"
          radius={[0, 5, 5, 0]}
          maxBarSize={22}
          isAnimationActive={false}
        >
          {rows.map((_, i) => (
            <Cell key={i} fill={SINGLE_HUE} />
          ))}
          <LabelList
            dataKey="value"
            position="right"
            style={{ fill: CHART_INK.secondary, fontSize: 12, fontWeight: 700 }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BloodGroupChart;
