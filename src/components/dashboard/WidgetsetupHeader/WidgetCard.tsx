// import React from "react";
// import { Button } from "primereact/button";
// import { FaTimes } from "react-icons/fa"; // You can use react-icons for more flexibility

// interface WidgetCardProps {
//   title: string;
//   children: React.ReactNode;
//   onRemove?: () => void; // Optional remove function (only in Edit Mode)
// }

// const WidgetCard: React.FC<WidgetCardProps> = ({ title, children, onRemove }) => {
//   return (
//     <div 
//       className="relative bg-white dark:bg-gray-900 p-4 rounded-lg shadow-md 
//                  border border-gray-200 dark:border-gray-800 transition-all space-y-2"
//     >
//       {/* Widget Title */}
//       <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
//         {title}
//       </h3>

//       {/* Widget Content */}
//       <div className="text-gray-700 dark:text-gray-300">{children}</div>

//       {/* Remove Button (Only in Edit Mode) */}
//       {onRemove && (
//         <Button
//           icon={<FaTimes />}
//           onClick={onRemove}
//           aria-label="Remove widget"
//           className="absolute top-2 right-2 p-0 text-red-500 hover:text-red-600"
//           style={{
//             background: 'transparent',
//             border: 'none',
//             boxShadow: 'none',
//             padding: '0',
//           }}
//         />
//       )}
//     </div>
//   );
// };

// export default WidgetCard;
