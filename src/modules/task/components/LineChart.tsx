import React, { useState } from "react";
import ReactApexChart from "react-apexcharts";
import dayjs from "dayjs";
import { ApexOptions } from "apexcharts"; // Import ApexOptions type

const TaskLineChart: React.FC = () => {
  const [state] = useState({
    series: [
      {
        name: "Bob",
        data: [
          {
            x: "Design",
            y: [dayjs("2019-03-05").valueOf(), dayjs("2019-03-08").valueOf()],
          },
          {
            x: "Code",
            y: [dayjs("2019-03-08").valueOf(), dayjs("2019-03-11").valueOf()],
          },
          {
            x: "Test",
            y: [dayjs("2019-03-11").valueOf(), dayjs("2019-03-16").valueOf()],
          },
        ],
      },
      {
        name: "Joe",
        data: [
          {
            x: "Design",
            y: [dayjs("2019-03-02").valueOf(), dayjs("2019-03-05").valueOf()],
          },
          {
            x: "Code",
            y: [dayjs("2019-03-06").valueOf(), dayjs("2019-03-09").valueOf()],
          },
          {
            x: "Test",
            y: [dayjs("2019-03-10").valueOf(), dayjs("2019-03-19").valueOf()],
          },
        ],
      },
    ],
    options: {
      chart: {
        height: 350,
        type: "rangeBar" as "rangeBar", // ✅ Explicitly typing as "rangeBar"
      },
      plotOptions: {
        bar: {
          borderRadius: 10,
          horizontal: true,
        },
      },
      dataLabels: {
        enabled: true,
        formatter: function (val: any) {
          const startDate = dayjs(val[0]);
          const endDate = dayjs(val[1]);
          const diff = endDate.diff(startDate, "days");
          return `${diff} ${diff > 1 ? "days" : "day"}`;
        },
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: "light",
          type: "vertical",
          shadeIntensity: 0.25,
          gradientToColors: undefined,
          inverseColors: true,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [50, 0, 100, 100],
        },
      },
      xaxis: {
        type: "datetime",
      },
      legend: {
        position: "top",
      },
    } as ApexOptions, // ✅ Explicitly define options as ApexOptions
  });

  return (
    <div id="chart">
      <ReactApexChart
        options={state.options}
        series={state.series}
        type="rangeBar" // ✅ Ensure correct type here too
        height={350}
      />
    </div>
  );
};

export default TaskLineChart;
