import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

const BottleneckChart = () => {
  const chartOptions: ApexOptions = {
    chart: {
      type: 'bar',
      height: 320,
      toolbar: { show: false },
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
      categories: ['Order Received', 'Picking', 'Packing', 'Ready to Ship', 'Shipping Label'],
      labels: {
        style: {
          colors: '#a1a1aa',
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: '#a1a1aa',
        },
      },
    },
    tooltip: {
      theme: 'dark',
    },
    theme: {
      mode: 'light',
    },
  };

  const series = [
    {
      name: 'Avg Time (hrs)',
      data: [3.2, 5.6, 2.4, 6.8, 4.1],
    },
  ];

  // Dynamic theme switch
  const isDark =
    typeof window !== 'undefined' &&
    document.documentElement.classList.contains('dark');

  if (isDark) {
    chartOptions.theme!.mode = 'dark';
    chartOptions.xaxis!.labels!.style!.colors = '#d1d5db';
    if (!Array.isArray(chartOptions.yaxis)) {
      chartOptions.yaxis!.labels!.style!.colors = '#d1d5db';
    }
  }

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Bottleneck Analysis</h2>
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-4">
        <ReactApexChart options={chartOptions} series={series} type="bar" height={320} />
      </div>
    </div>
  );
};

export default BottleneckChart;
