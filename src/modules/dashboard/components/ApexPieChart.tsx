import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Sector, ResponsiveContainer } from 'recharts';
import { useGetDashboardBloodDataQuery } from '../api/dashboardEndPoints';

// Define types for Blood Data and API Response
interface BloodData {
  total_a_positive: number;
  total_b_positive: number;
  total_ab_positive: number;
  total_o_positive: number;
  total_a_negative: number;
  total_b_negative: number;
  total_ab_negative: number;
  total_0_negative: number; // Corrected here to use '0'
}

interface ApiResponse {
  data?: BloodData;
}

// Define type for each data point in the chart
type ChartDataPoint = {
  name: string;
  value: number;
  fill: string;
};

// Function to render the active shape of the pie chart
const renderActiveShape = (props: any) => {
  const RADIAN = Math.PI / 180;
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`Available: ${value}`}</text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
        {`(${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

const ExampleWithAPI = () => {
  // Fetch data from the API with proper type inference
  const { data, error, isLoading } = useGetDashboardBloodDataQuery() as {
    data?: ApiResponse;
    error?: any;
    isLoading: boolean;
  };

  const [activeIndex, setActiveIndex] = useState<number>(0);

  // Destructure blood data with default values
  const {
    total_a_positive = 0,
    total_b_positive = 0,
    total_ab_positive = 0,
    total_o_positive = 0,
    total_a_negative = 0,
    total_b_negative = 0,
    total_ab_negative = 0,
    total_0_negative = 0,
  } = data?.data || {};

  // Chart data
  const chartData: ChartDataPoint[] = [
    { name: 'A+', value: total_a_positive, fill: '#FFA500' }, // Orange
    { name: 'A-', value: total_a_negative, fill: '#1E90FF' }, // Blue
    { name: 'B+', value: total_b_positive, fill: '#228B22' }, // Bottle Green
    { name: 'B-', value: total_b_negative, fill: '#4682B4' }, // Deep Blue
    { name: 'AB+', value: total_ab_positive, fill: '#00C853' }, // Android Green
    { name: 'AB-', value: total_ab_negative, fill: '#FF6347' }, // Tomato Red
    { name: 'O+', value: total_o_positive, fill: '#8A2BE2' }, // Purple
    { name: 'O-', value: total_0_negative, fill: '#6B8E23' }, // Olive Green
  ];

  // Handle hover event on the pie chart
  const onPieEnter = (_: ChartDataPoint, index: number) => {
    setActiveIndex(index);
  };

  // Reset active index when new data is loaded
  useEffect(() => {
    setActiveIndex(0);
  }, [data]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;

  return (
    <ResponsiveContainer width="100%" height={270}>
      <PieChart>
        <Pie
          activeIndex={activeIndex}
          activeShape={renderActiveShape}
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={80}
          outerRadius={120}
          dataKey="value"
          onMouseEnter={onPieEnter}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default ExampleWithAPI;
