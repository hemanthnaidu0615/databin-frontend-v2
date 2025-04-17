// // ShipmentTimelineChart.tsx
// import React from 'react';
// import Chart from 'react-apexcharts';
// import { ApexOptions } from 'apexcharts';

// const dates = Array.from({ length: 14 }, (_, i) => {
//   const d = new Date();
//   d.setDate(d.getDate() - (13 - i));
//   return d.toISOString().split('T')[0];
// });

// const data = [120, 134, 98, 150, 170, 160, 145, 180, 200, 190, 210, 230, 220, 240];

// const options: ApexOptions = {
//   chart: {
//     type: 'line',
//     height: 300,
//     toolbar: { show: false },
//     zoom: { enabled: false },
//     animations: {
//       enabled: true,
//       speed: 800,
//     },
//     background: 'transparent',
//   },
//   stroke: {
//     curve: 'smooth',
//     width: 3,
//   },
//   markers: {
//     size: 4,
//     strokeWidth: 0,
//     hover: { sizeOffset: 3 },
//   },
//   tooltip: {
//     theme: 'dark',
//     x: { format: 'yyyy-MM-dd' },
//   },
//   grid: {
//     show: true,
//     borderColor: '#e5e7eb',
//     strokeDashArray: 4,
//   },
//   xaxis: {
//     categories: dates,
//     labels: {
//       style: {
//         colors: '#a1a1aa',
//       },
//     },
//   },
//   yaxis: {
//     labels: {
//       style: {
//         colors: '#a1a1aa',
//       },
//     },
//   },
//   colors: ['#8b5cf6'], // purple tone
// };

// const series = [
//   {
//     name: 'Shipments',
//     data,
//   },
// ];

// const ShipmentTimelineChart = () => {
//   return (
//     <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md">
//       <h3 className="text-lg font-semibold mb-4 text-zinc-800 dark:text-zinc-100">Shipment Timeline</h3>
//       <Chart options={options} series={series} type="line" height={300} />
//     </div>
//   );
// };

// export default ShipmentTimelineChart;
