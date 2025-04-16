import React from 'react';

const equationKpis = [
  { label: 'Total Booked', value: '7.7', color: 'bg-blue-500' },
  { symbol: '=' },
  { label: 'Line Price Total', value: '6.2', color: 'bg-green-500' },
  { symbol: '+' },
  { label: 'Shipping Charges', value: '0.384', color: 'bg-purple-500' },
  { symbol: '-' },
  { label: 'Discount', value: '0.768', color: 'bg-yellow-500' },
  { symbol: '+' },
  { label: 'Tax Charges', value: '1.9', color: 'bg-red-500' },
];

const marginKpis = [
  { label: 'Margin', value: '5.2', color: 'bg-yellow-500' },
  { label: 'Total Units', value: '62', color: 'bg-purple-400' },
  { label: 'ROI', value: '84', color: 'bg-teal-500' },
];

const formatValue = (label: string, value: string) => {
  const num = parseFloat(value);
  if (label === 'ROI') return `${num}%`;
  if (label === 'Total Units') return `${num}K`;
  return `$ ${num}M`;
};

const KpiItem = ({ label, value, color }: { label: string; value: string; color: string }) => (
  <div className="flex flex-col items-center shrink-0 text-center">
    <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
      {label}
    </p>
    <p className="text-sm font-semibold text-primary dark:text-white">
      {formatValue(label, value)}
    </p>
    <div className={`h-[3px] w-8 rounded-full mt-1 ${color}`} />
  </div>
);

const SymbolBox = ({ symbol }: { symbol: string }) => (
  <div className="text-sm font-bold text-gray-600 dark:text-gray-300">
    {symbol}
  </div>
);

const Divider = () => (
  <div className="h-5 w-px bg-gray-300 dark:bg-gray-700" />
);

const TopSummaryPanel = () => {
  return (
    <div className="w-full">
      <div
        className="
          flex flex-nowrap items-center justify-between 
          gap-x-2 sm:gap-x-3 md:gap-x-4 lg:gap-x-6 xl:gap-x-8 
        "
      >
        {equationKpis.map((item, idx) =>
          'symbol' in item ? (
            <SymbolBox key={`symbol-${idx}`} symbol={item.symbol ?? ''} />
          ) : (
            <KpiItem key={item.label} {...item} />
          )
        )}

        <Divider />

        {marginKpis.map((kpi) => (
          <KpiItem key={kpi.label} {...kpi} />
        ))}
      </div>
    </div>
  );
};

export default TopSummaryPanel;
