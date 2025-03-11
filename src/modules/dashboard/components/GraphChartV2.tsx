import { Card } from "antd";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { useGetDashboardGraphDataQuery } from "../api/dashboardEndPoints";

const GraphChartV2 = () => {
  const { data } = useGetDashboardGraphDataQuery({});
  return (
    <Card size="small" title="Stock and Disbursement Statistics">
      <div style={{ height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={data?.data} barGap={0}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total_asset" fill="#1775bb" name="Total Asset" />
            <Bar
              dataKey="total_assign_asset"
              fill="#8dc73f"
              name="Total Disbursement"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default GraphChartV2;
