// components/common/SimpleTabs.tsx
import { useState } from "react";

export interface TabItem {
  label: string;
  content: React.ReactNode;
}

interface SimpleTabsProps {
  tabs: TabItem[];
  /** Optional Tailwind classes for the nav bar */
  className?: string;
}

const SimpleTabs: React.FC<SimpleTabsProps> = ({ tabs, className = "" }) => {
  const [active, setActive] = useState(0);

  return (
    <div>
      {/* Tab nav */}
      <ul
        className={`flex gap-8 pb-2 overflow-x-auto border-b border-gray-200 dark:border-gray-700 ${className}`}
      >
        {tabs.map((tab, i) => (
          <li key={tab.label}>
            <button
              onClick={() => setActive(i)}
              className={`whitespace-nowrap pb-1 transition-colors
                ${
                  i === active
                    ? "border-b-2 border-blue-600 dark:border-blue-400 font-medium"
                    : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                }`}
            >
              {tab.label}
            </button>
          </li>
        ))}
      </ul>

      {/* Active panel */}
      <div className="pt-4">{tabs[active].content}</div>
    </div>
  );
};

export default SimpleTabs;
