import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useGetDashboardCategoryWiseDataQuery } from "../api/taskDashboardEndpoint";
import { IDashboardCategoryWiseData } from "../types/taskTypes";

const TaskPercentagePie = () => {
  const { data } = useGetDashboardCategoryWiseDataQuery();

  const [state, setState] = useState<{
    series: number[];
    options: ApexOptions;
  }>({
    series: [],
    options: {
      chart: {
        type: "donut",
      },
      dataLabels: {
        enabled: false, // Disable always-visible labels
      },
      tooltip: {
        y: {
          formatter: (val: number) => `${val} Tasks`,
        },
      },
      legend: {
        position: "bottom",  // Position the legend at the bottom
        fontSize: "10px",    // Smaller font size to reduce space
        itemMargin: {
          horizontal: 1,     // Reduced horizontal space between items
          vertical: 0,       // Reduced vertical space between items
        },
        labels: {
          useSeriesColors: true, // Use series colors for the legend items
        },
        horizontalAlign: "center", // Center the legend horizontally
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
    if (data?.data) {
      const taskPieData = data.data.map((item: IDashboardCategoryWiseData) => ({
        name: item.category_title,
        value: item.task_count,
      }));

      setState((prevState) => ({
        ...prevState,
        series: taskPieData.map((item) => item.value),
        options: {
          ...prevState.options,
          labels: taskPieData.map((item) => item.name),
        },
      }));
    }
  }, [data]);

  return (
    <div style={{ maxWidth: "260px", margin: "0 auto" }}>
      <div id="chart">
        <ReactApexChart
          options={state.options}
          series={state.series}
          type="donut"
          height={300}
        />
      </div>
    </div>
  );
};

export default TaskPercentagePie;
