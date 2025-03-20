// import React from "react";
// import OrderValueSegment from "../Widgets/OrderValueSegment";
// import OrderTrendsCategory from "../Widgets/OrderTrendsCategory";
// import SalesFunnel from "../Widgets/SalesFunnel";
// import OrderProcessingTime from "../Widgets/OrderProcessingTime";
// import RevenuePerCustomer from "../Widgets/RevenuePerCustomer";

// export interface WidgetProps {
//   size: "small" | "full" | undefined;
// }

// const widgetComponents: Record<string, React.FC<WidgetProps>> = {
//   OrderValueSegment,
//   OrderTrendsCategory,
//   SalesFunnel,
//   OrderProcessingTime,
//   RevenuePerCustomer,
// };

// interface WidgetHomeProps {
//   selectedWidgets: string[];
//   widgetSize: "small" | "full" | undefined;
// }

// const WidgetHome: React.FC<WidgetHomeProps> = ({ selectedWidgets, widgetSize }) => {
//   return (
//     <div className="grid grid-cols-12 gap-4 md:gap-6 p-4">
//       {selectedWidgets.map((widgetName, index) => {
//         const WidgetComponent = widgetComponents[widgetName];
//         if (!WidgetComponent) {
//           return null;
//         }
//         return (
//           <div key={index} className="col-span-12 md:col-span-6 xl:col-span-4">
//             <WidgetComponent size={widgetSize} />
//           </div>
//         );
//       })}
//     </div>
//   );
// };

// export default WidgetHome;