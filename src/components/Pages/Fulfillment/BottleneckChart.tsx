import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

const BottleneckChart = () => {
  const [isDark, setIsDark] = useState<boolean>(
    typeof window !== 'undefined' && document.documentElement.classList.contains('dark')
  );

  const [chartOptions, setChartOptions] = useState<ApexOptions>({
    chart: {
      type: 'bar',
      height: 320,
      toolbar: { show: false },
      background: 'transparent',
      foreColor: isDark ? '#d1d5db' : '#333',
    },
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 4,
        barHeight: '70%',
      },
    },
    dataLabels: {
      enabled: true,
      style: {
        colors: ['#fff'],
      },
    },
    colors: ['#9614d0'],
    xaxis: {
      categories: [
        'Order Placed', 'Processing', 'Store Pickup', 'Ship to Home',
        'Distribution Center', 'Warehouse', 'Vendor Drop Shipping',
        'Same-Day Delivery', 'Locker Pickup', 'Curbside Pickup',
      ],
      labels: {
        style: {
          colors: isDark ? '#d1d5db' : '#333',
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: isDark ? '#d1d5db' : '#333',
        },
      },
    },
    tooltip: {
      theme: 'dark',
    },
    grid: {
      show: true,
      borderColor: isDark ? '#3f3f46' : '#e5e7eb',
      row: {
        colors: ['transparent'],
      },
    },
    theme: {
      mode: isDark ? 'dark' : 'light',
    },
  });

  const series = [
    {
      name: 'Avg Time (hrs)',
      data: [3.2, 5.6, 2.4, 6.8, 4.5, 3.8, 5.2, 7.1, 4.3, 3.9],
    },
  ];

  useEffect(() => {
    const dark = document.documentElement.classList.contains('dark');
    setIsDark(dark);

    setChartOptions((prev) => ({
      ...prev,
      chart: {
        ...prev.chart,
        background: 'transparent',
        foreColor: dark ? '#d1d5db' : '#333',
      },
      xaxis: {
        ...prev.xaxis,
        labels: {
          style: {
            colors: dark ? '#d1d5db' : '#333',
          },
        },
      },
      yaxis: {
        ...prev.yaxis,
        labels: {
          style: {
            colors: dark ? '#d1d5db' : '#333',
          },
        },
      },
      grid: {
        show: true,
        borderColor: dark ? '#3f3f46' : '#e5e7eb',
        row: {
          colors: ['transparent'],
        },
      },
      theme: {
        mode: dark ? 'dark' : 'light',
      },
    }));
  }, []);

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
        Bottleneck Analysis
      </h2>
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-4">
        <ReactApexChart options={chartOptions} series={series} type="bar" height={320} />
      </div>
    </div>
  );
};

export default BottleneckChart;
