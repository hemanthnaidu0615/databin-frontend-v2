const sections = ['By Channel', 'By Fulfillment', 'By Item'];

const dummyData = [
  { name: 'CallCenter', units: '975,264', total: '$860' },
  { name: 'Web', units: '703,304', total: '$2,603' },
  { name: 'Other', units: '846', total: '$3' },
];

const ByTypeSection: React.FC<{ company: string }> = () => (
  <div className="grid md:grid-cols-3 gap-4">
    {sections.map((title) => (
      <div key={title} className="border rounded-xl shadow-sm overflow-hidden">
        <div className="bg-violet-100 px-4 py-2 font-semibold text-gray-800">{title}</div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left bg-white">
              <th className="px-4 py-2 font-medium">Name</th>
              <th className="px-4 py-2 font-medium">Units</th>
              <th className="px-4 py-2 font-medium">Total</th>
            </tr>
          </thead>
          <tbody>
            {dummyData.map((row, idx) => (
              <tr key={idx} className="border-t">
                <td className="px-4 py-2">{row.name}</td>
                <td className="px-4 py-2">{row.units}</td>
                <td className="px-4 py-2">{row.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ))}
  </div>
);

export default ByTypeSection;
