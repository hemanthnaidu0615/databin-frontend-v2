import React from 'react';

const fulfillmentStages = [
  { label: 'Order Placed', count: 5000000, avg: '2.1 hrs' },
  { label: 'Processing', count: 4800000, avg: '3.4 hrs' },
  { label: 'Distribution Center', count: 4500000, avg: '2.9 hrs' },
  { label: 'Warehouse', count: 4300000, avg: '4.1 hrs' },
  { label: 'Same-Day Delivery', count: 3900000, avg: '5.2 hrs' },
  { label: 'Curbside Pickup', count: 3700000, avg: '6.0 hrs' },
];

const finalStages = [
  { label: 'Shipped', count: 3600000, avg: '–' },
  { label: 'Cancelled', count: 120000, avg: '–' },
  { label: 'Return Received', count: 45000, avg: '–' },
];

const currentFulfillmentStage = 2;

const PipelineRow = ({
  stages,
  currentStage,
  isFinal = false
}: {
  stages: { label: string; count: number; avg: string }[];
  currentStage: number;
  isFinal?: boolean;
}) => {
  return (
    <div
      className={`flex flex-wrap items-center ${
        isFinal ? 'justify-center gap-x-4 gap-y-3' : 'justify-center gap-3'
      } px-2 overflow-hidden max-w-screen-xl mx-auto`}
    >
      {stages.map((stage, index) => {
        const isCompleted = index < currentStage;
        const isCurrent = index === currentStage;

        const bgColor = isFinal
          ? 'bg-slate-400 dark:bg-slate-600'
          : isCompleted
          ? 'bg-purple-500 '
          : isCurrent
          ? 'bg-emerald-600'
          : ' bg-yellow-500';

        return (
          <React.Fragment key={index}>
            <div className="flex flex-col items-center min-w-[90px] w-[22vw] sm:w-[130px]">
              <div
                className={`w-full p-2 sm:p-3 rounded-md text-center font-bold text-[11px] sm:text-sm text-white ${bgColor}`}
              >
                {stage.count.toLocaleString()}
              </div>
              <div className="mt-1 text-center text-[10px] sm:text-xs text-gray-700 dark:text-gray-300 font-medium">
                {stage.label}
              </div>
              <div className="text-[9px] sm:text-[10px] text-gray-500 dark:text-gray-400">{stage.avg}</div>
            </div>

            {!isFinal && index < stages.length - 1 && (
              <div className="hidden sm:flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
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
  );
};

const FulfillmentPipeline = () => {
  return (
    <div className="w-full py-6 space-y-10">
      {/* Fulfillment Flow */}
<div className="max-w-screen-xl px-4 sm:px-6 lg:px-8 mx-auto">
  <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
    Fulfillment Stages Pipeline
  </h2>
  <PipelineRow stages={fulfillmentStages} currentStage={currentFulfillmentStage} />
</div>

{/* Final Status Flow */}
<div className="max-w-screen-xl px-4 sm:px-6 lg:px-8 mx-auto">
  <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
    Final Stages
  </h2>
  <PipelineRow stages={finalStages} currentStage={-1} isFinal />
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
  
  
  