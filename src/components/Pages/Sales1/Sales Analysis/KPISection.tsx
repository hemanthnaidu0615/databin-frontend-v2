import React from "react";
import { PrimeIcons } from "primereact/api";
import "primeicons/primeicons.css";

type KPIItem = {
  title: string;
  value: string | number;
  icon: string;
  border: string;
  iconColor: string;
};

// ✅ You can export this if you need it elsewhere too
const kpiData: KPIItem[] = [
  {
    title: "Total Sales",
    value: "$320.00",
    icon: PrimeIcons.DOLLAR,
    border: "#8b5cf6", // purple
    iconColor: "text-purple-500",
  },
  {
    title: "Total Orders",
    value: "2",
    icon: PrimeIcons.SHOPPING_CART,
    border: "#22c55e", // green
    iconColor: "text-green-500",
  },
  {
    title: "Avg. Order Value",
    value: "$160.00",
    icon: PrimeIcons.CHART_BAR,
    border: "#f59e0b", // amber
    iconColor: "text-yellow-500",
  },
  {
    title: "Total Taxes",
    value: "$28.00",
    icon: PrimeIcons.PERCENTAGE,
    border: "#ef4444", // red
    iconColor: "text-red-500",
  },
  {
    title: "Shipping Fees",
    value: "$12.00",
    icon: PrimeIcons.SEND,
    border: "#3b82f6", // blue
    iconColor: "text-blue-500",
  },
];

const KPISection: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
      {kpiData.map((item, index) => (
        <div
          key={index}
          className="group relative p-5 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-l-4 transition-all duration-300 ease-in-out hover:shadow-lg hover:scale-[1.02]"
          style={{ borderLeftColor: item.border }}
        >
          {/* Glowing border hover effect */}
          <div
            className="absolute inset-0 rounded-xl border-2 opacity-0 group-hover:opacity-60 group-hover:shadow-[0_0_15px] transition duration-300 pointer-events-none"
            style={{
              borderColor: item.border,
              boxShadow: `0 0 15px ${item.border}`,
            }}
          ></div>

          {/* KPI content */}
          <div className="relative z-10 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <i className={`pi ${item.icon} ${item.iconColor} text-lg`} />
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {item.title}
              </p>
            </div>

            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {item.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default KPISection;
