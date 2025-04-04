import React, { useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { MoreDotIcon } from "../../icons";
import Chart from "react-apexcharts";

const data = {
  categories: ["Viewed Product", "Added to Cart", "Initiated Checkout", "Purchased"],
  series: [{ name: "Sales Funnel", data: [4000, 3000, 2000, 1000] }],
};

type SalesFunnelProps = {
  size?: "small" | "full";
};

const SalesFunnel: React.FC<SalesFunnelProps> = ({ size = "full" }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const closeDropdown = () => setDropdownOpen(false);
  const removeChart = () => {
    setIsVisible(false);
    closeDropdown();
  };
  const restoreChart = () => setIsVisible(true);

  const options: ApexCharts.ApexOptions = {
    chart: { type: "bar" },
    xaxis: { categories: data.categories },
    plotOptions: { bar: { horizontal: true, barHeight: "50%" } },
    tooltip: { theme: "dark" },
  };

  return (
    <div className="relative border border-gray-200 dark:border-gray-800 p-4 sm:p-5 shadow-md bg-white dark:bg-gray-900 rounded-xl">
      {!isVisible && (
        <div className="flex justify-center">
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg" onClick={restoreChart}>
            Restore Chart
          </button>
        </div>
      )}

      {isVisible && (
        <>
          {size === "full" && (
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Sales Funnel</h2>
              <div className="relative">
                <button
                  className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-white/10"
                  onClick={() => setDropdownOpen(!isDropdownOpen)}
                >
                  <MoreDotIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </button>

                {isDropdownOpen && (
                  <Dropdown isOpen={isDropdownOpen} onClose={closeDropdown} className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 shadow-lg rounded-lg z-50">
                    <DropdownItem onItemClick={closeDropdown}>View More</DropdownItem>
                    <DropdownItem onItemClick={removeChart}>Remove</DropdownItem>
                  </Dropdown>
                )}
              </div>
            </div>
          )}

          <Chart options={options} series={data.series} type="bar" height={size === "small" ? 150 : 300} />
        </>
      )}
    </div>
  );
};

export default SalesFunnel;
