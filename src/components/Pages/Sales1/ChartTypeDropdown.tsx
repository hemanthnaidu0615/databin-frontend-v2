import React from 'react';

interface Props {
  selectedChart: string;
  onChange: (chartType: string) => void;
}

const chartOptions = ['Bar', 'Line', 'Pie'];

const ChartTypeDropdown: React.FC<Props> = ({ selectedChart, onChange }) => {
  return (
    <select
      value={selectedChart}
      onChange={(e) => onChange(e.target.value)}
      className="px-4 py-2 rounded-md border bg-white"
    >
      {chartOptions.map((chartType) => (
        <option key={chartType} value={chartType}>
          {chartType}
        </option>
      ))}
    </select>
  );
};

export default ChartTypeDropdown;
