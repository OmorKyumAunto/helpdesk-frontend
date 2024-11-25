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
import { useGetDashboardBloodDataQuery } from "../api/dashboardEndPoints";

const BloodTypeChart = () => {
  const { data: bloodData } = useGetDashboardBloodDataQuery();
  const {
    total_a_positive,
    total_b_positive,
    total_ab_positive,
    total_o_positive,
    total_a_negative,
    total_b_negative,
    total_ab_negative,
    total_0_negative,
  } = bloodData?.data || {};
  const data = [
    { name: "A+", value: total_a_positive },
    { name: "A-", value: total_a_negative },
    { name: "B+", value: total_b_positive },
    { name: "B-", value: total_b_negative },
    { name: "AB+", value: total_ab_positive },
    { name: "AB-", value: total_ab_negative },
    { name: "O+", value: total_o_positive },
    { name: "O-", value: total_0_negative },
  ];

  return (
    <div className="w-full h-[438px] bg-white p-8 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Available Blood Group</h2>
      <ResponsiveContainer width="100%" height="90%">
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
