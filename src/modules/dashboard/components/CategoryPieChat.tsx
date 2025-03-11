import { PieChart, Pie, Sector, ResponsiveContainer } from "recharts";
import {
  useGetDashboardPieChartDataForAdminQuery,
  useGetDashboardPieDataQuery,
} from "../api/dashboardEndPoints";
import { useGetMeQuery } from "../../../app/api/userApi";

const renderLabels = (props: any) => {
  const RADIAN = Math.PI / 180;

  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 25) * cos;
  const my = cy + (outerRadius + 25) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={payload.color}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={payload.color}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={payload.color} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#333"
        className="text-sm font-medium"
      >
        {`${payload.name} (${payload.value})`}
      </text>
    </g>
  );
};

const CategoryPieChart = () => {
  const { data: pieData } = useGetDashboardPieDataQuery();
  const { data: pieDataForAdmin } = useGetDashboardPieChartDataForAdminQuery();
  const { data: profile } = useGetMeQuery();
  const { role_id } = profile?.data || {};
  const {
    total_laptop,
    total_desktop,
    total_printer,
    total_accessories,
    total_monitors,
  } = pieData?.data || {};

  const {
    desktop_count,
    laptop_count,
    monitor_count,
    printer_count,
    accessories_count,
  } = pieDataForAdmin?.data || {};
  const data = [
    {
      name: "Laptops",
      value: role_id === 1 ? total_laptop : laptop_count,
      color: "#72b92b",
    },
    {
      name: "Desktops",
      value: role_id === 1 ? total_desktop : desktop_count,
      color: "#0088FE",
    },
    {
      name: "Printers",
      value: role_id === 1 ? total_printer : printer_count,
      color: "#FF0000",
    },
    {
      name: "Accessories",
      value: role_id === 1 ? total_accessories : accessories_count || 0,
      color: "#FFA500",
    },
    {
      name: "Monitors",
      value: role_id === 1 ? total_monitors : monitor_count,
      color: "#ba45ba",
    },
  ].filter((item) => item.value > 0);

  return (
    <div className="w-full h-[250px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            dataKey="value"
            activeShape={renderLabels}
            activeIndex={[0, 1, 2, 3, 4]}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CategoryPieChart;
