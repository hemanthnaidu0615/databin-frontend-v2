import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import ApexCharts from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { MoreDotIcon } from "../../icons";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

// Helper function to format date to match the API requirement
const formatDate = (date: string) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")} ${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}:${d.getSeconds().toString().padStart(2, "0")}.000`;
};

type RevenuePerCustomerProps = {
  size?: "small" | "full";
  hasTableRow?: boolean;
};

const RevenuePerCustomer: React.FC<RevenuePerCustomerProps> = ({ size = "full", hasTableRow = false }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [data, setData] = useState<{ customer: string; revenue: number }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Access the date range from Redux store
  const dateRange = useSelector((state: any) => state.dateRange.dates);
  const [startDate, endDate] = dateRange;

  useEffect(() => {
    // Fetch revenue data from API with date range
    const fetchData = async () => {
      try {
        const formattedStartDate = formatDate(startDate);
        const formattedEndDate = formatDate(endDate);

        const response = await fetch(
          `http://localhost:8080/api/revenue/top-customers?startDate=${encodeURIComponent(formattedStartDate)}&endDate=${encodeURIComponent(formattedEndDate)}`
        );
        if (!response.ok) throw new Error("Failed to fetch revenue data");
        const result = await response.json();

        const formattedData = result.top_customers.map((item: any) => ({
          customer: item.customer_name,
          revenue: item.revenue,
        }));

        setData(formattedData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (startDate && endDate) {
      fetchData();
    }
  }, [startDate, endDate]); // Re-run when startDate or endDate changes

  const apexOptions: ApexOptions = {
    chart: {
      type: "bar",
      toolbar: {
        show: false,
        tools: {
          download: false,
          selection: false,
          zoom: false,
          zoomin: false,
          zoomout: false,
          pan: false,
          reset: false,
        },
      },
    },
    xaxis: {
      categories: data.map((d) => d.customer),
      crosshairs: {
        show: false, // 👈 disables the white hover line
      },
    },
    series: [{ name: "Revenue", data: data.map((d) => d.revenue) }],
  };
  
  

  return (
    <div className="relative border border-gray-200 dark:border-gray-800 p-4 sm:p-5 shadow-md bg-white dark:bg-gray-900 rounded-xl">
      {size === "full" && (
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Revenue Per Customer</h2>

          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!isDropdownOpen)}
              className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-white/10"
              aria-label="More options"
            >
              <MoreDotIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </button>

            {isDropdownOpen && (
              <Dropdown isOpen={isDropdownOpen} onClose={() => setDropdownOpen(false)} className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 shadow-lg rounded-lg z-50">
                <DropdownItem onItemClick={() => setDropdownOpen(false)}>View More</DropdownItem>
                <DropdownItem onItemClick={() => setDropdownOpen(false)}>Remove</DropdownItem>
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
        <>
          <ApexCharts options={apexOptions} series={apexOptions.series} type="bar" height={size === "small" ? 150 : 300} />

          {hasTableRow && (
            <DataTable value={data} className="mt-4">
              <Column field="customer" header="Customer" />
              <Column field="revenue" header="Revenue" />
            </DataTable>
          )}
        </>
      )}
    </div>
  );
};

export default RevenuePerCustomer;
