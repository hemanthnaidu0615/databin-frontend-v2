import React from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

const ShipmentCharts = () => {
  // Shared label color (neutral gray that works in both themes)
  const labelColor = '#a1a1aa'; // Tailwind zinc-400

  // Donut Chart - Shipment Status
  const statusOptions: ApexOptions = {
    chart: {
      type: 'donut',
      background: 'transparent',
    },
    labels: ['Delivered', 'In Transit', 'Delayed', 'Cancelled'],
    legend: {
      position: 'bottom',
      labels: {
        colors: [labelColor],
      },
    },
    colors: ['#22c55e', '#3b82f6', '#facc15', '#ef4444'],
    stroke: {
      show: false,
    },
    dataLabels: {
      enabled: true,
      style: {
        colors: ['#fff'], // show inside slice in dark mode
      },
    },
    tooltip: {
      theme: 'dark',
    },
  };

  const statusSeries: number[] = [642, 312, 48, 18];

  // Bar Chart - Carrier Performance
  const carrierOptions: ApexOptions = {
    chart: {
      type: 'bar',
      background: 'transparent',
      stacked: false,
      toolbar: { show: false },
    },
    xaxis: {
      categories: ['FedEx', 'UPS', 'DHL', 'USPS'],
      labels: {
        style: {
          colors: labelColor,
        },
      },
      axisBorder: {
        color: '#e5e7eb',
      },
      axisTicks: {
        color: '#e5e7eb',
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: labelColor,
        },
      },
    },
    grid: {
      borderColor: '#374151', // Tailwind zinc-700 for dark bg (soft)
      strokeDashArray: 4,
    },
    plotOptions: {
      bar: {
        borderRadius: 6,
        columnWidth: '45%',
      },
    },
    colors: ['#8b5cf6'], // Tailwind purple-500
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      theme: 'dark',
    },
  };

  const carrierSeries = [
    {
      name: 'Shipments',
      data: [420, 380, 300, 180],
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-8">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md border border-zinc-200 dark:border-gray-800">
        <h3 className="text-lg font-semibold mb-4 text-zinc-800 dark:text-zinc-100">Shipment Status</h3>
        <Chart options={statusOptions} series={statusSeries} type="donut" height={300} />
      </div>

      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md border border-zinc-200 dark:border-gray-800">
        <h3 className="text-lg font-semibold mb-4 text-zinc-800 dark:text-zinc-100">Carrier Performance</h3>
        <Chart options={carrierOptions} series={carrierSeries} type="bar" height={300} />
      </div>
    </div>
  );
};

export default ShipmentCharts;
