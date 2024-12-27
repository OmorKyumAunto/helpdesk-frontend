import { ApexOptions } from "apexcharts";
import ReactApexChart from "react-apexcharts";
import { useGetTicketDashboardCountQuery } from "../../ticket/api/ticketEndpoint";

const TicketPieChart = () => {
  const { data } = useGetTicketDashboardCountQuery();
  const { total_solve, total_forward, total_inprogress, total_unsolved } =
    data?.data || {};
  const ticketData = [
    {
      name: "Solved",
      value: total_solve || 0,
    },
    {
      name: "In Progress",
      value: total_inprogress || 0,
    },
    {
      name: "Unsolved",
      value: total_unsolved || 0,
    },
    {
      name: "Forward",
      value: total_forward || 0,
    },
  ];
  const options: ApexOptions = {
    chart: {
      type: "pie",
    },
    labels: ticketData?.map((item) => item?.name),
    series: ticketData?.map((item) => item?.value),
    colors: ["#72b92b", "#0088FE", "#FF0000", "#FFA500", "#8884d8"],
    // colors: ["", "", "#FFBB28", "#FF8042", "#8884d8"],
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

export default TicketPieChart;
