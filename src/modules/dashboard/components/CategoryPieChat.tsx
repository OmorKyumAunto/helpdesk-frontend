import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import {
  useGetDashboardPieChartDataForAdminQuery,
  useGetDashboardPieDataQuery,
} from "../api/dashboardEndPoints";
import { useGetMeQuery } from "../../../app/api/userApi";
import { CHART_INK, CATEGORY_COLORS } from "./chartTheme";

const CategoryPieChart = () => {
  const { data: pieData } = useGetDashboardPieDataQuery();
  const { data: pieDataForAdmin } = useGetDashboardPieChartDataForAdminQuery();
  const { data: profile } = useGetMeQuery();
  const { role_id } = profile?.data || {};

  const {
    total_laptop,
    total_desktop,
    total_printer,
    total_accessories,
    total_monitors,
  } = pieData?.data || {};
  const {
    desktop_count,
    laptop_count,
    monitor_count,
    printer_count,
    accessories_count,
  } = pieDataForAdmin?.data || {};

  // Same categories and data source as before — only presentation changed.
  const rows = [
    { name: "Laptops", value: role_id === 1 ? total_laptop : laptop_count },
    { name: "Desktops", value: role_id === 1 ? total_desktop : desktop_count },
    { name: "Printers", value: role_id === 1 ? total_printer : printer_count },
    {
      name: "Accessories",
      value: role_id === 1 ? total_accessories : accessories_count || 0,
    },
    { name: "Monitors", value: role_id === 1 ? total_monitors : monitor_count },
  ]
    .map((r) => ({ ...r, value: Number(r.value) || 0 }))
    .filter((r) => r.value > 0);

  const series = rows.map((r) => r.value);
  const total = series.reduce((s, n) => s + n, 0);

  const options: ApexOptions = {
    chart: {
      type: "donut",
      fontFamily: "inherit",
      animations: { enabled: true, speed: 350, animateGradually: { enabled: false } },
    },
    labels: rows.map((r) => r.name),
    // Slot colours are position-stable regardless of which categories survive
    // the >0 filter, so a category never changes colour between roles/units.
    colors: CATEGORY_COLORS.slice(0, rows.length),
    stroke: { width: 2, colors: [CHART_INK.surface] },
    // On-slice numbers collide on thin slices — the count lives in the legend
    // (always legible) and the centre shows the total.
    dataLabels: { enabled: false },
    legend: {
      position: "bottom",
      fontSize: "12.5px",
      labels: { colors: CHART_INK.secondary },
      markers: { size: 6 } as any,
      itemMargin: { horizontal: 9, vertical: 4 },
      formatter: (name, opts) =>
        `${name}  ${opts.w.globals.series[opts.seriesIndex]}`,
    },
    plotOptions: {
      pie: {
        donut: {
          size: "68%",
          labels: {
            show: true,
            name: { fontSize: "12px", color: CHART_INK.muted, offsetY: 20 },
            value: {
              fontSize: "26px",
              fontWeight: "800",
              color: CHART_INK.primary,
              offsetY: -14,
            },
            total: {
              show: true,
              label: "Total",
              color: CHART_INK.muted,
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
          `${v} unit${v === 1 ? "" : "s"}` +
          (total ? ` · ${Math.round((v / total) * 100)}%` : ""),
      },
    },
    responsive: [
      { breakpoint: 480, options: { legend: { position: "bottom" } } },
    ],
  };

  if (!rows.length) {
    return (
      <div style={{ padding: "40px 0", textAlign: "center", color: CHART_INK.muted }}>
        No category data
      </div>
    );
  }

  // Fill and vertically centre within the card — its height is stretched to
  // match the taller bar chart beside it, which otherwise left the donut
  // floating at the top with empty space below.
  return (
    <div
      style={{
        height: "100%",
        minHeight: 300,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ width: "100%", maxWidth: 300 }}>
        <ReactApexChart options={options} series={series} type="donut" height={300} />
      </div>
    </div>
  );
};

export default CategoryPieChart;
