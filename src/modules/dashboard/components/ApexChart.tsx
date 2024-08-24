import { Card } from "antd";
import React, { useState } from "react";
import ReactApexChart from "react-apexcharts";

const GraphChartApex = () => {
  const [series, setSeries] = useState([
    {
      name: "Asset",
      data: [28, 15, 24, 55, 37, 38, 62, 55, 41, 78, 36, 98],
    },
    {
      name: "Employee",
      data: [8, 22, 58, 37, 11, 50, 85, 66, 77, 49, 72, 109],
    },
    {
      name: "Assign Asset",
      data: [3, 30, 33, 22, 35, 27, 36, 18, 49, 53, 60, 57],
    },
  ]);
  return (
    <Card>
      <div id="chart">
        <ReactApexChart
          options={{
            chart: {
              height: 350,
              type: "area",
            },
            dataLabels: {
              enabled: false,
            },
            stroke: {
              curve: "smooth",
            },
            xaxis: {
              type: "category",
              categories: [
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
              ],
            },
          }}
          series={series}
          type="area"
          height={550}
        />
      </div>
      <div id="html-dist"></div>
    </Card>
  );
};

export default GraphChartApex;
