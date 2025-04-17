import React, { useState, useMemo } from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from 'next-themes';
import { ApexOptions } from 'apexcharts';

interface Props {
  company: string;
}

const ChartSection: React.FC<Props> = ({ company }) => {
  const [selectedChart, setSelectedChart] = useState('Bar');
  const { theme } = useTheme();

  const chartOptions = ['Bar', 'Line', 'Pie', 'Table'];
  const categories = Array(14).fill('15-03');

  const series = [
    {
      name: 'Call Center',
      data: [120000, 10000, 5000, 8000, 340000, 380000, 50000, 120000, 100000, 30000, 70000, 40000, 5000, 3000],
    },
    {
      name: 'Web',
      data: [30000, 5000, 10000, 15000, 90000, 120000, 80000, 95000, 70000, 60000, 75000, 85000, 40000, 60000],
    },
    {
      name: 'Store',
      data: [20000, 3000, 7000, 10000, 200000, 250000, 90000, 180000, 220000, 70000, 60000, 45000, 10000, 5000],
    },
  ];

  const pieSeries = [
    series[0].data.slice(0, 4).reduce((a, b) => a + b, 0),
    series[1].data.slice(0, 4).reduce((a, b) => a + b, 0),
    series[2].data.slice(0, 4).reduce((a, b) => a + b, 0),
  ];

  const isDark = theme === 'dark';
  const labelColor = isDark ? '#f1f5f9' : '#1e293b';
  const gridColor = isDark ? '#334155' : '#e2e8f0';

  const getChartOptions = (type: 'bar' | 'line' | 'pie'): ApexOptions => {
    const baseOptions: ApexOptions = {
      chart: {
        type,
        background: 'transparent',
        foreColor: labelColor,
        toolbar: { show: false },
      },
      theme: {
        mode: isDark ? 'dark' : 'light',
      },
      legend: {
        labels: { colors: labelColor },
        position: 'top',
      },
      grid: {
        borderColor: gridColor,
      },
      colors: ['#b76fcf', '#f84aad', '#8de2c4'],
      tooltip: {
        theme: isDark ? 'dark' : 'light',
      },
    };

    if (type === 'bar' || type === 'line') {
      return {
        ...baseOptions,
        xaxis: {
          categories,
          labels: {
            style: {
              colors: Array(categories.length).fill(labelColor),
            },
          },
          title: {
            text: 'Dates',
            style: { color: labelColor },
          },
        },
        yaxis: {
          labels: {
            style: { colors: labelColor },
            formatter: (value: number) => `$${(value / 1000000).toFixed(1)}M`,
          },
          title: {
            text: 'Order Amount ($)',
            style: { color: labelColor },
          },
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '60%',
          },
        },
        dataLabels: { enabled: false },
      };
    }

    if (type === 'pie') {
      return {
        ...baseOptions,
        labels: ['Call Center', 'Web', 'Store'],
      };
    }

    return baseOptions;
  };

  // 🔍 Dynamically calculate chart width (no overflow, no scrollbar)
  const dynamicChartWidth = useMemo(() => {
    const baseWidthPerCategory = 60; // pixels per bar group
    const padding = 100;
    return selectedChart === 'Pie' ? '100%' : `${categories.length * baseWidthPerCategory + padding}px`;
  }, [categories.length, selectedChart]);

  return (
    <div className="flex flex-col rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-5 py-5 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Chart Type</p>
        <select
          value={selectedChart}
          onChange={(e) => setSelectedChart(e.target.value)}
          className="px-3 py-1.5 text-sm rounded-md border bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white"
        >
          {chartOptions.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {(selectedChart === 'Bar' || selectedChart === 'Line' || selectedChart === 'Pie') && (
        <div className="flex justify-center bg-gray-100 dark:bg-gray-800 rounded-lg p-2">
          <div style={{ width: dynamicChartWidth, height: '400px' }}>
            {selectedChart === 'Bar' && (
              <Chart options={getChartOptions('bar')} series={series} type="bar" height="100%" width="100%" />
            )}
            {selectedChart === 'Line' && (
              <Chart options={getChartOptions('line')} series={series} type="line" height="100%" width="100%" />
            )}
            {selectedChart === 'Pie' && (
              <Chart options={getChartOptions('pie')} series={pieSeries} type="pie" height="100%" width="100%" />
            )}
          </div>
        </div>
      )}

      {selectedChart === 'Table' && (
        <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
          <div className="max-h-[220px] overflow-y-auto">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-100 dark:bg-gray-800 sticky top-0 z-10">
                <tr>
                  <th className="p-2 font-medium">Date</th>
                  <th className="p-2 font-medium">Call Center</th>
                  <th className="p-2 font-medium">Web</th>
                  <th className="p-2 font-medium">Store</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((date, i) => (
                  <tr key={i} className="border-t dark:border-gray-700">
                    <td className="p-2">{date}</td>
                    <td className="p-2">{series[0].data[i]}</td>
                    <td className="p-2">{series[1].data[i]}</td>
                    <td className="p-2">{series[2].data[i]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="text-center mt-3 text-gray-400 dark:text-gray-500 text-xs">
        [ {company} Chart Placeholder ]
      </div>
    </div>
  );
};

export default ChartSection;
