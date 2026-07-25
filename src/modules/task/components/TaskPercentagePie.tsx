import { ApexOptions } from "apexcharts";
import ReactApexChart from "react-apexcharts";
import { useGetDashboardCategoryWiseDataQuery } from "../api/taskDashboardEndpoint";
import { IDashboardCategoryWiseData } from "../types/taskTypes";

// Coordinated categorical palette (fixed order), + grey for the "Other" roll-up.
const PALETTE = ["#2563eb", "#eb6834", "#1baf7a", "#eda100", "#e87ba4", "#7c3aed", "#16a34a"];
const OTHER_COLOR = "#94a3b8";
const TOP_N = 7;
const INK = { primary: "#0f172a", secondary: "#52514e", muted: "#898781", surface: "#ffffff" };

const TaskPercentagePie = () => {
  const { data } = useGetDashboardCategoryWiseDataQuery();

  const all = (data?.data || [])
    .map((item: IDashboardCategoryWiseData) => ({
      name: item.category_title || "Uncategorised",
      value: Number(item.task_count) || 0,
    }))
    .filter((r) => r.value > 0)
    .sort((a, b) => b.value - a.value);

  // Long tail → single "Other" slice, so the donut stays readable.
  let rows = all;
  let hasOther = false;
  if (all.length > TOP_N + 1) {
    const head = all.slice(0, TOP_N);
    const tail = all.slice(TOP_N);
    rows = [...head, { name: `Other (${tail.length})`, value: tail.reduce((s, r) => s + r.value, 0) }];
    hasOther = true;
  }
  const colors = rows.map((_, i) =>
    hasOther && i === rows.length - 1 ? OTHER_COLOR : PALETTE[i % PALETTE.length]
  );

  const series = rows.map((r) => r.value);
  const total = series.reduce((s, n) => s + n, 0);

  const options: ApexOptions = {
    chart: {
      type: "donut",
      fontFamily: "inherit",
      animations: { enabled: true, speed: 350, animateGradually: { enabled: false } },
    },
    labels: rows.map((r) => r.name),
    colors,
    stroke: { width: 2, colors: [INK.surface] },
    dataLabels: { enabled: false },
    legend: {
      position: "bottom",
      horizontalAlign: "center",
      fontSize: "12.5px",
      labels: { colors: INK.secondary },
      markers: { size: 6 } as any,
      itemMargin: { horizontal: 8, vertical: 3 },
      formatter: (name, opts) => `${name}  ${opts.w.globals.series[opts.seriesIndex]}`,
    },
    plotOptions: {
      pie: {
        donut: {
          size: "66%",
          labels: {
            show: true,
            name: { show: false },
            value: { fontSize: "24px", fontWeight: "800", color: INK.primary, offsetY: 6 },
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
          `${v} task${v === 1 ? "" : "s"}` + (total ? ` · ${Math.round((v / total) * 100)}%` : ""),
      },
    },
  };

  if (!rows.length)
    return <div style={{ padding: "40px 0", textAlign: "center", color: INK.muted }}>No task data</div>;

  return (
    <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
      <div style={{ width: "100%", maxWidth: 320 }}>
        <ReactApexChart options={options} series={series} type="donut" height={300} width="100%" />
      </div>
    </div>
  );
};

export default TaskPercentagePie;
