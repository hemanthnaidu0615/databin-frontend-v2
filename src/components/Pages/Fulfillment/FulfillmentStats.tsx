import { PrimeIcons } from 'primereact/api';
import 'primeicons/primeicons.css';

const stats = [
  {
    title: 'Orders in Pipeline',
    value: 347,
    icon: PrimeIcons.INBOX,
    accent: 'border-purple-500',
    iconColor: 'text-purple-500',
    glowColor: '#8b5cf6', // Purple glow
  },
  {
    title: 'Avg Fulfillment Time',
    value: '1.7 days',
    icon: PrimeIcons.CLOCK,
    accent: 'border-green-500',
    iconColor: 'text-green-500',
    glowColor: '#00c853', // Green glow
  },
  {
    title: 'On-Time Rate',
    value: '92%',
    icon: PrimeIcons.CHECK_CIRCLE,
    accent: 'border-yellow-500',
    iconColor: 'text-yellow-500',
    glowColor: '#ffc400', // Yellow glow
  },
  {
    title: 'Awaiting Processing',
    value: 53,
    icon: PrimeIcons.EXCLAMATION_CIRCLE,
    accent: 'border-red-500',
    iconColor: 'text-red-500',
    glowColor: '#ff3d00', // Red glow
  },
];

const FulfillmentStats = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`group relative flex flex-col justify-center gap-3 px-5 py-4 rounded-xl
            bg-white dark:bg-white/10 text-gray-900 dark:text-white
            shadow-sm backdrop-blur-md transition-all duration-300 hover:scale-[1.015]
            border-l-4 ${stat.accent}`}
        >
          {/* Border glow effect on hover */}
          <div
            className="absolute inset-0 rounded-xl border-2 opacity-0 group-hover:opacity-60 group-hover:shadow-[0_0_15px] transition duration-300 pointer-events-none"
            style={{
              borderColor: stat.glowColor,
              boxShadow: `0 0 15px ${stat.glowColor}`,
            }}
          ></div>

          <div className="flex items-center gap-2  relative z-10">
            <i className={`pi ${stat.icon} ${stat.iconColor} text-lg`} />
            <span className="text-sm font-semibold">{stat.title}</span>
          </div>

          <div className="text-2xl font-extrabold relative z-10">{stat.value}</div>
        </div>
      ))}
    </div>
  );
};

export default FulfillmentStats;
