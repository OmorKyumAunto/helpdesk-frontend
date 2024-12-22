import { ApexOptions } from "apexcharts";
import ReactApexChart from "react-apexcharts";
import {
  useGetDashboardPieChartDataForAdminQuery,
  useGetDashboardPieDataQuery,
} from "../api/dashboardEndPoints";
import { useGetMeQuery } from "../../../app/api/userApi";

const ReactPieChart = () => {
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
  const data = [
    { name: "Laptops", value: role_id === 1 ? total_laptop : laptop_count },
    { name: "Desktops", value: role_id === 1 ? total_desktop : desktop_count },
    { name: "Printers", value: role_id === 1 ? total_printer : printer_count },
    {
      name: "Accessories",
      value: role_id === 1 ? total_accessories : accessories_count || 0,
    },
    { name: "Monitors", value: role_id === 1 ? total_monitors : monitor_count },
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
