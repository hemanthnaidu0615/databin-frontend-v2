

// import React from 'react';
// import Chart from 'react-apexcharts';
// import { useIsMobile } from '../../../hooks/use-mobile';

// interface SalesData {
//   id: string;
//   name: string;
//   date: string;
//   amount: number;
//   channel: 'Call Center' | 'Web' | 'Store' | 'Other';
// }

// interface SalesChartProps {
//   data: SalesData[];
//   chartType: string;
//   height?: number;
// }

// const SalesChart: React.FC<SalesChartProps> = ({ data, chartType, height = 350 }) => {
//   const isMobile = useIsMobile();
  
//   // Process data for charts
//   const dates = Array.from(new Set(data.map(item => item.date)));
//   const channels = ['Call Center', 'Web', 'Store', 'Other'];
  
//   const seriesData = channels.map(channel => {
//     return {
//       name: channel,
//       data: dates.map(date => {
//         const filteredData = data.filter(item => item.date === date && item.channel === channel);
//         const sum = filteredData.reduce((acc, curr) => acc + curr.amount, 0);
//         return Math.round(sum);
//       })
//     };
//   });

//   // For pie chart
//   const pieData = channels.map(channel => {
//     const sum = data.filter(item => item.channel === channel).reduce((acc, curr) => acc + curr.amount, 0);
//     return Math.round(sum);
//   });

//   // Theme-aware chart options
//   const getBaseOptions = () => ({
//     chart: {
//       toolbar: {
//         show: false
//       },
//       background: 'transparent',
//       foreColor: 'var(--foreground)',
//     },
//     colors: ['#BE93C5', '#FF6B8B', '#7BC6CC'],
//     dataLabels: {
//       enabled: false
//     },
//     xaxis: {
//       categories: dates,
//       labels: {
//         style: {
//           colors: 'var(--foreground)'
//         }
//       }
//     },
//     yaxis: {
//       title: {
//         text: 'Order Amount ($)',
//         style: {
//           color: 'var(--foreground)'
//         }
//       },
//       labels: {
//         style: {
//           colors: 'var(--foreground)'
//         },
//         formatter: function(val: number) {
//           return val >= 1000 ? '$' + (val / 1000).toFixed(1) + 'K' : '$' + val;
//         }
//       }
//     },
//     tooltip: {
//       theme: 'dark',
//       y: {
//         formatter: function(val: number) {
//           return '$' + val.toLocaleString();
//         }
//       }
//     },
//     legend: {
//       labels: {
//         colors: 'var(--foreground)'
//       }
//     },
//     grid: {
//       borderColor: 'var(--muted-foreground)',
//       strokeDashArray: 5,
//     }
//   });

//   // Bar chart options
//   const barOptions = {
//     ...getBaseOptions(),
//     chart: {
//       ...getBaseOptions().chart,
//       type: 'bar',
//       stacked: false,
//     },
//     plotOptions: {
//       bar: {
//         horizontal: false,
//         columnWidth: '55%',
//       },
//     },
//     stroke: {
//       show: true,
//       width: 2,
//       colors: ['transparent']
//     },
//     fill: {
//       opacity: 1
//     },
//   };

//   // Line chart options
//   const lineOptions = {
//     ...getBaseOptions(),
//     chart: {
//       ...getBaseOptions().chart,
//       type: 'line',
//     },
//     stroke: {
//       width: 3,
//       curve: 'smooth'
//     },
//     markers: {
//       size: 4
//     }
//   };

//   // Pie chart options
//   const pieOptions = {
//     chart: {
//       background: 'transparent',
//       foreColor: 'var(--foreground)',
//     },
//     colors: ['#BE93C5', '#FF6B8B', '#7BC6CC', '#FFD700'],
//     labels: channels,
//     legend: {
//       labels: {
//         colors: 'var(--foreground)'
//       },
//       position: isMobile ? 'bottom' : 'right'
//     },
//     responsive: [{
//       breakpoint: 480,
//       options: {
//         chart: {
//           width: 200
//         },
//         legend: {
//           position: 'bottom'
//         }
//       }
//     }],
//     theme: {
//       mode: 'dark'
//     }
//   };

//   // Render appropriate chart based on type
//   if (chartType === 'bar') {
//     return (
//       <div className="w-full h-full">
//         <Chart 
//           options={barOptions as any}
//           series={seriesData}
//           type="bar"
//           height={isMobile ? height * 0.8 : height}
//         />
//       </div>
//     );
//   } else if (chartType === 'line') {
//     return (
//       <div className="w-full h-full">
//         <Chart 
//           options={lineOptions as any}
//           series={seriesData}
//           type="line"
//           height={isMobile ? height * 0.8 : height}
//         />
//       </div>
//     );
//   } else if (chartType === 'pie') {
//     return (
//       <div className="w-full h-full">
//         <Chart 
//           options={pieOptions as any}
//           series={pieData}
//           type="pie"
//           height={isMobile ? height * 0.8 : height}
//         />
//       </div>
//     );
//   } else if (chartType === 'table') {
//     return (
//       <div className="w-full h-full p-4 bg-card rounded-lg">
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-border">
//             <thead>
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Channel</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Amount</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-border">
//               {data.map((row, i) => (
//                 <tr key={i} className="hover:bg-muted/30 transition-colors">
//                   <td className="px-6 py-4 whitespace-nowrap text-sm">{row.date}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm">{row.channel}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm">${row.amount.toLocaleString()}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     );
//   }

//   // Default fallback
//   return (
//     <div className="w-full h-full">
//       <Chart 
//         options={barOptions as any}
//         series={seriesData}
//         type="bar"
//         height={height}
//       />
//     </div>
//   );
// };

// export default SalesChart;
