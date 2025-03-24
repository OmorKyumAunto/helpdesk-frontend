import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts"; // Import ApexOptions type
import { useGetDashboardTaskPercentageQuery } from "../api/taskDashboardEndpoint";

const WorkingProgressPieChart: React.FC = () => {
  const { data, isSuccess } = useGetDashboardTaskPercentageQuery();
  const { total_complete } = data?.data || {};
  // State for progress value
  const [progress, setProgress] = useState<number>(0);
  useEffect(() => {
    if (isSuccess) {
      setProgress(total_complete as number);
    }
  }, [isSuccess]);
  // Chart Configuration
  const chartOptions: ApexOptions = {
    chart: {
      height: 350,
      type: "radialBar",
      toolbar: {
        show: true,
      },
    },
    plotOptions: {
      radialBar: {
        startAngle: -135,
        endAngle: 225,
        hollow: {
          margin: 0,
          size: "70%",
          background: "#fff",
          dropShadow: {
            enabled: true,
            top: 3,
            blur: 4,
            opacity: 0.5,
          },
        },
        track: {
          background: "#fff",
          strokeWidth: "67%",
          dropShadow: {
            enabled: true,
            top: -3,
            blur: 4,
            opacity: 0.7,
          },
        },
        dataLabels: {
          show: true,
          name: {
            offsetY: -10,
            show: true,
            color: "#888",
            fontSize: "17px",
          },
          value: {
            formatter: function (val: number) {
              return parseInt(val.toString(), 10).toString(); // Ensure return type is string
            },
            color: "#111",
            fontSize: "36px",
            show: true,
          },
        },
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        type: "horizontal",
        shadeIntensity: 0.5,
        gradientToColors: ["#ABE5A1"],
        inverseColors: true,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100],
      },
    },
    stroke: {
      lineCap: "round",
    },
    labels: ["Progress"],
  };

  return (
    <div>
      <div id="chart">
        <ReactApexChart
          options={chartOptions}
          series={[progress]}
          type="radialBar"
          height={300}
        />
      </div>
    </div>
  );
};

export default WorkingProgressPieChart;
