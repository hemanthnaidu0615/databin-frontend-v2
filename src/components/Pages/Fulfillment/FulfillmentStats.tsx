import { PrimeIcons } from 'primereact/api';
import 'primeicons/primeicons.css';

const stats = [
  {
    title: 'Orders in Pipeline',
    value: 347,
    icon: PrimeIcons.INBOX,
    accent: 'border-purple-500',
    barColor: 'bg-purple-500',
    iconColor: 'text-purple-500',
    barPercent: 75,
  },
  {
    title: 'Avg Fulfillment Time',
    value: '1.7 days',
    icon: PrimeIcons.CLOCK,
    accent: 'border-green-500',
    barColor: 'bg-green-500',
    iconColor: 'text-green-500',
    barPercent: 65,
  },
  {
    title: 'On-Time Rate',
    value: '92%',
    icon: PrimeIcons.CHECK_CIRCLE,
    accent: 'border-yellow-500',
    barColor: 'bg-yellow-500',
    iconColor: 'text-yellow-500',
    barPercent: 80,
  },
  {
    title: 'Awaiting Processing',
    value: 53,
    icon: PrimeIcons.EXCLAMATION_CIRCLE,
    accent: 'border-red-500',
    barColor: 'bg-red-500',
    iconColor: 'text-red-500',
    barPercent: 40,
  },
];

const FulfillmentStats = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`relative flex flex-col justify-between gap-3 px-5 py-4 rounded-xl
            bg-white dark:bg-[#111827] text-gray-900 dark:text-white
            shadow-sm transition-transform transform hover:scale-[1.015]
            border-l-4 ${stat.accent}`}
        >


          
          <div className="flex items-center gap-2">
            <i className={`pi ${stat.icon} ${stat.iconColor} text-lg`} />
            <span className="text-sm font-semibold">{stat.title}</span>
          </div>

          <div className="text-2xl font-extrabold">{stat.value}</div>

          <div className="w-full h-2 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
            <div
              className={`h-full rounded-full transition-all duration-700 ease-out ${stat.barColor}`}
              style={{ width: `${stat.barPercent}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default FulfillmentStats;
