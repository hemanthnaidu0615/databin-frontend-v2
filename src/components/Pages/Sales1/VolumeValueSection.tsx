const volumeData = [
    {
      id: 'A512457000010000',
      category: '6 String Acoustic Guitars',
      brand: 'Baldwin 5485V Window',
      total: '36',
    },
  ];
  
  const valueData = [
    {
      id: 'A512457000015000',
      category: '6 String Acoustic Guitars',
      brand: 'Baldwin 5485V Window',
      total: '$374,606',
    },
  ];
  
  const VolumeValueSection: React.FC<{ company: string }> = () => (
    <div className="grid md:grid-cols-2 gap-4">
      {[{ title: 'By Volume', data: volumeData }, { title: 'By Value', data: valueData }].map(
        (section) => (
          <div key={section.title} className="border rounded-xl shadow-sm overflow-hidden">
            <div className="bg-violet-100 px-4 py-2 font-semibold text-gray-800">{section.title}</div>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left bg-white">
                  <th className="px-4 py-2 font-medium">Item ID</th>
                  <th className="px-4 py-2 font-medium">Web Category</th>
                  <th className="px-4 py-2 font-medium">Brand Name</th>
                  <th className="px-4 py-2 font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {section.data.map((row, idx) => (
                  <tr key={idx} className="border-t">
                    <td className="px-4 py-2">{row.id}</td>
                    <td className="px-4 py-2">{row.category}</td>
                    <td className="px-4 py-2">{row.brand}</td>
                    <td className="px-4 py-2">{row.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}
    </div>
  );
  
  export default VolumeValueSection;
  