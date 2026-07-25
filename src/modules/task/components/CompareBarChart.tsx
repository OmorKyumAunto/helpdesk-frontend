import React, { useEffect, useRef } from "react";
import { ApexOptions } from "apexcharts";
import { useGetDashboardBarChartDataQuery } from "../api/taskDashboardEndpoint";
import { IDashboardBarChartData } from "../types/taskTypes";
import { Card } from "antd";

const CompareBarChart: React.FC = () => {
  const { data } = useGetDashboardBarChartDataQuery();

  const totalTask =
    data?.data
      ?.map((item: IDashboardBarChartData) => item?.totalTask)
      ?.slice(6, 12) ?? [];
  const totalIncomplete =
    data?.data
      ?.map((item: IDashboardBarChartData) => item?.incompleteTask)
      ?.slice(6, 12) ?? [];
  const totalComplete =
    data?.data
      ?.map((item: IDashboardBarChartData) => item?.completeTask)
      ?.slice(6, 12) ?? [];

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
        fontFamily: "inherit",
        toolbar: { show: false },
        animations: { enabled: true, speed: 350, animateGradually: { enabled: false } },
      },
      // Validated categorical palette (Total / Completed / Incomplete).
      colors: ["#2563eb", "#1baf7a", "#e34948"],
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "56%",
          borderRadius: 4,
          borderRadiusApplication: "end",
        },
      },
      dataLabels: { enabled: false },
      stroke: { show: true, width: 2, colors: ["transparent"] },
      grid: { borderColor: "#e8ecf2", strokeDashArray: 0, xaxis: { lines: { show: false } } },
      legend: {
        position: "top",
        horizontalAlign: "left",
        fontSize: "12.5px",
        markers: { size: 6 } as any,
        labels: { colors: "#52514e" },
        itemMargin: { horizontal: 10 },
      },
      xaxis: {
        categories: monthsArray.slice(6, 12),
        axisBorder: { color: "#c3c2b7" },
        axisTicks: { show: false },
        labels: { style: { colors: "#898781", fontSize: "12px" } },
      },
      yaxis: {
        labels: { style: { colors: "#898781", fontSize: "12px" } },
      },
      fill: { opacity: 1 },
      tooltip: {
        y: { formatter: (val: number) => `${val} tasks` },
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
