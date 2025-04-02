import React, { useState, useRef, useEffect } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { Dropdown } from "../../ui/dropdown/Dropdown";
import { DropdownItem } from "../../ui/dropdown/DropdownItem";
import { MoreDotIcon } from "../../../icons";

const InventoryHealth: React.FC = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    setIsDarkMode(document.documentElement.classList.contains("dark"));
  }, []);

  const turnoverData = {
    months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    turnoverRate: [5.2, 4.8, 5.5, 6.0, 5.7, 6.2],
  };

  const lowStockProducts = [
    { name: "Product A", stock: 5, restockDate: "2025-04-10" },
    { name: "Product B", stock: 3, restockDate: "2025-04-12" },
    { name: "Product C", stock: 8, restockDate: "2025-04-15" },
  ];

  const lineChartOptions: ApexOptions = {
    chart: {
      type: "line",
      fontFamily: "Outfit, sans-serif",
      toolbar: { show: false }, // ✅ Hides the toolbar
    },
    xaxis: {
      categories: turnoverData.months,
      labels: { style: { colors: isDarkMode ? "#fff" : "#000" } },
    },
    yaxis: {
      title: { text: "Turnover Rate" },
      labels: { style: { colors: isDarkMode ? "#fff" : "#000" } },
    },
    grid: {
      borderColor: isDarkMode ? "#444" : "#ddd",
    },
    stroke: { curve: "smooth" },
    tooltip: { theme: isDarkMode ? "dark" : "light" },
  };
  

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-transparent px-5 pt-5 dark:border-gray-800 sm:px-6 sm:pt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          Inventory Turnover & Low Stock Alerts
        </h2>
        <div className="relative inline-block">
          <button ref={buttonRef} onClick={() => setDropdownOpen(!isDropdownOpen)}>
            <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 size-6" />
          </button>
          {isDropdownOpen && (
            <div ref={dropdownRef} className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 shadow-md rounded-lg z-50">
              <Dropdown isOpen={isDropdownOpen} onClose={() => setDropdownOpen(false)}>
                <DropdownItem onItemClick={() => setDropdownOpen(false)}>View More</DropdownItem>
                <DropdownItem onItemClick={() => setDropdownOpen(false)}>Remove</DropdownItem>
              </Dropdown>
            </div>
          )}
        </div>
      </div>
      {/* Line Chart */}
      <Chart options={lineChartOptions} series={[{ name: "Turnover Rate", data: turnoverData.turnoverRate }]} type="line" height={300} />
      {/* Low Stock Table */}
      <div className="mt-6">
        <h3 className="text-md font-semibold text-gray-700 dark:text-white">Low Stock Products</h3>
        <table className="w-full mt-3 border-collapse border border-gray-300 dark:border-gray-700">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white">
              <th className="p-2 border border-gray-300 dark:border-gray-700">Product</th>
              <th className="p-2 border border-gray-300 dark:border-gray-700">Stock</th>
              <th className="p-2 border border-gray-300 dark:border-gray-700">Restock Date</th>
            </tr>
          </thead>
          <tbody>
            {lowStockProducts.map((product, index) => (
              <tr key={index} className="text-center text-gray-800 dark:text-white">
                <td className="p-2 border border-gray-300 dark:border-gray-700">{product.name}</td>
                <td className="p-2 border border-gray-300 dark:border-gray-700 font-semibold">{product.stock}</td>
                <td className="p-2 border border-gray-300 dark:border-gray-700">{product.restockDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryHealth;