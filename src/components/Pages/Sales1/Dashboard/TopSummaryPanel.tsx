import React from 'react';

const financialBreakdown = [
  { label: 'Line Price Total', value: '6.2M', sign: '+', color: 'bg-green-500' },
  { label: 'Shipping Charges', value: '384K', sign: '+', color: 'bg-purple-500' },
  { label: 'Discount', value: '768K', sign: '-', color: 'bg-yellow-500' },
  { label: 'Tax Charges', value: '1.9M', sign: '+', color: 'bg-red-500' },
];

const summaryMetrics = [
  { label: 'Margin', value: '10,00,000', color: 'bg-indigo-500' },
  { label: 'Total Units', value: '1,200', color: 'bg-teal-500' },
  { label: 'ROI', value: '8.4', color: 'bg-orange-500' },
];

const formatValue = (label: string, value: string) => {
  if (label === 'ROI') return `${value}%`;
  return `$ ${value}`;
};

const TopSummaryPanel: React.FC = () => {
  return (
    <div className="flex flex-col gap-6 items-center w-full px-4">
      
      {/* Top Box: Total Booked Breakdown */}
      <div className="w-full max-w-screen-xl p-4 border rounded-2xl shadow-md bg-white dark:bg-gray-900 dark:border-gray-700 flex flex-wrap items-center justify-center gap-3">
        <div className="flex flex-col items-center text-center px-2 shrink-0">
          <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">Total Booked</span>
          <span className="text-lg font-bold text-purple-700 dark:text-purple-400">$ 7.7M</span>
          <div className="mt-1 h-1 w-full rounded-full bg-blue-500" />
        </div>
        <span className="text-lg font-bold text-black dark:text-white">=</span>
        {financialBreakdown.map((item, index) => (
          <React.Fragment key={item.label}>
            <div className="flex flex-col items-center text-center px-2 shrink-0">
              <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">{item.label}</span>
              <span className="text-base font-semibold text-purple-700 dark:text-purple-400">
                $ {item.value}
              </span>
              <div className={`mt-1 h-1 w-full rounded-full ${item.color}`} />
            </div>
            {index < financialBreakdown.length - 1 && (
              <span className="text-lg font-bold text-black dark:text-white">
                {financialBreakdown[index + 1].sign}
              </span>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Bottom Box: Summary Metrics */}
      <div className="w-full max-w-screen-xl p-4 border rounded-2xl shadow-md bg-white dark:bg-gray-900 dark:border-gray-700 flex flex-wrap items-center justify-center gap-3">
        {summaryMetrics.map((item) => (
          <div key={item.label} className="flex flex-col items-center text-center px-4">
            <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">{item.label}</span>
            <span className="text-base font-semibold text-black dark:text-white">
              {formatValue(item.label, item.value)}
            </span>
            <div className={`mt-1 h-1 w-full rounded-full ${item.color}`} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopSummaryPanel;
