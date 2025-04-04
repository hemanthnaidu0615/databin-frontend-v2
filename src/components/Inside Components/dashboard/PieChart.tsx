// import Chart from "react-apexcharts";

// export default function SalesRevenuePieChart() {
//   const options = {
//     chart: {
//       type: "donut" as "donut",
//     },
//     labels: ["Lipsticks", "Foundations", "Eyeshadows", "Skincare"],
//     colors: ["#9C27B0", "#FF9800", "#03A9F4", "#4CAF50"],
//     legend: {
//       position: "bottom" as "bottom",
//     },
//     dataLabels: {
//       enabled: true,
//     },
//     plotOptions: {
//       pie: {
//         donut: {
//           labels: {
//             show: true,
//             total: {
//               show: true,
//               label: "Total Sales",
//             },
//           },
//         },
//       },
//     },
//   };

//   const series = [40, 25, 20, 15]; // Example data in percentage

//   return (
//     <div className="bg-white p-5 shadow rounded-2xl dark:bg-gray-900">
//       <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
//         Sales Distribution
//       </h3>
//       <Chart options={options} series={series} type="donut" height={300} />
//     </div>
//   );
// }
