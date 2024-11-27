import { ApexOptions } from "apexcharts";
import ReactApexChart from "react-apexcharts";
import { useGetDashboardPieDataQuery } from "../api/dashboardEndPoints";

const ReactPieChart = () => {
  const { data: pieData } = useGetDashboardPieDataQuery();
  const {
    total_laptop,
    total_desktop,
    total_printer,
    total_accessories,
    total_monitors,
  } = pieData?.data || {};
  const data = [
    { name: "Laptops", value: total_laptop },
    { name: "Desktops", value: total_desktop },
    { name: "Printers", value: total_printer },
    { name: "Accessories", value: total_accessories },
    { name: "Monitors", value: total_monitors || 0 },
  ];

  const options: ApexOptions = {
    chart: {
      type: "pie",
    },
    labels: data.map((item) => item.name),
    series: data.map((item) => item.value),
    colors: ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"],
    legend: {
      position: "bottom",
    },
    dataLabels: {
      enabled: true,
      formatter: function (val: any, opts: any) {
        return (
          opts.w.config.labels[opts.seriesIndex] +
          ": " +
          opts.w.config.series[opts.seriesIndex]
        );
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 300,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  return (
    <div>
      <ReactApexChart
        options={options}
        series={options.series}
        type="pie"
        height={400}
      />
    </div>
  );
};

export default ReactPieChart;
