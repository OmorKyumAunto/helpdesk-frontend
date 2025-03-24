import React, { useEffect, useRef } from "react";
import { ApexOptions } from "apexcharts";
import { useGetDashboardBarChartDataQuery } from "../api/taskDashboardEndpoint";
import { IDashboardBarChartData } from "../types/taskTypes";
import { Card } from "antd";

const CompareBarChart: React.FC = () => {
  const { data } = useGetDashboardBarChartDataQuery();

  const totalTask =
    data?.data?.map((item: IDashboardBarChartData) => item?.totalTask) ?? [];
  const totalIncomplete =
    data?.data?.map((item: IDashboardBarChartData) => item?.incompleteTask) ??
    [];
  const totalComplete =
    data?.data?.map((item: IDashboardBarChartData) => item?.completeTask) ?? [];

  const getCurrentMonthName = () => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const monthNames = [];
    for (let i = 0; i < 12; i++) {
      const monthIndex = (currentMonth - i + 12) % 12;
      monthNames.unshift(months[monthIndex]);
    }

    return monthNames;
  };
  const monthsArray = getCurrentMonthName();
  const chartRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const options: ApexOptions = {
      series: [
        {
          name: "Total Tasks",
          data: totalTask,
        },
        {
          name: "Completed Tasks",
          data: totalComplete,
        },
        {
          name: "Incomplete Tasks",
          data: totalIncomplete,
        },
      ],

      chart: {
        type: "bar",
        height: 350,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          borderRadius: 5,
          borderRadiusApplication: "end",
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"],
      },
      xaxis: {
        categories: monthsArray,
      },
      yaxis: {
        title: {
          text: "Number of Tasks",
        },
      },
      fill: {
        opacity: 1,
      },
      tooltip: {
        y: {
          formatter: function (val: number) {
            return val + " tasks";
          },
        },
      },
    };

    if (chartRef.current) {
      const chart = new ApexCharts(chartRef.current, options);
      chart.render();

      return () => {
        chart.destroy();
      };
    }
  }, [totalIncomplete, totalComplete, totalTask]);

  return <Card id="chart" ref={chartRef} />;
};

export default CompareBarChart;
