import React, { useState, useRef, useEffect } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useSelector } from "react-redux";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { MoreDotIcon } from "../../icons";

const formatDate = (date: Date | string | null): string => {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(d.getDate()).padStart(2, "0")} 00:00:00.000`;
};

const InventoryHealth: React.FC = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [turnoverMonths, setTurnoverMonths] = useState<string[]>([]);
  const [turnoverRates, setTurnoverRates] = useState<number[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<
    { name: string; stock: number; restockDate: string }[]
  >([]);

  const dateRange = useSelector((state: any) => state.dateRange.dates);
  const [startDate, endDate] = dateRange;

  useEffect(() => {
    setIsDarkMode(document.documentElement.classList.contains("dark"));
  }, []);

  useEffect(() => {
    const fetchInventoryHealth = async () => {
      if (!startDate || !endDate) return;

      const formattedStart = formatDate(startDate);
      const formattedEnd = formatDate(endDate);

      try {
        const response = await fetch(
          `http://localhost:8080/api/inventory/turnover-and-alerts?startDate=${encodeURIComponent(
            formattedStart
          )}&endDate=${encodeURIComponent(formattedEnd)}`
        );

        const data = await response.json();
        console.log("📦 Inventory Health API data:", data);

        // 🛠 Fix mapping
        const months: string[] = [];
        const rates: number[] = [];

        if (Array.isArray(data.turnover_rates)) {
          data.turnover_rates.forEach((entry: any) => {
            if (entry.month && entry.turnover_rate != null) {
              months.push(entry.month);
              rates.push(entry.turnover_rate);
            }
          });
        }

        const lowStock = Array.isArray(data.low_stock_alerts)
          ? data.low_stock_alerts.map((item: any) => ({
              name: item.product_name || "Unnamed",
              stock: item.stock_quantity || 0,
              restockDate: item.restock_date?.split(" ")[0] || "-",
            }))
          : [];

        console.log("✅ Parsed months:", months);
        console.log("✅ Parsed rates:", rates);
        console.log("✅ Low stock:", lowStock);

        setTurnoverMonths(months);
        setTurnoverRates(rates);
        setLowStockProducts(lowStock);
      } catch (error) {
        console.error("❌ Failed to fetch inventory health data:", error);
      }
    };

    fetchInventoryHealth();
  }, [startDate, endDate]);

  const lineChartOptions: ApexOptions = {
    chart: {
      type: "line",
      fontFamily: "Outfit, sans-serif",
      toolbar: { show: false },
    },
    xaxis: {
      categories: turnoverMonths,
      labels: {
        style: {
          colors: isDarkMode ? "#fff" : "#000",
          fontWeight: 400, // <- Not bold
        },
      },
      axisBorder: {
        show: true,
        color: isDarkMode ? "#444" : "#ccc",
      },
      axisTicks: {
        show: true,
        color: isDarkMode ? "#444" : "#ccc",
      },
      title: {
        text: "Month",
        style: {
          color: isDarkMode ? "#ccc" : "#666",
          fontWeight: 400,
          fontSize: "14px",
        },
      },
    },
    yaxis: {
      title: {
        text: "Turnover Rate",
        style: {
          color: isDarkMode ? "#ccc" : "#666",
          fontWeight: 400,
          fontSize: "14px",
        },
      },
      labels: {
        style: {
          colors: isDarkMode ? "#fff" : "#000",
          fontWeight: 400,
        },
      },
      axisBorder: {
        show: true,
        color: isDarkMode ? "#444" : "#ccc",
      },
      axisTicks: {
        show: true,
        color: isDarkMode ? "#444" : "#ccc",
      },
    },
    grid: {
      borderColor: isDarkMode ? "#444" : "#ddd",
      strokeDashArray: 0, // solid lines
    },
    stroke: { curve: "smooth" },
    tooltip: { theme: isDarkMode ? "dark" : "light" },
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-transparent px-5 pt-5 dark:border-gray-800 sm:px-6 sm:pt-6">
      <div className="flex justify-between items-center mb-9">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          Inventory Turnover & Low Stock Alerts
        </h2>
        <div className="relative inline-block">
          <button
            ref={buttonRef}
            onClick={() => setDropdownOpen(!isDropdownOpen)}
          >
            <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 size-6" />
          </button>
          {isDropdownOpen && (
            <div
              ref={dropdownRef}
              className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 shadow-md rounded-lg z-50"
            >
              <Dropdown
                isOpen={isDropdownOpen}
                onClose={() => setDropdownOpen(false)}
              >
                <DropdownItem onItemClick={() => setDropdownOpen(false)}>
                  View More
                </DropdownItem>
                <DropdownItem onItemClick={() => setDropdownOpen(false)}>
                  Remove
                </DropdownItem>
              </Dropdown>
            </div>
          )}
        </div>
      </div>

      <Chart
        options={lineChartOptions}
        series={[{ name: "Turnover Rate", data: turnoverRates }]}
        type="line"
        height={300}
      />

      <div className="mt-8 pb-6">
        <h3 className="text-md font-semibold text-gray-700 dark:text-white">
          Low Stock Products
        </h3>
        <table className="w-full mt-3 border-collapse border border-gray-300 dark:border-gray-700">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white">
              <th className="p-2 border border-gray-300 dark:border-gray-700">
                Product
              </th>
              <th className="p-2 border border-gray-300 dark:border-gray-700">
                Stock
              </th>
              <th className="p-2 border border-gray-300 dark:border-gray-700">
                Restock Date
              </th>
            </tr>
          </thead>
          <tbody>
            {lowStockProducts.length > 0 ? (
              lowStockProducts.map((product, index) => (
                <tr
                  key={index}
                  className="text-center text-gray-800 dark:text-white"
                >
                  <td className="p-2 border border-gray-300 dark:border-gray-700">
                    {product.name}
                  </td>
                  <td className="p-2 border border-gray-300 dark:border-gray-700 font-semibold">
                    {product.stock}
                  </td>
                  <td className="p-2 border border-gray-300 dark:border-gray-700">
                    {product.restockDate}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={3}
                  className="text-center p-3 text-gray-500 dark:text-gray-400"
                >
                  No low stock alerts found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryHealth;
