// import React from 'react';

// const TopSummaryPanel: React.FC = () => {
//   return (
//     <div className="w-full overflow-x-auto px-2 lg:px-4">

//       <h2 className="text-2xl font-semibold text-primary mb-4">Sales</h2>

//       <div className="flex flex-nowrap items-center gap-7 min-w-fit whitespace-nowrap">
//         {/* Colored KPIs (Total Booked & others) */}
//         <ColoredKpi label="Total Booked" value="$ 7.7M" barColor="bg-blue-500" />
//         <Symbol symbol="=" />
//         <ColoredKpi label="Line Price Total" value="$ 6.2M" barColor="bg-indigo-500" />
//         <Symbol symbol="+" />
//         <ColoredKpi label="Shipping Charges" value="$ 384K" barColor="bg-cyan-500" />
//         <Symbol symbol="-" />
//         <ColoredKpi label="Discount" value="$ 768K" barColor="bg-pink-500" />
//         <Symbol symbol="+" />
//         <ColoredKpi label="Tax Charges" value="$ 1.9M" barColor="bg-rose-500" />

//         {/* Spacer */}
//         <div className="w-6" />

//         {/* Margin KPIs with vertical lines */}
//         <VerticalDivider />
//         <ColoredKpi label="Margin" value="$ 5.2M" barColor="bg-yellow-500" />
//         <VerticalDivider />
//         <ColoredKpi label="Total Units" value="62K" barColor="bg-purple-500" />
//         <VerticalDivider />
//         <ColoredKpi label="ROI" value="84%" barColor="bg-teal-500" />
//         <VerticalDivider />
//       </div>
//     </div>
//   );
// };

// // Symbol like +, =, -
// const Symbol: React.FC<{ symbol: string }> = ({ symbol }) => (
//   <div className="text-lg font-bold text-muted-foreground px-1">{symbol}</div>
// );

// // Colored KPI (used for both rows)
// const ColoredKpi: React.FC<{ label: string; value: string; barColor: string }> = ({ label, value, barColor }) => (
//   <div className="flex flex-col items-center min-w-[100px]">
//     <div className="text-sm text-muted-foreground">{label}</div>
//     <div className="text-lg font-bold text-primary">{value}</div>
//     <div className={`h-1 w-3/4 rounded-full mt-1 ${barColor}`} />
//   </div>
// );

// // Vertical line divider
// const VerticalDivider: React.FC = () => (
//   <div className="w-px h-10 bg-border" />
// );

// export default TopSummaryPanel;
