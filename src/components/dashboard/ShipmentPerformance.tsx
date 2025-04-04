import React, { useState, useRef, useEffect } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { MoreDotIcon } from "../../icons";

type ShipmentPerformanceProps = {
  size?: "small" | "full";
  onRemove?: () => void;
  onViewMore?: () => void;
};

const ShipmentPerformance: React.FC<ShipmentPerformanceProps> = ({
  size = "full",
  onRemove,
  onViewMore,
}) => {
  const [timeFrame, setTimeFrame] = useState<"weekly" | "monthly">("weekly");
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const data = {
    weekly: {
      carriers: ["FedEx", "UPS", "DHL"],
      standard: [20, 15, 10],
      expedited: [10, 12, 14],
      sameDay: [5, 8, 11],
    },
    monthly: {
      carriers: ["FedEx", "UPS", "DHL"],
      standard: [80, 70, 60],
      expedited: [40, 38, 36],
      sameDay: [20, 25, 30],
    },
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const barOptions: ApexOptions = {
    chart: { type: "bar", stacked: true, toolbar: { show: false } },
    colors: ["#4CAF50", "#FF9800", "#2196F3"],
    plotOptions: { bar: { columnWidth: "50%" } },
    xaxis: { categories: data[timeFrame].carriers, title: { text: "Carriers" } },
    yaxis: { title: { text: "Number of Shipments" } },
    legend: { position: "top" },
  };

  const barSeries = [
    { name: "Standard", data: data[timeFrame].standard },
    { name: "Expedited", data: data[timeFrame].expedited },
    { name: "Same-Day", data: data[timeFrame].sameDay },
  ];

  return (
    <div className="border border-gray-200 dark:border-gray-800 p-4 sm:p-5 shadow-md bg-white dark:bg-gray-900 rounded-xl">
      {size === "full" && (
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Shipment Performance</h2>
          <div className="relative">
            <button ref={buttonRef} onClick={() => setDropdownOpen(!isDropdownOpen)} className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-white/10">
              <MoreDotIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </button>

            {isDropdownOpen && (
              <Dropdown isOpen={isDropdownOpen} onClose={() => setDropdownOpen(false)} className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 shadow-lg rounded-lg z-50">
                <DropdownItem onItemClick={() => { setDropdownOpen(false); onViewMore?.(); }}>
                  View More
                </DropdownItem>
                <DropdownItem onItemClick={() => { setDropdownOpen(false); onRemove?.(); }}>
                  Remove
                </DropdownItem>
              </Dropdown>
            )}
          </div>
        </div>
      )}
      <Chart options={barOptions} series={barSeries} type="bar" height={size === "small" ? 150 : 300} />
    </div>
  );
};

export default ShipmentPerformance;
