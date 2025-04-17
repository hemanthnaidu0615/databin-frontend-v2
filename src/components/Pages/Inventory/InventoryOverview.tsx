import React from 'react';
import ReactApexChart from 'react-apexcharts';

const InventoryOverview = () => {
  const warehouseData = [
    { region: 'North', value: '+12%', color: 'text-green-500' },
    { region: 'East', value: '+8%', color: 'text-green-500' },
    { region: 'South', value: '-3%', color: 'text-red-500' },
    { region: 'West', value: '+5%', color: 'text-green-500' },
  ];

  const alertsData = [
    { label: 'Available', value: '70%', count: 872, color: 'text-green-500' },
    { label: 'Low Stock', value: '27%', count: 340, color: 'text-yellow-500' },
    { label: 'Out of Stock', value: '3%', count: 36, color: 'text-red-500' },
  ];

  const restockTable = [
    { product: 'Product A', stock: 5, date: '2025-04-20' },
    { product: 'Product B', stock: 2, date: '2025-04-21' },
    { product: 'Product C', stock: 0, date: '2025-04-25' },
  ];

  const warehouseChartOptions = {
    chart: {
      type: 'column',
      toolbar: { show: false },
    },
    colors: ['#9614d0'],
    plotOptions: {
      bar: {
        borderRadius: 6,
        columnWidth: '50%',
      },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: warehouseData.map((d) => d.region),
      labels: { style: { colors: '#ccc' } },
    },
    yaxis: {
      labels: { style: { colors: '#ccc' } },
    },
    tooltip: {
      theme: 'dark',
    },
  };

  const warehouseChartSeries = [
    {
      name: 'Change',
      data: warehouseData.map((d) => parseFloat(d.value)),
    },
  ];

  const turnoverChartOptions = {
    chart: {
      type: 'line',
      toolbar: { show: false },
    },
    colors: ['#9614d0'],
    stroke: {
      curve: 'smooth',
      width: 3,
    },
    markers: {
      size: 4,
      colors: ['#fff'],
      strokeColors: '#9614d0',
      strokeWidth: 2,
    },
    xaxis: {
      categories: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      labels: { style: { colors: '#ccc' } },
    },
    yaxis: {
      labels: { style: { colors: '#ccc' } },
    },
    tooltip: {
      theme: 'dark',
    },
  };

  const turnoverChartSeries = [
    {
      name: 'Turnover Rate',
      data: [25, 40, 35, 60],
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* Left Column - Warehouse Inventory */}
      <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md">
        <h3 className="text-lg font-semibold mb-1">Warehouse Inventory</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Regional Performance</p>

        <div className="space-y-3 mb-6">
          {warehouseData.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center text-sm">
              <span>{item.region}</span>
              <span className={`font-medium ${item.color}`}>{item.value}</span>
            </div>
          ))}
        </div>

        <div className="h-56">
          <ReactApexChart
            options={warehouseChartOptions as any}
            series={warehouseChartSeries}
            type="bar"
            height="100%"
          />
        </div>
      </div>

      {/* Right Column - Inventory Turnover & Alerts */}
      <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md">
        <h3 className="text-lg font-semibold mb-4">Inventory Turnover & Alerts</h3>

        <div className="grid grid-cols-3 gap-3 text-center mb-4">
          {alertsData.map((item, i) => (
            <div key={i}>
              <p className="text-sm text-gray-500 dark:text-gray-400">{item.label}</p>
              <p className={`text-xl font-semibold ${item.color}`}>{item.value}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">{item.count} products</p>
            </div>
          ))}
        </div>

        <div className="h-40 mb-6">
          <ReactApexChart
            options={turnoverChartOptions as any}
            series={turnoverChartSeries}
            type="line"
            height="100%"
          />
        </div>

        <div className="text-sm">
          <h4 className="mb-2 font-medium">Restock Schedule</h4>
          <table className="w-full text-left text-sm">
            <thead className="text-gray-500 dark:text-gray-400">
              <tr>
                <th>Product</th>
                <th>Stock</th>
                <th>Restock</th>
              </tr>
            </thead>
            <tbody>
              {restockTable.map((item, i) => (
                <tr key={i} className="border-t border-gray-200 dark:border-gray-700">
                  <td className="py-1.5">{item.product}</td>
                  <td className="py-1.5">{item.stock}</td>
                  <td className="py-1.5">{item.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InventoryOverview;
