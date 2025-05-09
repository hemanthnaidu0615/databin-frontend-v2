
import { PrimeIcons } from 'primereact/api';
import 'primeicons/primeicons.css';

const stats = [
  {
    title: 'Total Shipments',
    value: '1,562',
    icon: PrimeIcons.BOX,
    accent: 'border-blue-500',
    barPercent: 70,
    iconColor: 'text-blue-500',
    glowColor: '#3B82F6', // Blue glow
  },
  {
    title: 'On-Time Delivery',
    value: '92.3%',
    icon: PrimeIcons.CLOCK,
    accent: 'border-green-500',
    barPercent: 80,
    iconColor: 'text-green-500',
    glowColor: '#22C55E', // Green glow
  },
  {
    title: 'Avg Delivery Time',
    value: '2.8 days',
    icon: PrimeIcons.SPINNER,
    accent: 'border-cyan-500',
    barPercent: 65,
    iconColor: 'text-cyan-500',
    glowColor: '#06B6D4', // Cyan glow
  },
  {
    title: 'Delayed Shipments',
    value: '18',
    icon: PrimeIcons.EXCLAMATION_TRIANGLE,
    accent: 'border-red-500',
    barPercent: 40,
    iconColor: 'text-red-500',
    glowColor: '#EF4444', // Red glow
  },
];

const ShipmentStats = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`group relative flex flex-col gap-2 px-5 py-4 rounded-lg bg-white dark:bg-white/10 shadow-sm backdrop-blur-md border-l-4 ${stat.accent} transition-all duration-300 hover:scale-[1.015] hover:shadow-md`}
        >
          {/* Border glow effect on hover */}
          <div
            className="absolute inset-0 rounded-lg border-2 opacity-0 group-hover:opacity-60 group-hover:shadow-[0_0_15px] transition duration-300 pointer-events-none"
            style={{
              borderColor: stat.glowColor,
              boxShadow: `0 0 15px ${stat.glowColor}`,
            }}
          ></div>

          <div className="flex items-center gap-2 text-gray-800 dark:text-gray-200 relative z-10">
            <i className={`pi ${stat.icon} ${stat.iconColor} text-lg`} />
            <span className="text-sm font-medium">{stat.title}</span>
          </div>

          <div className="text-2xl font-bold text-gray-900 dark:text-white relative z-10">
            {stat.value}
          </div>

        </div>
      ))}
    </div>
  );
};

export default ShipmentStats;
