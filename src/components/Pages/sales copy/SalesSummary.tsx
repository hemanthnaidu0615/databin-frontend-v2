
// import React from 'react';
// import { useIsMobile } from '../../../hooks/use-mobile';

// const SalesSummary: React.FC = () => {
//   const isMobile = useIsMobile();
  
//   const summaryItems = [
//     {
//       title: 'Total Booked',
//       value: '$ 7.7M',
//       color: 'bg-blue-500',
//       equation: '='
//     },
//     {
//       title: 'Line Price Total',
//       value: '$ 6.2M',
//       color: 'bg-green-500',
//       equation: '+'
//     },
//     {
//       title: 'Shipping Charges',
//       value: '$ 384K',
//       color: 'bg-purple-500',
//       equation: '-'
//     },
//     {
//       title: 'Discount',
//       value: '$ 768K',
//       color: 'bg-orange-500',
//       equation: '+'
//     },
//     {
//       title: 'Tax Charges',
//       value: '$ 1.9M',
//       color: 'bg-red-500',
//       equation: '|'
//     },
//     {
//       title: 'Margin',
//       value: '$ 5.2M',
//       color: 'bg-yellow-500',
//       equation: '|'
//     },
//     {
//       title: 'Total Units',
//       value: '62K',
//       color: 'bg-purple-500',
//       equation: ''
//     },
//     {
//       title: 'ROI',
//       value: '84%',
//       color: 'bg-green-500',
//       equation: ''
//     }
//   ];

//   return (
//     <div className="bg-card bg-opacity-50 p-4 rounded-lg mb-6 md:mb-8 overflow-x-auto">
//       <div className={`flex ${isMobile ? 'flex-col gap-4' : 'items-center gap-2'} min-w-max`}>
//         {summaryItems.map((item, index) => (
//           <React.Fragment key={index}>
//             <div className={`flex ${isMobile ? 'flex-row justify-between' : 'flex-col items-center'} w-full`}>
//               <div className="text-sm text-muted-foreground mb-1">{item.title}</div>
//               <div className="text-lg font-bold">{item.value}</div>
//               {!isMobile && <div className={`h-1 w-full mt-1 rounded ${item.color}`}></div>}
//             </div>
//             {item.equation && !isMobile && (
//               <div className="text-xl font-bold mx-2 self-center">
//                 {item.equation}
//               </div>
//             )}
//           </React.Fragment>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default SalesSummary;
