// import React, { useState } from "react";
// import { Dropdown } from "../../ui/dropdown/Dropdown";
// import { DropdownItem } from "../../ui/dropdown/DropdownItem";
// import { MoreDotIcon } from "../../../icons";
// import Chart from "react-apexcharts";

// const data = {
//   categories: ["Viewed Product", "Added to Cart", "Initiated Checkout", "Purchased"],
//   series: [{ name: "Sales Funnel", data: [4000, 3000, 2000, 1000] }],
// };

// type SalesFunnelProps = {
//   size?: "small" | "full";
// };

// const SalesFunnel: React.FC<SalesFunnelProps> = ({ size = "full" }) => {
//   const [isDropdownOpen, setDropdownOpen] = useState(false);
//   const [isVisible, setIsVisible] = useState(true);

//   const closeDropdown = () => setDropdownOpen(false);
//   const removeChart = () => {
//     setIsVisible(false);
//     closeDropdown();
//   };
//   const restoreChart = () => setIsVisible(true);

// // this is helpful for the user to view more details about the chart the small hamburger icon will be displayed on the top right corner of the chart

//   const options: ApexCharts.ApexOptions = {
//     chart: { type: "bar" },
//     xaxis: { categories: data.categories },
//     plotOptions: {
//       bar: { horizontal: true, barHeight: "50%" },
//     },
//     tooltip: { theme: "dark" },
//   };

//   return (
//     <div className="overflow-hidden rounded-2xl border border-gray-200 bg-transparent px-5 pt-5 dark:border-gray-800 sm:px-6 sm:pt-6">
//       {!isVisible && (
//         <div className="flex justify-center">
//           <button className="px-4 py-2 bg-blue-500 text-white rounded-lg" onClick={restoreChart}>
//             Restore Chart
//           </button>
//         </div>
//       )}

//       {isVisible && (
//         <>
//           {size === "full" && (
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Sales Funnel</h2>
//               <div className="relative inline-block">
//                 <button
//                   className="dropdown-toggle p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-white/10"
//                   onClick={() => setDropdownOpen(!isDropdownOpen)}
//                 >
//                   <MoreDotIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
//                 </button>
//                 <Dropdown isOpen={isDropdownOpen} onClose={closeDropdown} className="w-40 p-2">
//                 <DropdownItem onItemClick={closeDropdown} className="flex w-full font-normal text-left text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700">
//                  View More
//                 </DropdownItem>
//                     <DropdownItem onItemClick={removeChart} className="flex w-full font-normal text-left text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700">
//                         Remove
//                     </DropdownItem>

//                 </Dropdown>
//               </div>
//             </div>
//           )}

//           <Chart options={options} series={data.series} type="bar" height={size === "small" ? 150 : 300} />
//         </>
//       )}
//     </div>
//   );
// };

// export default SalesFunnel;