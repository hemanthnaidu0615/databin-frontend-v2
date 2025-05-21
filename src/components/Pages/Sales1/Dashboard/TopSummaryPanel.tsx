import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { axiosInstance } from "../../../../axios";

const convertToUSD = (rupees: number): number => {
  const exchangeRate = 0.012;
  return parseFloat((rupees * exchangeRate).toFixed(2));
};

const formatValue = (label: string, value: string | number): string => {
  if (label === 'ROI' || label === 'Margin') return value.toString();
  if (typeof value === 'number') return `$ ${value.toLocaleString()}`;
  return value;
};

const TopSummaryPanel: React.FC = () => {
  const dateRange = useSelector((state: any) => state.dateRange.dates);
  const enterpriseKey = useSelector((state: any) => state.enterpriseKey.key);
  const [startDate, endDate] = dateRange || [];

  const [metrics, setMetrics] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!startDate || !endDate) return;

      const formatDate = (date: Date) => date.toISOString().split('T')[0];
      const formattedStart = formatDate(new Date(startDate));
      const formattedEnd = formatDate(new Date(endDate));

      const params = new URLSearchParams({
        startDate: formattedStart,
        endDate: formattedEnd,
      });
      if (enterpriseKey) {
        params.append('enterpriseKey', enterpriseKey);
      }

      try {
        const response = await axiosInstance.get('sales/sales-metrics', {
          params: params,
        });
        setMetrics(response.data);
      } catch (err) {
        console.error('Failed to fetch sales metrics:', err);
      }
    };

    fetchData();
  }, [startDate, endDate, enterpriseKey]);

  if (!metrics) return null; // or a loader

  const financialBreakdown = [
    { label: 'Line Price Total', value: convertToUSD(metrics.line_price_total), sign: '+', color: 'bg-green-500' },
    { label: 'Shipping Charges', value: convertToUSD(metrics.shipping_charges), sign: '+', color: 'bg-purple-500' },
    { label: 'Discount', value: convertToUSD(metrics.discount), sign: '-', color: 'bg-yellow-500' },
    { label: 'Tax Charges', value: convertToUSD(metrics.tax_charges), sign: '+', color: 'bg-red-500' },
  ];

  const summaryMetrics = [
    { label: 'Margin', value: metrics.margin_percent, color: 'bg-indigo-500' },
    { label: 'Total Units', value: metrics.total_units.toLocaleString(), color: 'bg-teal-500' },
    { label: 'ROI', value: metrics.roi_percent, color: 'bg-orange-500' },
  ];

  return (
    <div className="flex flex-col gap-6 items-center w-full px-4">
      {/* Top Box: Total Booked Breakdown */}
      <div className="w-full max-w-screen-xl p-4 border rounded-2xl shadow-md bg-white dark:bg-gray-900 dark:border-gray-700 flex flex-wrap items-center justify-center gap-3">
        <div className="flex flex-col items-center text-center px-2 shrink-0">
          <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">Total Booked</span>
          <span className="text-lg font-bold text-purple-700 dark:text-purple-400">
            $ {convertToUSD(metrics.total_booked).toLocaleString()}
          </span>
          <div className="mt-1 h-1 w-full rounded-full bg-blue-500" />
        </div>
        <span className="text-lg font-bold text-black dark:text-white">=</span>
        {financialBreakdown.map((item, index) => (
          <React.Fragment key={item.label}>
            <div className="flex flex-col items-center text-center px-2 shrink-0">
              <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">{item.label}</span>
              <span className="text-base font-semibold text-purple-700 dark:text-purple-400">
                $ {item.value.toLocaleString()}
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
