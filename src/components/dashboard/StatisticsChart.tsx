import { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { MoreDotIcon } from "../../icons";

interface StatisticsChartProps {
  onRemove?: () => void;
  onViewMore?: () => void;
}

export default function StatisticsChart({}: StatisticsChartProps) {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [tooltipPosition, setTooltipPosition] = useState("left-8 sm:left-12 md:left-16 lg:left-20");
  const [isOpen, setIsOpen] = useState(false);

  const years = Array.from({ length: 16 }, (_, i) => currentYear - 10 + i);

  useEffect(() => {
    const sidebar = document.getElementById("sidebar");
    if (!sidebar) return;

    const updateTooltipPosition = () => {
      setTooltipPosition(
        sidebar.classList.contains("expanded")
          ? "left-16 sm:left-24 md:left-32 lg:left-40"
          : "left-8 sm:left-12 md:left-16 lg:left-20"
      );
    };

    updateTooltipPosition();
    const observer = new MutationObserver(updateTooltipPosition);
    observer.observe(sidebar, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) =>
    setSelectedYear(Number(event.target.value));

  const getChartData = () => [
    { name: "Sales", data: [180, 190, 170, 160, 175, 165, 170, 205, 230, 210, 240, 235] },
    { name: "Revenue", data: [40, 30, 50, 40, 55, 40, 70, 100, 110, 120, 150, 140] },
    { name: "Forecasted Sales", data: [190, 195, 180, 170, 180, 170, 175, 210, 235, 220, 250, 245] },
  ];

  const options: ApexOptions = {
    legend: { show: true },
    colors: ["#465FFF", "#9CB9FF", "#F59E0B"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      height: 260,
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
  return (
    <div className="flex flex-col gap-3">
      <div className="w-full rounded-lg border border-gray-200 bg-white px-3 pt-3 pb-4 shadow-md dark:border-gray-800 dark:bg-gray-900 relative overflow-hidden">
        <div className="flex justify-between">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-white">
            Sales & Revenue
          </h3>

          {/* Dropdown Actions */}
          <div className="relative">
            <button className="dropdown-toggle" onClick={() => setIsOpen(!isOpen)}>
              <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 size-5" />
            </button>
            {isOpen && (
              <Dropdown isOpen={true} onClose={() => setIsOpen(false)} className="w-36 p-2">
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
        <div className="flex items-center gap-2 mt-2">
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
        <div className="w-full mt-3">
          <Chart options={options} series={getChartData()} type="area" height={230} />
        </div>
      </div>
    </div>
  );
}
