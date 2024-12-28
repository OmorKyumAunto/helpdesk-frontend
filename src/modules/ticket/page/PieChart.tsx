import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import { useGetCategoryWiseDashboardDataQuery } from '../api/ticketEndpoint'; // Assuming this query is set up for fetching data

const ApexChart = () => {
  const { data, error, isLoading } = useGetCategoryWiseDashboardDataQuery(); // Fetch the data from API

  const [state, setState] = useState({
    series: [],
    options: {
      chart: {
        width: '100%',
        type: 'donut',
      },
      dataLabels: {
        enabled: false,
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: '100%',
            },
            legend: {
              show: false,
            },
          },
        },
      ],
      legend: {
        position: 'right',
        offsetY: 0,
        height: 230,
      },
    },
  });

  // Effect hook to update chart data when API data is fetched
  useEffect(() => {
    if (data) {
      // Extract category titles and ticket counts
      const categories = data.data.map((item: any) => item.category_title);
      const ticketCounts = data.data.map((item: any) => item.ticket_count);

      setState({
        series: ticketCounts,
        options: {
          ...state.options,
          labels: categories, // Dynamically set labels
        },
      });
    }
  }, [data]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;

  return (
    <div className="chart-container" style= {{ padding: '10px' }}>
      {/* Chart Container */}
      <div className="chart-wrap" style={{ maxWidth: '500px', margin: '0 auto' }}>
        <ReactApexChart
          options={state.options}
          series={state.series}
          type="donut"
          width="100%"
        />
      </div>
    </div>
  );
};

export default ApexChart;
