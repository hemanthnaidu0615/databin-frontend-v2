// import React from "react";

// // Importing widgets
// import StatisticsChart from "../StatisticsChart";
// import RecentOrders from "../RecentOrders";
// import OrderTracking from "../OrderTracking";
// import DemographicCard from "../DemographicCard";
// import OrderValueSegment from "../Widgets/OrderValueSegment";
// import OrderTrendsCategory from "../Widgets/OrderTrendsCategory";
// import OrderProcessingTime from "../Widgets/OrderProcessingTime";
// import RevenuePerCustomer from "../Widgets/RevenuePerCustomer";

// const widgetComponents: Record<string, React.FC> = {
//   StatisticsChart,
//   RecentOrders,
//   OrderTracking,
//   DemographicCard,
//   OrderValueSegment,
//   OrderTrendsCategory,
//   OrderProcessingTime,
//   RevenuePerCustomer,
// };

// interface WidgetSidebarProps {
//   addWidget: (widgetName: string) => void;
//   closeSidebar: () => void;
// }

// const WidgetSidebar: React.FC<WidgetSidebarProps> = ({ addWidget, closeSidebar }) => {
//   return (
//     <div
//       className="fixed right-0 top-0 h-full w-72 
//                  bg-white dark:bg-gray-900 border-l border-gray-300 
//                  p-4 shadow-lg z-50 overflow-y-auto 
//                  transition-transform transform translate-x-0"
//     >
//       {/* Sidebar Header */}
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
//           Available Widgets
//         </h2>
//         <button
//           onClick={closeSidebar}
//           className="text-gray-600 dark:text-gray-300 hover:text-red-500 transition"
//         >
//           ✖
//         </button>
//       </div>

//       {/* Widget List */}
//       <div className="space-y-4">
//         {Object.keys(widgetComponents).map((widgetName) => (
//           <div
//             key={widgetName}
//             className="cursor-pointer bg-gray-100 dark:bg-gray-800
//                        p-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700
//                        transition duration-200 flex items-center justify-between"
//             onClick={() => addWidget(widgetName)}
//           >
//             <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
//               {widgetName}
//             </span>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default WidgetSidebar;
