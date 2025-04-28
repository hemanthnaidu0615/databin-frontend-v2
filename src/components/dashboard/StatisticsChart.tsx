import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { MoreDotIcon } from "../../icons";

interface StatisticsChartProps {
  onRemove?: () => void;
  onViewMore?: () => void;
}

const formatDate = (date: string) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}-${d
    .getDate()
    .toString()
    .padStart(2, "0")} ${d.getHours().toString().padStart(2, "0")}:${d
    .getMinutes()
    .toString()
    .padStart(2, "0")}:${d.getSeconds().toString().padStart(2, "0")}.000`;
};

export default function StatisticsChart({}: StatisticsChartProps) {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [isOpen, setIsOpen] = useState(false);

  const years = Array.from({ length: 16 }, (_, i) => currentYear - 10 + i);

  const dateRange = useSelector((state: any) => state.dateRange.dates);
  const [startDate, endDate] = dateRange;

  const [sales, setSales] = useState<number>(0);
  const [forecastedSales, setForecastedSales] = useState<number>(0);
  const [revenue, setRevenue] = useState<number[]>(new Array(12).fill(0));

  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) =>
    setSelectedYear(Number(event.target.value));

  const fetchChartData = async () => {
    if (!startDate || !endDate) return;

    const formattedStart = formatDate(startDate);
    const formattedEnd = formatDate(endDate);

    try {
      const [salesRes, revenueRes, forecastedSalesRes] = await Promise.all([
        axios.get("http://localhost:8080/api/sales-revenue/sales-data", {
          params: { startDate: formattedStart, endDate: formattedEnd },
        }),
        axios.get("http://localhost:8080/api/sales-revenue/revenue-trends", {
          params: { startDate: formattedStart, endDate: formattedEnd },
        }),
        axios.get("http://localhost:8080/api/sales-revenue/forecasted-sales", {
          params: { startDate: formattedStart, endDate: formattedEnd },
        }),
      ]);

      setSales(salesRes.data.total_sales || 0);
      setForecastedSales(forecastedSalesRes.data.forecasted_sales || 0);

      // Map monthly revenue to corresponding months
      const monthlyRevenueMap = new Array(12).fill(0);
      revenueRes.data.revenue_trends.forEach((item: any) => {
        const monthIndex = new Date(item.month).getMonth(); // 0-based index
        monthlyRevenueMap[monthIndex] = item.monthly_revenue;
      });

      setRevenue(monthlyRevenueMap);
    } catch (error) {
      console.error("Error fetching statistics chart data:", error);
    }
  };

  useEffect(() => {
    fetchChartData();
  }, [startDate, endDate]);

  const options: ApexOptions = {
    legend: { show: true },
    colors: ["#465FFF", "#9CB9FF", "#F59E0B"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "area",
      toolbar: { show: false },
    },
    stroke: { curve: "smooth", width: [2, 2, 2] },
    fill: { type: "gradient", gradient: { opacityFrom: 0.65, opacityTo: 0 } },
    markers: { size: 3, strokeColors: "#fff", strokeWidth: 2, hover: { size: 5 } },
    grid: { xaxis: { lines: { show: false } }, yaxis: { lines: { show: true } } },
    dataLabels: { enabled: false },
    tooltip: { enabled: true },
    xaxis: {
      type: "category",
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: { labels: { style: { fontSize: "11px", colors: ["#6B7280"] } } },
  };

  function closeDropdown(): void {
    setIsOpen(false);
  }

  const series = [
    { name: "Sales", data: new Array(12).fill(sales / 12) }, // dummy split
    { name: "Revenue", data: revenue },
    { name: "Forecasted Sales", data: new Array(12).fill(forecastedSales / 12) }, // dummy split
  ];

  return (
    <div className="flex flex-col flex-1 h-full overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-gray-900">

      <div className="flex justify-between mb-1">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          Sales & Revenue
        </h3>


        <div className="relative">
          <button className="dropdown-toggle" onClick={() => setIsOpen(!isOpen)}>
            <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 size-6" />
          </button>
          {isOpen && (
            <Dropdown isOpen={true} onClose={closeDropdown} className="w-40 p-2">
              <DropdownItem onItemClick={closeDropdown} className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-200 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300">
                View More
              </DropdownItem>
              <DropdownItem onItemClick={closeDropdown} className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-200 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300">
                Remove
              </DropdownItem>
            </Dropdown>
          )}
        </div>
      </div>

      {/* Year Selector */}
      <div className="flex items-center gap-2">
        <select
          className="border rounded px-2 py-1 text-xs text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
          value={selectedYear}
          onChange={handleYearChange}
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {/* Chart */}
      <div className="flex-1 w-full mt-3">
        <Chart options={options} series={series} type="area" height="100%" />
      </div>
    </div>
  );
}
