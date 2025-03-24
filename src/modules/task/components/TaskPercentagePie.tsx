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
    series: [44, 55, 41, 17, 15],
    options: {
      chart: {
        type: "donut",
      },
      legend: {
        position: "bottom",
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
      const taskPieData = data.data.map((item: IDashboardCategoryWiseData) => {
        return {
          name: item.category_title,
          value: item.task_count,
        };
      });

      setState((prevState) => ({
        ...prevState,
        series: taskPieData.map((item) => item.value),
        options: {
          ...prevState.options,
          labels: taskPieData.map((item) => item.name),
        },
      }));
    }
  }, [data]); // Depend on data, not categoryData

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
