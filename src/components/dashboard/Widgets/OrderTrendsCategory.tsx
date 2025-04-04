




// import React, { useState } from "react";
// import Chart from "react-apexcharts";
// import { ApexOptions } from "apexcharts";
// import { Dropdown } from "../../ui/dropdown/Dropdown";
// import { DropdownItem } from "../../ui/dropdown/DropdownItem";
// import { MoreDotIcon } from "../../../icons"; // More options icon

// type OrderTrendsCategoryProps = {
//   size?: "small" | "full";
//   onViewMore?: () => void;
//   onRemove?: () => void;
// };

// const dataWeekly = [
//   { week: "Week 1", Electronics: 4000, Clothing: 2400, Groceries: 2000 },
//   { week: "Week 2", Electronics: 3000, Clothing: 1398, Groceries: 2210 },
//   { week: "Week 3", Electronics: 2000, Clothing: 9800, Groceries: 2290 },
//   { week: "Week 4", Electronics: 2780, Clothing: 3908, Groceries: 2000 },
// ];

// const dataMonthly = [
//   { month: "Jan", Electronics: 12000, Clothing: 8400, Groceries: 5000 },
//   { month: "Feb", Electronics: 9800, Clothing: 7000, Groceries: 6200 },
//   { month: "Mar", Electronics: 8700, Clothing: 9200, Groceries: 7500 },
// ];

// const OrderTrendsCategory: React.FC<OrderTrendsCategoryProps> = ({
//   size = "full",
//   onViewMore,
//   onRemove,
// }) => {
//   const [timeFrame, setTimeFrame] = useState<"weekly" | "monthly">("weekly");
//   const [isDropdownOpen, setDropdownOpen] = useState(false);

//   const chartData: {
//     [key in "weekly" | "monthly"]: { categories: string[]; series: { name: string; data: number[] }[] };
//   } = {
//     weekly: {
//       categories: dataWeekly.map((item) => item.week),
//       series: [
//         { name: "Electronics", data: dataWeekly.map((item) => item.Electronics) },
//         { name: "Clothing", data: dataWeekly.map((item) => item.Clothing) },
//         { name: "Groceries", data: dataWeekly.map((item) => item.Groceries) },
//       ],
//     },
//     monthly: {
//       categories: dataMonthly.map((item) => item.month),
//       series: [
//         { name: "Electronics", data: dataMonthly.map((item) => item.Electronics) },
//         { name: "Clothing", data: dataMonthly.map((item) => item.Clothing) },
//         { name: "Groceries", data: dataMonthly.map((item) => item.Groceries) },
//       ],
//     },
//   };

//   const options: ApexOptions = {
//     chart: {
//       type: "line",
//       height: size === "small" ? 150 : 300,
//       zoom: { enabled: false },
//     },
//     xaxis: {
//       categories: chartData[timeFrame].categories,
//       labels: { style: { colors: "#6B7280" } }, // Gray-500
//     },
//     yaxis: {
//       labels: { style: { colors: "#6B7280" } }, // Gray-500
//     },
//     stroke: { curve: "smooth", width: 2 },
//     markers: { size: 4 },
//     colors: ["#6366F1", "#22C55E", "#EAB308"],
//     legend: { position: "top" },
//     tooltip: { theme: "light", x: { show: true } },
//   };

//   return (
//     <div className="rounded-xl border border-gray-200 bg-white shadow-md dark:border-gray-800 dark:bg-gray-900 p-4 sm:p-5">
//       {size === "full" && (
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
//             Order Trends by Product Category
//           </h2>

//           {/* Dropdown & More Options */}
//           <div className="flex items-center gap-3">
//             {/* Time Frame Selector */}
//             <button
//               onClick={() => setDropdownOpen(!isDropdownOpen)}
//               className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg dark:bg-gray-800 dark:text-white"
//             >
//               {timeFrame === "weekly" ? "Weekly" : "Monthly"}
//             </button>
//             <Dropdown
//               isOpen={isDropdownOpen}
//               onClose={() => setDropdownOpen(false)}
//             >
//               <DropdownItem
//                 onItemClick={() => {
//                   setTimeFrame("weekly");
//                   setDropdownOpen(false);
//                 }}
//               >
//                 Weekly
//               </DropdownItem>
//               <DropdownItem
//                 onItemClick={() => {
//                   setTimeFrame("monthly");
//                   setDropdownOpen(false);
//                 }}
//               >
//                 Monthly
//               </DropdownItem>
//             </Dropdown>

//             {/* More Options Menu */}
//             <div className="relative">
//               <button
//                 onClick={() => setDropdownOpen(!isDropdownOpen)}
//                 className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-white/10"
//                 aria-label="More options"
//               >
//                 <MoreDotIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
//               </button>

//               {isDropdownOpen && (
//                 <Dropdown isOpen={isDropdownOpen} onClose={() => setDropdownOpen(false)}>
//                   <DropdownItem
//                     onItemClick={() => {
//                       setDropdownOpen(false);
//                       onViewMore?.();
//                     }}
//                   >
//                     View More
//                   </DropdownItem>
//                   <DropdownItem
//                     onItemClick={() => {
//                       setDropdownOpen(false);
//                       onRemove?.();
//                     }}
//                   >
//                     Remove
//                   </DropdownItem>
//                 </Dropdown>
//               )}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ApexCharts Line Chart */}
//       <Chart options={options} series={chartData[timeFrame].series} type="line" height={size === "small" ? 150 : 300} />
//     </div>
//   );
// };

// export default OrderTrendsCategory;
