// import React, { useState } from "react";
// import { Typography, Button } from "@mui/material";
// import { Dropdown } from "../ui/dropdown/Dropdown";
// import { DropdownItem } from "../ui/dropdown/DropdownItem";
// import { MoreDotIcon } from "../../icons";

// // Recharts Components for Funnel Chart
// import {
//   FunnelChart,
//   Funnel,
//   Tooltip,
//   ResponsiveContainer,
//   LabelList,
// } from "recharts";

// const data = [
//   { name: "Viewed Product", value: 4000 },
//   { name: "Added to Cart", value: 3000 },
//   { name: "Initiated Checkout", value: 2000 },
//   { name: "Purchased", value: 1000 },
// ];

// type SalesFunnelProps = {
//   size?: "small" | "full";
// };

// const SalesFunnel: React.FC<SalesFunnelProps> = ({ size = "full" }) => {
//   const [isDropdownOpen, setDropdownOpen] = useState(false);
//   const [isVisible, setIsVisible] = useState(true); // State to toggle visibility of the chart

//   const closeDropdown = () => setDropdownOpen(false);
//   const removeChart = () => {
//     setIsVisible(false); // Removes the chart
//     closeDropdown();
//   };
//   const restoreChart = () => setIsVisible(true); // Restores the chart

//   return (
//     <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
//       {/* Restore Button if the chart is hidden */}
//       {!isVisible && (
//         <div className="flex justify-center">
//           <Button variant="contained" color="primary" onClick={restoreChart}>
//             Restore Chart
//           </Button>
//         </div>
//       )}

//       {/* Chart Section */}
//       {isVisible && (
//         <>
//           {/* Title and Dropdown Menu */}
//           {size === "full" && (
//             <div className="flex justify-between items-center mb-4">
//               <Typography
//                 variant="h6"
//                 gutterBottom
//                 className="text-gray-800 dark:text-white"
//               >
//                 Sales Funnel
//               </Typography>

//               {/* Dropdown for More Options */}
//               <div className="relative inline-block">
//                 <button
//                   className="dropdown-toggle p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-white/10"
//                   onClick={() => setDropdownOpen(!isDropdownOpen)}
//                 >
//                   <MoreDotIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
//                 </button>
//                 <Dropdown
//                   isOpen={isDropdownOpen}
//                   onClose={closeDropdown}
//                   className="w-40 p-2"
//                 >
//                   <DropdownItem
//                     onItemClick={closeDropdown}
//                     className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-200 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
//                   >
//                     View More
//                   </DropdownItem>
//                   <DropdownItem
//                     onItemClick={removeChart} // Remove chart when clicked
//                     className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-200 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
//                   >
//                     Remove
//                   </DropdownItem>
//                 </Dropdown>
//               </div>
//             </div>
//           )}

//           {/* Funnel Chart with Responsive Container */}
//           <ResponsiveContainer width="100%" height={size === "small" ? 150 : 300}>
//             <FunnelChart width={400} height={300}>
//               <Tooltip />
//               <Funnel data={data} dataKey="value" nameKey="name" fill="#8884d8">
//                 <LabelList
//                   position="center"
//                   fill="#fff"
//                   stroke="none"
//                   dataKey="name"
//                   fontSize={14}
//                   fontWeight="bold"
//                 />
//               </Funnel>
//             </FunnelChart>
//           </ResponsiveContainer>
//         </>
//       )}
//     </div>
//   );
// };

// export default SalesFunnel;
