// import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from "recharts";

// const InventoryPieChart = () => {
//   const data = [
//     { name: "Laptops", value: 6 },
//     { name: "Desktops", value: 0 },
//     { name: "Printers", value: 0 },
//     { name: "Accessories", value: 8 },
//   ];

//   const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

//   return (
//     <ResponsiveContainer width="100%" height={400}>
//       <PieChart>
//         <Pie
//           data={data}
//           cx="50%"
//           cy="50%"
//           labelLine={true}
//           outerRadius={150}
//           fill="#8884d8"
//           dataKey="value"
//           label={({ name, value }) => `${name}: ${value}`}
//         >
//           {data.map((entry, index) => (
//             <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//           ))}
//         </Pie>
//         <Legend />
//       </PieChart>
//     </ResponsiveContainer>
//   );
// };

// export default InventoryPieChart;
import { ApexOptions } from "apexcharts";
import ReactApexChart from "react-apexcharts";

const ApexInventoryPieChart = () => {
  const data = [
    { name: "Laptops", value: 6 },
    { name: "Desktops", value: 0 },
    { name: "Printers", value: 0 },
    { name: "Accessories", value: 8 },
  ];

  const options: ApexOptions = {
    chart: {
      type: "pie",
    },
    labels: data.map((item) => item.name),
    series: data.map((item) => item.value),
    colors: ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"],
    legend: {
      position: "bottom",
    },
    dataLabels: {
      enabled: true,
      formatter: function (val: any, opts: any) {
        return (
          opts.w.config.labels[opts.seriesIndex] +
          ": " +
          opts.w.config.series[opts.seriesIndex]
        );
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 300,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  return (
    <div>
      <ReactApexChart
        options={options}
        series={options.series}
        type="pie"
        height={400}
      />
    </div>
  );
};

export default ApexInventoryPieChart;
