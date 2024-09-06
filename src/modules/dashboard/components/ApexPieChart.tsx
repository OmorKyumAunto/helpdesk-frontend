import React from "react";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

interface ChartProps {
  title?: string;
  chartType?: "donut" | "pie" | "bar" | "line";
}

const ApexPieChart: React.FC<ChartProps> = ({
  title = "Category Data Details",
  chartType = "donut",
}) => {
  const data = {
    series: [44, 55, 41, 17],
    labels: ["a", "B", "C", "D"],
  };

  const options: ApexOptions = {
    chart: {
      width: "100%",
      type: chartType,
      animations: {
        enabled: true,
        easing: "easeinout",
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150,
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350,
        },
      },
    },
    plotOptions: {
      pie: {
        startAngle: -90,
        endAngle: 270,
        donut: {
          labels: {
            show: true,
            total: {
              showAlways: true,
              show: true,
            },
          },
        },
      },
      bar: {
        horizontal: true,
        columnWidth: "55%",
      },
    },

    dataLabels: {
      enabled: true,
    },
    fill: {
      type: "gradient",
    },
    legend: {
      formatter: function (val: string, opts) {
        return val + " - " + opts.w.globals.series[opts.seriesIndex];
      },
    },
    title: {
      text: title,
      align: "center",
      style: {
        fontSize: "18px",
        fontWeight: "bold",
        color: "#263238",
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
    theme: {
      mode: "light",
      palette: "palette1", // You can choose from palette1 to palette10
      monochrome: {
        enabled: false,
        color: "#255aee",
        shadeTo: "light",
        shadeIntensity: 0.65,
      },
    },
    tooltip: {
      y: {
        formatter: function (value: number) {
          return value + " units";
        },
      },
    },
    xaxis: {
      categories: ["a", "b", "c", "d", "e"],
    },
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <ReactApexChart
        options={options}
        series={data.series}
        type={chartType}
        height={350}
        width="100%"
      />
    </div>
  );
};

export default ApexPieChart;
