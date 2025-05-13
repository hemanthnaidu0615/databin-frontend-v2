type VolumeRow = {
  productId: string;
  category: string;
  brand: string;
  volume: number;
};

type ValueRow = {
  productId: string;
  category: string;
  brand: string;
  value: number;
};

type SectionData =
  | {
      title: 'By Volume';
      totalKey: 'volume';
      data: VolumeRow[];
    }
  | {
      title: 'By Value';
      totalKey: 'value';
      data: ValueRow[];
    };

const volumeData: VolumeRow[] = [
  {
    productId: 'A512457000010000',
    category: '6 String Acoustic Guitars',
    brand: 'Baldwin 5485V Window',
    volume: 36,
  },
];

const valueData: ValueRow[] = [
  {
    productId: 'A512457000015000',
    category: '6 String Acoustic Guitars',
    brand: 'Baldwin 5485V Window',
    value: 374606,
  },
];

const VolumeValueSection: React.FC<{ company: string }> = () => {
  const sections: SectionData[] = [
    {
      title: 'By Volume',
      totalKey: 'volume',
      data: volumeData,
    },
    {
      title: 'By Value',
      totalKey: 'value',
      data: valueData,
    },
  ];

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {sections.map((section) => (
        <div
          key={section.title}
          className="border rounded-xl shadow-sm overflow-hidden border-gray-200 dark:border-gray-700"
        >
          <div className="bg-violet-100 dark:bg-violet-900 px-4 py-2 font-semibold text-gray-800 dark:text-gray-100">
            {section.title}
          </div>
          <div className="max-h-[240px] overflow-y-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left bg-white dark:bg-gray-800">
                  <th className="px-4 py-2 font-medium text-gray-700 dark:text-gray-300">Item ID</th>
                  <th className="px-4 py-2 font-medium text-gray-700 dark:text-gray-300">
                    Web Category
                  </th>
                  <th className="px-4 py-2 font-medium text-gray-700 dark:text-gray-300">
                    Brand Name
                  </th>
                  <th className="px-4 py-2 font-medium text-gray-700 dark:text-gray-300">Total</th>
                </tr>
              </thead>
              <tbody>
                {section.data.map((row, idx) => (
                  <tr
                    key={idx}
                    className="border-t border-gray-100 dark:border-gray-700 even:bg-gray-50 dark:even:bg-gray-800"
                  >
                    <td className="px-4 py-2 text-gray-800 dark:text-gray-200">{row.productId}</td>
                    <td className="px-4 py-2 text-gray-800 dark:text-gray-200">{row.category}</td>
                    <td className="px-4 py-2 text-gray-800 dark:text-gray-200">{row.brand}</td>
                    <td className="px-4 py-2 text-gray-800 dark:text-gray-200">
                      {'value' in row
                        ? `$${(row as ValueRow).value.toLocaleString()}`
                        : (row as VolumeRow).volume.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VolumeValueSection;
