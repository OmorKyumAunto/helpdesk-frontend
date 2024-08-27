import { useEffect, useRef } from "react";
import ApexCharts, { ApexOptions } from "apexcharts";
import { Card } from "antd";
import { useGetDashboardGraphDataQuery } from "../api/dashboardEndPoints";

const GraphChartApex = () => {
  const { data } = useGetDashboardGraphDataQuery({});
  const totalAsset = data?.data?.map((item: any) => item?.total_asset);
  const totalAssignAsset = data?.data?.map(
    (item: any) => item?.total_assign_asset
  );
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
      // colors: ["#FF5580", "#b5e550"],
      series: [
        {
          name: "Total Asset",
          data: totalAsset,
        },
        {
          name: "Total Assign Asset",
          data: totalAssignAsset,
        },
      ],
      chart: {
        type: "area",
        height: 550,
        zoom: {
          enabled: false,
        },
      },
      dataLabels: {
        enabled: true,
      },
      stroke: {
        curve: "smooth",
      },
      title: {
        text: "Asset And Assign Asset Statistics",
        align: "left",
        style: {
          color: "#155E75",
        },
      },
      subtitle: {
        text: "Last 12 months asset and assign asset statistics",
        style: {
          color: "#155E75",
        },
      },
      xaxis: {
        categories: monthsArray,
        labels: {
          style: {
            colors: "#155E75",
            fontSize: "14px",
            fontWeight: 600,
          },
        },
      },
      yaxis: {
        opposite: false,
        labels: {
          style: {
            colors: "#155E75",
            fontSize: "14px",
            fontWeight: 600,
          },
        },
      },
      legend: {
        horizontalAlign: "center",
      },
      responsive: [
        {
          breakpoint: 1000,
          options: {
            plotOptions: {
              bar: {
                horizontal: false,
              },
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    };

    if (chartRef.current) {
      const chart = new ApexCharts(chartRef.current, options);
      chart.render();

      return () => {
        chart.destroy();
      };
    }
  }, [totalAssignAsset, totalAsset]);

  return (
    <Card
      style={{ padding: "22px 16px", color: "#0c0c0c" }}
      id="chart"
      ref={chartRef}
    />
  );
};

export default GraphChartApex;
