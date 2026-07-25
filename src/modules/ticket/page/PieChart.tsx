import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useGetCategoryWiseDashboardDataQuery } from "../api/ticketEndpoint";

// Coordinated categorical palette (assigned in fixed order, never cycled).
// 7 hues + a neutral grey reserved for the rolled-up "Other" slot.
const CATEGORY_PALETTE = [
  "#2563eb", // blue
  "#eb6834", // orange
  "#1baf7a", // teal
  "#eda100", // amber
  "#e87ba4", // magenta
  "#7c3aed", // violet
  "#16a34a", // green
];
const OTHER_COLOR = "#94a3b8"; // grey

// Beyond this many slices a donut is unreadable and the legend overflows, so
// the long tail is summed into a single "Other" slice.
const TOP_N = 7;

const INK = { primary: "#0f172a", secondary: "#52514e", muted: "#898781", surface: "#ffffff" };

const CategoryDonut = () => {
  const { data, error, isLoading } = useGetCategoryWiseDashboardDataQuery();

  const all = (data?.data || [])
    .map((item: any) => ({
      name: item.category_title || "Uncategorised",
      value: Number(item.ticket_count) || 0,
    }))
    .filter((r) => r.value > 0)
    .sort((a, b) => b.value - a.value);

  // Keep the biggest categories; fold everything else into "Other".
  let rows = all;
  let hasOther = false;
  if (all.length > TOP_N + 1) {
    const head = all.slice(0, TOP_N);
    const tail = all.slice(TOP_N);
    const otherTotal = tail.reduce((s, r) => s + r.value, 0);
    rows = [...head, { name: `Other (${tail.length})`, value: otherTotal }];
    hasOther = true;
  }
  const colors = rows.map((_, i) =>
    hasOther && i === rows.length - 1 ? OTHER_COLOR : CATEGORY_PALETTE[i % CATEGORY_PALETTE.length]
  );
  const series = rows.map((r) => r.value);
  const labels = rows.map((r) => r.name);
  const total = series.reduce((s, n) => s + n, 0);

  const options: ApexOptions = {
    chart: {
      type: "donut",
      fontFamily: "inherit",
      animations: { enabled: true, speed: 350, animateGradually: { enabled: false } },
    },
    labels,
    colors,
    stroke: { width: 2, colors: [INK.surface] },
    dataLabels: { enabled: false },
    legend: {
      // Bottom-centred so the donut sits in the middle of the card at every
      // width (a right legend shoves the pie to the left).
      position: "bottom",
      horizontalAlign: "center",
      fontSize: "12.5px",
      labels: { colors: INK.secondary },
      markers: { size: 6 } as any,
      itemMargin: { horizontal: 8, vertical: 3 },
      formatter: (name, opts) =>
        `${name}  ${opts.w.globals.series[opts.seriesIndex]}`,
    },
    plotOptions: {
      pie: {
        donut: {
          size: "66%",
          labels: {
            show: true,
            name: { fontSize: "12px", color: INK.muted, offsetY: 20 },
            value: {
              fontSize: "26px",
              fontWeight: "800",
              color: INK.primary,
              offsetY: -14,
            },
            total: {
              show: true,
              label: "Total",
              color: INK.muted,
              fontSize: "12px",
              formatter: () => String(total),
            },
          },
        },
      },
    },
    tooltip: {
      y: {
        formatter: (v) =>
          `${v} ticket${v === 1 ? "" : "s"}` +
          (total ? ` · ${Math.round((v / total) * 100)}%` : ""),
      },
    },
  };

  if (isLoading)
    return <div style={{ padding: "48px 0", textAlign: "center", color: INK.muted }}>Loading…</div>;
  if (error)
    return <div style={{ padding: "48px 0", textAlign: "center", color: INK.muted }}>Could not load category data</div>;
  if (!rows.length)
    return <div style={{ padding: "48px 0", textAlign: "center", color: INK.muted }}>No category data</div>;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        width: "100%",
        padding: 4,
      }}
    >
      <div style={{ width: "100%", maxWidth: 400 }}>
        <ReactApexChart
          options={options}
          series={series}
          type="donut"
          height={320}
          width="100%"
        />
      </div>
    </div>
  );
};

export default CategoryDonut;
