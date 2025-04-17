import React from 'react';
import { PrimeIcons } from 'primereact/api';
import 'primeicons/primeicons.css';

const stats = [
  {
    title: 'Total Shipments',
    value: '1,562',
    icon: PrimeIcons.BOX,
    trend: '+12%',
    trendText: 'vs last period',
    status: 'Improving',
    accent: 'border-blue-500',
    barPercent: 70,
    iconColor: 'text-blue-500',
  },
  {
    title: 'On-Time Delivery',
    value: '92.3%',
    icon: PrimeIcons.CLOCK,
    trend: '+3.1%',
    trendText: 'from last period',
    status: 'Stable',
    accent: 'border-green-500',
    barPercent: 80,
    iconColor: 'text-green-500',
  },
  {
    title: 'Avg Delivery Time',
    value: '2.8 days',
    icon: PrimeIcons.SPINNER, // No BOLT, using SPINNER as similar
    trend: '-0.5d',
    trendText: 'faster',
    status: 'Improved',
    accent: 'border-cyan-500',
    barPercent: 65,
    iconColor: 'text-cyan-500',
  },
  {
    title: 'Delayed Shipments',
    value: '18',
    icon: PrimeIcons.EXCLAMATION_TRIANGLE,
    trend: '+4',
    trendText: 'vs last time',
    status: 'Needs Review',
    accent: 'border-red-500',
    barPercent: 40,
    iconColor: 'text-red-500',
  },
];

const ShipmentStats = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`relative flex flex-col gap-2 px-5 py-4 rounded-lg bg-white/70 dark:bg-white/5 shadow-sm backdrop-blur-md border-l-4 ${stat.accent} transition-transform transform hover:scale-[1.015] hover:shadow-md`}
        >
          <div className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
            <i className={`pi ${stat.icon} ${stat.iconColor} text-lg`} />
            <span className="text-sm font-medium">{stat.title}</span>
          </div>

          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {stat.value}
          </div>

          <div className="w-full h-2 bg-gray-200/60 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{
                width: `${stat.barPercent}%`,
                backgroundColor:
                  stat.accent.includes('blue')
                    ? '#3B82F6'
                    : stat.accent.includes('green')
                    ? '#22C55E'
                    : stat.accent.includes('cyan')
                    ? '#06B6D4'
                    : '#EF4444',
              }}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
            <span>
              {stat.trend}{' '}
              <span className="opacity-75">{stat.trendText}</span>
            </span>
            <span className="font-semibold">{stat.status}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ShipmentStats;
