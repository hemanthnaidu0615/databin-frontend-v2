import React, { useState, useRef, useEffect } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { Dropdown } from "../../ui/dropdown/Dropdown";
import { DropdownItem } from "../../ui/dropdown/DropdownItem";
import { MoreDotIcon } from "../../../icons";

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
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-transparent p-5 dark:border-gray-800">
      {size === "full" && (
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            Shipment Performance
          </h2>
          <div className="relative inline-block">
            <button ref={buttonRef} onClick={() => setDropdownOpen(!isDropdownOpen)}>
              <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 size-6" />
            </button>
            {isDropdownOpen && (
              <div ref={dropdownRef} className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 shadow-md rounded-lg z-50">
                <Dropdown isOpen={isDropdownOpen} onClose={() => setDropdownOpen(false)}>
                  <DropdownItem onItemClick={() => { setDropdownOpen(false); onViewMore?.(); }}>
                    View More
                  </DropdownItem>
                  <DropdownItem onItemClick={() => { setDropdownOpen(false); onRemove?.(); }}>
                    Remove
                  </DropdownItem>
                </Dropdown>
              </div>
            )}
          </div>
        </div>
      )}
      <Chart options={barOptions} series={barSeries} type="bar" height={300} />
    </div>
  );
};

export default ShipmentPerformance;