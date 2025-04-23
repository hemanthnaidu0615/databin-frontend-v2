import { Card } from 'primereact/card';

const stats = [
  {
    title: 'Orders in Pipeline',
    value: 347,
    icon: 'pi pi-inbox',
    bg: 'bg-purple-600/20 text-purple-400',
    borderColor: 'border-purple-500', // Added border color for purple
  },
  {
    title: 'Avg Fulfillment Time',
    value: '1.7 days',
    icon: 'pi pi-clock',
    bg: 'bg-green-600/20 text-green-400',
    borderColor: 'border-green-500', // Added border color for green
  },
  {
    title: 'On-Time Rate',
    value: '92%',
    icon: 'pi pi-check-circle',
    bg: 'bg-yellow-600/20 text-yellow-400',
    borderColor: 'border-yellow-500', // Added border color for yellow
  },
  {
    title: 'Awaiting Processing',
    value: 53,
    icon: 'pi pi-exclamation-circle',
    bg: 'bg-red-600/20 text-red-400',
    borderColor: 'border-red-500', // Added border color for red
  },
];

const FulfillmentStats = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {stats.map((stat, i) => (
        <Card
          key={i}
          className={`rounded-xl shadow-none px-2  transition-all duration-300 transform hover:scale-105 hover:shadow-lg bg-[#1f2937] hover:bg-[#273043] dark:bg-[#1f2937] dark:hover:bg-[#273043] text-white border-4 ${stat.borderColor} hover:border-opacity-80`}
        >
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-md flex items-center justify-center text-lg ${stat.bg}`}>
              <i className={`${stat.icon}`} />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold leading-tight">{stat.value}</span>
              <span className="text-sm uppercase text-gray-400 tracking-wide">{stat.title}</span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default FulfillmentStats;
