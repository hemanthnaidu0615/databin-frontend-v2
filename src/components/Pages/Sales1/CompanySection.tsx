import { useState } from 'react';
import ChartSection from './ChartSection';
import ByTypeSection from './ByTypeSection';
import VolumeValueSection from './VolumeValueSection';

interface Props {
  company: string;
}

const tabs = ['Chart', 'By Type', 'Volume-Value'];

const CompanySection: React.FC<Props> = ({ company }) => {
  const [activeTab, setActiveTab] = useState('Chart');

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">{company}</h2>
        <div className="flex space-x-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`px-4 py-1 rounded-md text-sm ${
                activeTab === tab ? 'bg-black text-white' : 'bg-gray-100'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'Chart' && <ChartSection company={company} />}
      {activeTab === 'By Type' && <ByTypeSection company={company} />}
      {activeTab === 'Volume-Value' && <VolumeValueSection company={company} />}
    </div>
  );
};

export default CompanySection;
