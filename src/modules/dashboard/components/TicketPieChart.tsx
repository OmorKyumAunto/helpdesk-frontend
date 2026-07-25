import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useGetTicketDashboardCountQuery } from "../../ticket/api/ticketEndpoint";
import { CHART_INK, TICKET_COLORS } from "./chartTheme";

// Fixed order — colour follows the status, never its rank in the data.
const ORDER: (keyof typeof TICKET_COLORS)[] = [
  "Solved",
  "In Progress",
  "Unsolved",
  "Forward",
];

const TicketDonutChart = () => {
  const { data } = useGetTicketDashboardCountQuery();
  const {
    total_solve = 0,
    total_forward = 0,
    total_inprogress = 0,
    total_unsolved = 0,
  } = data?.data || {};

  const valueByLabel: Record<string, number> = {
    Solved: total_solve,
    "In Progress": total_inprogress,
    Unsolved: total_unsolved,
    Forward: total_forward,
  };

  const series = ORDER.map((l) => valueByLabel[l]);
  const total = series.reduce((s, n) => s + n, 0);

  const options: ApexOptions = {
    chart: {
      type: "donut",
      fontFamily: "inherit",
      // Quick, non-gradual draw. The slice-by-slice "animateGradually" default
      // is the janky part, especially while the card is also sliding in.
      animations: { enabled: true, speed: 350, animateGradually: { enabled: false } },
    },
    labels: ORDER as unknown as string[],
    colors: ORDER.map((l) => TICKET_COLORS[l]),
    stroke: { width: 2, colors: [CHART_INK.surface] }, // 2px surface gap between slices
    // Counts live in the legend (always legible); centre shows the total.
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
              formatter: (v) => String(v),
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
          `${v} ticket${v === 1 ? "" : "s"}` +
          (total ? ` · ${Math.round((v / total) * 100)}%` : ""),
      },
    },
    responsive: [
      { breakpoint: 480, options: { legend: { position: "bottom" } } },
    ],
  };

  return (
    <div style={{ maxWidth: 280, margin: "0 auto" }}>
      <ReactApexChart options={options} series={series} type="donut" height={280} />
    </div>
  );
};

export default TicketDonutChart;
