import React from 'react';

interface Props {
  selectedChart: string;
  onChange: (chartType: string) => void;
  label?: string;
}

const chartOptions = ['Bar', 'Line', 'Pie'];

const ChartTypeDropdown: React.FC<Props> = ({ selectedChart, onChange, label }) => {
  return (
    <div className="flex flex-col space-y-1">
      {label && (
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <select
        value={selectedChart}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label || 'Select Chart Type'}
        className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {chartOptions.map((chartType) => (
          <option key={chartType} value={chartType}>
            {chartType}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ChartTypeDropdown;
