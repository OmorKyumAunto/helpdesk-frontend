import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { useGetTicketDashboardCountQuery } from "../../ticket/api/ticketEndpoint";
import { ApexOptions } from "apexcharts";

const TicketDonutChart = () => {
  const { data } = useGetTicketDashboardCountQuery();
  const {
    total_solve = 0,
    total_forward = 0,
    total_inprogress = 0,
    total_unsolved = 0,
  } = data?.data || {};

  const [state, setState] = useState<{
    series: number[];
    options: ApexOptions;
  }>({
    series: [44, 55, 41, 17],
    options: {
      chart: {
        type: "donut",
      },
      labels: ["Solved", "In Progress", "Unsolved", "Forward"],
      colors: ["#72b92b", "#0088FE", "#FF0000", "#FFA500"],
      legend: {
        position: "bottom",
      },
      plotOptions: {
        pie: {
          customScale: 0.85, // 👈 controls outer radius (smaller circle)
          donut: {
            size: "65%", // 👈 controls inner radius (hole size)
            labels: {
              show: true,
              total: {
                show: false,
                formatter: () => " ",
              },
            },
          },
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    },
  });

  useEffect(() => {
    const ticketData = [
      { name: "Solved", value: total_solve },
      { name: "In Progress", value: total_inprogress },
      { name: "Unsolved", value: total_unsolved },
      { name: "Forward", value: total_forward },
    ];

    setState((prevState) => ({
      ...prevState,
      series: ticketData.map((item) => item.value),
      options: {
        ...prevState.options,
        labels: ticketData.map((item) => item.name),
      },
    }));
  }, [data]);

  return (
    <div style={{ maxWidth: "260px", margin: "0 auto" }}>
      <ReactApexChart
        options={state.options}
        series={state.series}
        type="donut"
        height={300}
      />
    </div>
  );
};

export default TicketDonutChart;
