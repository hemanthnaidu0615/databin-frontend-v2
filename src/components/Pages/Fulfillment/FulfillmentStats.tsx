import { Card } from 'primereact/card';

const stats = [
  {
    title: 'Orders in Pipeline',
    value: 347,
    change: '+12%',
    positive: true,
  },
  {
    title: 'Avg Fulfillment Time',
    value: '1.7 days',
    change: '-0.3d',
    positive: false,
  },
  {
    title: 'On-Time Rate',
    value: '92%',
    change: '-3%',
    positive: false,
  },
  {
    title: 'Awaiting Processing',
    value: 53,
    change: '+8',
    positive: false,
  },
];

const FulfillmentStats = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card
          key={index}
          className="shadow-md rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-4"
        >
          <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
            {stat.title}
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {stat.value}
          </div>
          <div className="flex items-center gap-1 text-sm mt-1">
            <i
              className={`pi ${
                stat.positive ? 'pi-arrow-up text-green-500' : 'pi-arrow-down text-red-500'
              }`}
            />
            <span
              className={`font-medium ${
                stat.positive ? 'text-green-500' : 'text-red-500'
              }`}
            >
              {stat.change}
            </span>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default FulfillmentStats;
