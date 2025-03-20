// import {
//   ArrowUpward,
//   ArrowDownward,
//   Inventory,
//   LocalShipping,
//   WarningAmber
// } from "@mui/icons-material";
// import Badge from "../ui/badge/Badge";

// export default function OrdersFulfillmentMetrics() {
//   return (
//     <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 pb-2 md:pb-4">
//       {[
//         { icon: <Inventory />, label: "Total Orders", value: "1,200", up: true },
//         { icon: <LocalShipping />, label: "Fulfillment Rate", value: "95%", up: false },
//         { icon: <WarningAmber />, label: "Delayed Orders", value: "8%", up: true },
//         { icon: <LocalShipping />, label: "Orders in Transit", value: "530", up: true },
//         { icon: <WarningAmber />, label: "Inventory Alerts", value: "15", warn: true },
//       ].map((item, index) => {
//         // Define dynamic border color
//         const borderColor = item.warn
//           ? "border-yellow-500" // Warning
//           : item.up
//           ? "border-green-500" // Positive
//           : "border-red-500"; // Negative

//         return (
//           <div
//             key={index}
//             className={`rounded-lg border-2 ${borderColor} bg-white p-4 flex justify-between items-center dark:border-opacity-50 dark:bg-white/[0.03]`}
//           >
//             {/* Left Section: Icon + Label + Value */}
//             <div className="flex items-center gap-3 text-xs sm:text-sm md:text-base">
//               <span className="text-gray-800 dark:text-white/90 text-lg sm:text-xl">
//                 {item.icon}
//               </span>
//               <div className="flex flex-col">
//                 <span className="text-gray-500 dark:text-gray-400 font-medium">
//                   {item.label}
//                 </span>
//                 <h4 className="font-bold text-gray-800 dark:text-white/90 text-sm sm:text-lg">
//                   {item.value}
//                 </h4>
//               </div>
//             </div>

//             {/* Right Section: Arrow Indicator (Hidden on 320px, visible otherwise) */}
//             <div className="hidden min-[321px]:block">
//               <Badge color={item.warn ? "warning" : item.up ? "success" : "error"}>
//                 {item.up ? (
//                   <ArrowUpward className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
//                 ) : (
//                   <ArrowDownward className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
//                 )}
//               </Badge>
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// }


import {
  ArrowUpward,
  ArrowDownward,
  Inventory,
  LocalShipping,
  WarningAmber
} from "@mui/icons-material";
import Badge from "../ui/badge/Badge";

export default function OrdersFulfillmentMetrics() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 pb-2 md:pb-4">
      {[
        { icon: <Inventory />, label: "Total Orders", value: "1,200", up: true },
        { icon: <LocalShipping />, label: "Fulfillment Rate", value: "95%", up: false },
        { icon: <WarningAmber />, label: "Delayed Orders", value: "8%", up: true },
        { icon: <LocalShipping />, label: "Orders in Transit", value: "530", up: true },
        { icon: <WarningAmber />, label: "Inventory Alerts", value: "15", warn: true },
      ].map((item, index) => {
        // Define dynamic glow color
        const glowColor = item.warn
          ? "shadow-yellow-500" // Warning
          : item.up
          ? "shadow-green-500" // Positive
          : "shadow-red-500"; // Negative

        return (
          <div
            key={index}
            className={`relative rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] p-4 flex justify-between items-center 
              max-[378px]:shadow-lg max-[378px]:${glowColor}`}
          >
            {/* Colored Bar for 368px & 378px */}
            <div
              className={`absolute top-0 left-0 w-full h-1 hidden max-[378px]:block ${
                item.warn ? "bg-yellow-500" : item.up ? "bg-green-500" : "bg-red-500"
              }`}
            ></div>

            {/* Left Section: Icon + Label + Value */}
            <div className="flex items-center gap-3 text-xs sm:text-sm md:text-base">
              <span className="text-gray-800 dark:text-white/90 text-lg sm:text-xl">
                {item.icon}
              </span>
              <div className="flex flex-col">
                <span className="text-gray-500 dark:text-gray-400 font-medium">
                  {item.label}
                </span>
                <h4 className="font-bold text-gray-800 dark:text-white/90 text-sm sm:text-lg">
                  {item.value}
                </h4>
              </div>
            </div>

            {/* Right Section: Arrows (Hidden at 368px & 378px) */}
            <div className="hidden min-[379px]:block">
              <Badge color={item.warn ? "warning" : item.up ? "success" : "error"}>
                {item.up ? (
                  <ArrowUpward className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
                ) : (
                  <ArrowDownward className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
                )}
              </Badge>
            </div>
          </div>
        );
      })}
    </div>
  );
}
