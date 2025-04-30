import React from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

interface ShipmentChartsProps {
  selectedCarrier: string | null;
  selectedMethod: string | null;
}

const ShipmentCharts: React.FC<ShipmentChartsProps> = ({ selectedCarrier, selectedMethod }) => {
  const labelColor = '#a1a1aa'; // Tailwind zinc-400 for neutral gray text

  // Donut Chart - Shipment Status (static for now)
  const statusOptions: ApexOptions = {
    chart: {
      type: 'donut',
      background: 'transparent',
      fontFamily: 'Inter, sans-serif',
    },
    labels: ['Delivered', 'In Transit', 'Delayed', 'Cancelled'],
    legend: {
      position: 'bottom',
      fontSize: '14px',
      fontWeight: 500,
      fontFamily: 'Inter, sans-serif',
      labels: {
        colors: [labelColor],
      },
    },
    colors: ['#22c55e', '#8b5cf6', '#facc15', '#ef4444'], // <- updated here
    stroke: { show: false },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: '13px',
        fontWeight: 600,
        fontFamily: 'Inter, sans-serif',
        colors: ['#fff'],
      },
    },
    tooltip: {
      theme: 'dark',
      style: {
        fontSize: '13px',
        fontFamily: 'Inter, sans-serif',
      },
    },
  };
  

  const statusSeries: number[] = [642, 312, 48, 18];

  // Carrier performance base data
  const carrierData = {
    FedEx: { Ground: 220, Air: 120, Express: 80 },
    UPS: { Ground: 200, Air: 110, Express: 70 },
    DHL: { Ground: 160, Air: 90, Express: 50 },
    USPS: { Ground: 100, Air: 60, Express: 20 },
  };

  // Filtered data logic
  const carriers = Object.keys(carrierData);
  const filteredData = carriers.map((carrier) => {
    if (selectedCarrier && selectedCarrier !== carrier) return null;

    const methods = carrierData[carrier as keyof typeof carrierData];
    if (selectedMethod && methods[selectedMethod as keyof typeof methods] === undefined) return null;

    const shipmentCount = selectedMethod
      ? methods[selectedMethod as keyof typeof methods]
      : Object.values(methods).reduce((sum, val) => sum + val, 0);

    return { carrier, count: shipmentCount };
  }).filter(Boolean) as { carrier: string; count: number }[];

  const carrierOptions: ApexOptions = {
    chart: {
      type: 'bar',
      background: 'transparent',
      stacked: false,
      toolbar: { show: false },
      fontFamily: 'Inter, sans-serif',
    },
    xaxis: {
      categories: filteredData.map((d) => d.carrier),
      crosshairs: {
        show: false, // ✅ disables vertical hover line
      },
      labels: {
        style: {
          colors: labelColor,
          fontSize: '13px',
          fontWeight: 500,
        },
      },
      axisBorder: { color: '#e5e7eb' },
      axisTicks: { color: '#e5e7eb' },
      title: {
        text: 'Carrier',
        style: {
          color: labelColor,
          fontSize: '13px',
          fontWeight: 500,
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: labelColor,
          fontSize: '13px',
          fontWeight: 500,
        },
      },
      title: {
        text: 'Number of Shipments',
        style: {
          color: labelColor,
          fontSize: '13px',
          fontWeight: 500,
        },
      },
    },
    grid: {
      borderColor: '#374151',
      strokeDashArray: 4,
    },
    plotOptions: {
      bar: {
        borderRadius: 6,
        columnWidth: '45%',
      },
    },
    colors: ['#8b5cf6'],
    dataLabels: { enabled: false },
    tooltip: {
      theme: 'dark',
      style: {
        fontSize: '13px',
        fontFamily: 'Inter, sans-serif',
      },
      x: {
        show: true,
      },
      y: {
        formatter: (val) => `${val} shipments`,
      },
      marker: { show: false },
      fillSeriesColor: false,
      followCursor: true,
    },
  };
  
  

  const carrierSeries = [
    {
      name: 'Shipments',
      data: filteredData.map((d) => d.count),
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-8">
      {/* Shipment Status Donut */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md border border-zinc-200 dark:border-gray-800">
        <h3 className="text-lg font-semibold mb-4 text-zinc-800 dark:text-zinc-100">
          Shipment Status
        </h3>
        <Chart options={statusOptions} series={statusSeries} type="donut" height={300} />
      </div>

      {/* Carrier Performance Bar */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md border border-zinc-200 dark:border-gray-800">
        <h3 className="text-lg font-semibold mb-4 text-zinc-800 dark:text-zinc-100">
          Carrier Performance
        </h3>
        <Chart options={carrierOptions} series={carrierSeries} type="bar" height={300} />
      </div>
    </div>
  );
};

export default ShipmentCharts;
