interface Props {
    company: string;
  }
  
  const ChartSection: React.FC<Props> = ({ company }) => {
    return (
      <div className="p-4 border rounded-xl shadow-sm">
        <p className="text-sm font-medium text-gray-500 mb-2">Chart Type Dropdown Here</p>
        {/* Dynamically render chart/table based on dropdown selection */}
        <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
          <p className="text-gray-400">[ {company} Chart Placeholder ]</p>
        </div>
      </div>
    );
  };
  
  export default ChartSection;
  