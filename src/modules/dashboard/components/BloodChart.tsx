import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const BloodTypeChart = () => {
  const data = [
    { name: "A+", value: 0 },
    { name: "B+", value: 0 },
    { name: "AB+", value: 0 },
    { name: "O+", value: 0 },
    { name: "A-", value: 0 },
    { name: "B-", value: 0 },
    { name: "AB-", value: 7 },
    { name: "O-", value: 0 },
  ];

  return (
    <div className="w-full bg-white p-8 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Blood Type Distribution</h2>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BloodTypeChart;
