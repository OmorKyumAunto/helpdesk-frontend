import { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { useGetCategoryWiseDashboardDataQuery } from "../api/ticketEndpoint";

const ApexChart = () => {
  const { data, error, isLoading } = useGetCategoryWiseDashboardDataQuery();

  const [state, setState] = useState<{
    series: number[];
    options: ApexCharts.ApexOptions;
  }>({
    series: [],
    options: {
      chart: {
        width: "100%",
        type: "donut",
      },
      dataLabels: {
        enabled: false,
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: "100%",
            },
            legend: {
              show: false,
            },
          },
        },
      ],
      legend: {
        position: "right",
        offsetY: 0,
        height: 300,
      },
    },
  });

  useEffect(() => {
    if (data) {
      const categories =
        data?.data?.map((item: any) => item.category_title || "") || [];

      const ticketCounts =
        data?.data?.map((item: any) => item.ticket_count || 0) || [];

      setState((prevState) => ({
        series: ticketCounts as number[],
        options: {
          ...prevState.options,
          labels: categories as string[],
        },
      }));
    }
  }, [data]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;

  return (
    <div
      className="chart-container"
      style={{
        padding: "10px",
      }}
    >
      <div
        className="chart-wrap"
        style={{ maxWidth: "500px", margin: "0 auto" }}
      >
        <ReactApexChart
          options={state.options}
          series={state.series}
          type="donut"
          width="100%"
        />
      </div>
    </div>
  );
};

export default ApexChart;
