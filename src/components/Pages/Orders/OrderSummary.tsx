
import { Tooltip } from "primereact/tooltip";
import { Tag } from "primereact/tag";

const quickStats = [
  {
    icon: "📦",
    label: "Total Orders",
    value: "1,248",
    change: "+5.4% this week",
    tooltip: "Orders placed in selected date range",
  },
  {
    icon: "⏳",
    label: "Delayed Orders",
    value: "128",
    change: "-3.2% vs last week",
    tooltip: "Orders delivered later than expected",
  },
  {
    icon: "🚚",
    label: "Orders in Transit",
    value: "342",
    change: "+2.1% growth",
    tooltip: "Orders currently in shipping",
  },
];

export default function OrderSummary() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
      {quickStats.map((stat, idx) => (
        <div
          key={idx}
          className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 rounded-xl p-6 shadow-md flex flex-col justify-between items-start h-full transition-all duration-300"
        >
          {/* Top Section */}
          <div className="flex items-center gap-4 w-full">
            <div className="text-4xl">{stat.icon}</div>
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</div>
              <div className="text-2xl font-semibold">{stat.value}</div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="flex items-center justify-between w-full mt-5">
            <Tag
              value={stat.change}
              severity={stat.change.includes("+") ? "success" : "danger"}
              className="px-3 py-1 text-sm rounded-lg"
            />
            <i
              className="pi pi-info-circle text-sm cursor-pointer text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-all duration-200"
              data-pr-tooltip={stat.tooltip}
              data-pr-position="top"
            ></i>
          </div>
        </div>
      ))}
      <Tooltip target=".pi-info-circle" />
    </div>
  );
}
