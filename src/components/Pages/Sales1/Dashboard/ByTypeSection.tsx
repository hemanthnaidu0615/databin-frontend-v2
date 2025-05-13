const sections = ['By Channel', 'By Fulfillment', 'By Item'];

const dummyData = [
  { channel: 'CallCenter', quantity: 975264, amount: 860 },
  { channel: 'Web', quantity: 703304, amount: 2603 },
  { channel: 'Other', quantity: 846, amount: 3 },
];

const ByTypeSection: React.FC<{ company: string }> = () => (
  <div className="grid md:grid-cols-3 gap-4">
    {sections.map((title) => (
      <div
        key={title}
        className="border rounded-xl shadow-sm overflow-hidden border-gray-200 dark:border-gray-700"
      >
        <div className="bg-violet-100 dark:bg-violet-950 px-4 py-2 font-semibold text-gray-800 dark:text-violet-100">
          {title}
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left bg-white dark:bg-gray-800">
              <th className="px-4 py-2 font-medium text-gray-700 dark:text-gray-300">Name</th>
              <th className="px-4 py-2 font-medium text-gray-700 dark:text-gray-300">Units</th>
              <th className="px-4 py-2 font-medium text-gray-700 dark:text-gray-300">Total</th>
            </tr>
          </thead>
          <tbody>
            {dummyData.map((row, idx) => (
              <tr
                key={idx}
                className="border-t border-gray-100 dark:border-gray-700 even:bg-gray-50 dark:even:bg-gray-800"
              >
                <td className="px-4 py-2 text-gray-800 dark:text-gray-200">{row.channel}</td>
                <td className="px-4 py-2 text-gray-800 dark:text-gray-200">
                  {row.quantity.toLocaleString()}
                </td>
                <td className="px-4 py-2 text-gray-800 dark:text-gray-200">
                  ${row.amount.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ))}
  </div>
);

export default ByTypeSection;
