import React from 'react';

const stages = [
    { label: 'Order Received', count: 5000000, avg: '2.3 hrs' },
    { label: 'Processing', count: 4500000, avg: '3.1 hrs' },
    { label: 'Picking', count: 9700000, avg: '5.7 hrs' },
    { label: 'Packing', count: 7100000, avg: '4.2 hrs' },
    { label: 'Ready for Shipment', count: 8400000, avg: '6.8 hrs' },
    { label: 'Shipped', count: 0, avg: '-' },
  ];
  
  const currentStage = 2; // "Picking"
  
  const FulfillmentPipeline = () => {
    return (
      <div className="w-full py-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-6 px-4">
          Fulfillment Pipeline
        </h2>
  
        <div className="flex items-center justify-center gap-4 px-4 overflow-x-auto">
          {stages.map((stage, index) => {
            const isCompleted = index < currentStage;
            const isCurrent = index === currentStage;
  
            return (
              <React.Fragment key={index}>
                {/* Stage Box */}
                <div className="flex flex-col items-center min-w-[160px]">
                  <div
                    className={`w-full max-w-[120px] p-4 rounded-lg text-center font-bold text-sm
                      ${isCompleted ? 'bg-green-500 text-white' :
                      isCurrent ? 'bg-purple-500 text-white' :
                      'bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200'}
                    `}
                  >
                    {stage.count.toLocaleString()}
                  </div>
                  <div className="mt-2 text-center text-sm text-gray-700 dark:text-gray-300 font-medium">
                    {stage.label}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{stage.avg}</div>
                </div>
  
                {/* Arrow between stages */}
                {index < stages.length - 1 && (
                  <div className="flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-gray-400 dark:text-gray-500"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    );
  };
  
  export default FulfillmentPipeline;
  
  
  

// import { Card } from 'primereact/card';
// import { Tooltip } from 'primereact/tooltip';

// const stages = [
//   { label: 'Order Received', count: 53, avg: '2.3 hrs' },
//   { label: 'Processing', count: 42, avg: '3.1 hrs' },
//   { label: 'Picking', count: 97, avg: '5.7 hrs' },
//   { label: 'Packing', count: 71, avg: '4.2 hrs' },
//   { label: 'Ready to Ship', count: 84, avg: '6.8 hrs' },
//   { label: 'Shipped', count: null, avg: '-' },
// ];

// const currentStage = 3; // Index of "Packing"

// const FulfillmentPipeline = () => {
//   return (
//     <div className="w-full py-6 overflow-hidden">
//       <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-6 px-4">
//         Fulfillment Pipeline
//       </h2>

//       <div className="overflow-x-auto w-full px-4">
//         <div className="flex items-start gap-2 pb-2 min-w-fit">
//           {stages.map((stage, index) => {
//             const isCompleted = index < currentStage;
//             const isCurrent = index === currentStage;

//             return (
//               <div key={index} className="flex items-center flex-shrink-0">
//                 {/* Stage Card */}
//                 <div
//                   className={`min-w-[10rem] max-w-[12rem] rounded-xl p-4 shadow-sm border transition-all
//                     ${
//                       isCurrent
//                         ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
//                         : isCompleted
//                         ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
//                         : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-white/[0.02]'
//                     }`}
//                 >
//                   <div className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
//                     {stage.label}
//                   </div>
//                   <div className="text-xs text-gray-500 dark:text-gray-400">
//                     Count: {stage.count ?? '—'}
//                   </div>
//                   <div className="text-xs text-gray-500 dark:text-gray-400">
//                     Avg: {stage.avg}
//                   </div>
//                 </div>

//                 {/* Connector */}
//                 {index !== stages.length - 1 && (
//                   <div className="flex-shrink-0 h-0.5 w-6 mx-2 self-center bg-gray-300 dark:bg-gray-600" />
//                 )}
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// };


// export default FulfillmentPipeline;




// const stages = [
//     { label: 'Order Received', count: 53, bgColor: 'bg-green-100', textColor: 'text-green-700' },
//     { label: 'Processing', count: 42, bgColor: 'bg-yellow-100', textColor: 'text-yellow-700' },
//     { label: 'Picking', count: 97, bgColor: 'bg-blue-100', textColor: 'text-blue-700' },
//     { label: 'Packing', count: 71, bgColor: 'bg-orange-100', textColor: 'text-orange-700' },
//     { label: 'Ready for Shipment', count: 84, bgColor: 'bg-purple-100', textColor: 'text-purple-700' },
//   ];
  
//   const FulfillmentPipeline = () => {
//     return (
//       <div className="w-full px-4 py-6">
//         <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-6 text-center">
//           Fulfillment Pipeline
//         </h2>
  
//         <div className="flex flex-wrap justify-center gap-6">
//           {stages.map((stage, index) => (
//             <div key={index} className="flex items-center gap-4">
//               <div
//                 className={`${stage.bgColor} ${stage.textColor} w-40 p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow text-center`}
//               >
//                 <div className="text-sm font-medium">
//                   {stage.label}
//                 </div>
//                 <div className="text-2xl font-bold mt-1">
//                   {stage.count}
//                 </div>
//               </div>
//               {index !== stages.length - 1 && (
//                 <div className="text-2xl text-gray-400 dark:text-gray-500">
//                   →
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   };
  
//   export default FulfillmentPipeline;
  
  
  