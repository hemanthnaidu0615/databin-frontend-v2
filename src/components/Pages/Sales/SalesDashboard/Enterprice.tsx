import { useState } from "react";
import ChartSection from "./ChartSection";
import ByTypeSection from "./ByTypeSection";
import VolumeValueSection from "./VolumeValueSection";

interface Props {
  company: "AWW" | "AWD";
}

const tabs = ["Chart", "By Type", "Volume-Value"];

const CompanySection: React.FC<Props> = ({ company }) => {
  const [activeTab, setActiveTab] = useState("Chart");

  return (
    <div className="w-full px-4 md:px-6 lg:px-8 max-w-screen-xl mx-auto space-y-6">
      {/* Header Section: Company Name + Tabs */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {company}
        </h2>
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === tab
                  ? "bg-black text-white dark:bg-white dark:text-black"
                  : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Active Tab Content */}
      <div>
        {activeTab === "Chart" && <ChartSection company={company} />}
        {activeTab === "By Type" && <ByTypeSection company={company} />}
        {activeTab === "Volume-Value" && (
          <VolumeValueSection company={company} />
        )}
      </div>
    </div>
  );
};

export default CompanySection;
