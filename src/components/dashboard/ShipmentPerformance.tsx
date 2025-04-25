import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { MoreDotIcon } from "../../icons";
import axios from "axios";

type ShipmentPerformanceProps = {
  size?: "small" | "full";
  onRemove?: () => void;
  onViewMore?: () => void;
};

// Full date formatting with time
const formatDateTime = (date: string) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")} ${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}:${d.getSeconds().toString().padStart(2, "0")}.000`;
};

const ShipmentPerformance: React.FC<ShipmentPerformanceProps> = ({
  size = "full",
  onRemove,
  onViewMore,
}) => {
  const [data, setData] = useState<{ carriers: string[]; standard: number[]; expedited: number[]; sameDay: number[] }>({
    carriers: [],
    standard: [],
    expedited: [],
    sameDay: [],
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const dateRange = useSelector((state: any) => state.dateRange.dates);
  const [startDate, endDate] = dateRange;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const formattedStartDate = formatDateTime(startDate);
        const formattedEndDate = formatDateTime(endDate);

        const res = await axios.get("http://localhost:8080/api/shipment-performance", {
          params: {
            startDate: formattedStartDate,
            endDate: formattedEndDate,
          },
        });

        const responseData = res.data.shipment_performance;

        const carriers = responseData.map((item: any) => item.carrier);
        const standard = responseData.map((item: any) => item.standard);
        const expedited = responseData.map((item: any) => item.expedited);
        const sameDay = responseData.map((item: any) => item.same_day);

        setData({ carriers, standard, expedited, sameDay });
      } catch (err: any) {
        setError(err.message || "Failed to fetch shipment data");
      } finally {
        setIsLoading(false);
      }
    };

    if (startDate && endDate) {
      fetchData();
    }
  }, [startDate, endDate]);

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
    xaxis: { categories: data.carriers, title: { text: "Carriers" } },
    yaxis: { title: { text: "Number of Shipments" } },
    legend: { position: "top" },
  };

  const barSeries = [
    { name: "Standard", data: data.standard },
    { name: "Expedited", data: data.expedited },
    { name: "Same-Day", data: data.sameDay },
  ];

  return (
    <div className="border border-gray-200 dark:border-gray-800 p-4 sm:p-5 shadow-md bg-white dark:bg-gray-900 rounded-xl">
      {size === "full" && (
        <div className="flex justify-between items-center mb-0">
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

      {isLoading ? (
        <p className="text-gray-600 dark:text-gray-300">Loading data...</p>
      ) : error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : (
        <Chart options={barOptions} series={barSeries} type="bar" height={size === "small" ? 150 : 300} />
      )}
    </div>
  );
};

export default ShipmentPerformance;
