import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import ApexCharts from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useNavigate } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

// Helper function to format date to match the API requirement
const formatDate = (date: string) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${(d.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")} ${d
    .getHours()
    .toString()
    .padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}:${d
    .getSeconds()
    .toString()
    .padStart(2, "0")}.000`;
};

type RevenuePerCustomerProps = {
  size?: "small" | "full";
  hasTableRow?: boolean;
};

const RevenuePerCustomer: React.FC<RevenuePerCustomerProps> = ({
  size = "full",
  hasTableRow = false,
}) => {
  const [data, setData] = useState<{ customer: string; revenue: number }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Access the date range from Redux store
  const dateRange = useSelector((state: any) => state.dateRange.dates);
  const [startDate, endDate] = dateRange;

  const navigate = useNavigate();

  // View More function to navigate to /sales page
  function onViewMore(): void {
    navigate("/sales/dashboard");
  }

  useEffect(() => {
    // Fetch revenue data from API with date range
    const fetchData = async () => {
      try {
        const formattedStartDate = formatDate(startDate);
        const formattedEndDate = formatDate(endDate);

        const response = await fetch(
          `http://localhost:8080/api/revenue/top-customers?startDate=${encodeURIComponent(
            formattedStartDate
          )}&endDate=${encodeURIComponent(formattedEndDate)}`
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
        show: false,
      },
      title: {
        text: "Customer",
        style: {
          fontWeight: "normal",
          fontSize: "14px",
          color: "#6B7280", // Tailwind's gray-500
        },
      },
    },
    yaxis: {
      title: {
        text: "Revenue",
        style: {
          fontWeight: "normal",
          fontSize: "14px",
          color: "#6B7280",
        },
      },
    },
    plotOptions: {
      bar: {
        dataLabels: {
          position: "top",
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    series: [{ name: "Revenue", data: data.map((d) => d.revenue) }],
  };

  return (
    <div className="relative border border-gray-200 dark:border-gray-800 p-4 sm:p-5 shadow-md bg-white dark:bg-gray-900 rounded-xl">
      {size === "full" && (
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            Revenue Per Customer
          </h2>
        </div>
      )}

      {isLoading ? (
        <p className="text-gray-600 dark:text-gray-300">Loading data...</p>
      ) : error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : (
        <>
          <ApexCharts
            options={apexOptions}
            series={apexOptions.series}
            type="bar"
            height={size === "small" ? 150 : 300}
          />

          {hasTableRow && (
            <DataTable value={data} className="mt-4">
              <Column field="customer" header="Customer" />
              <Column field="revenue" header="Revenue" />
            </DataTable>
          )}

          {/* View More button */}
          <button
            onClick={onViewMore}
            className="absolute top-4 right-4 text-xs font-medium hover:underline"
            style={{ color: "#9614d0" }}
          >
            View More
          </button>
        </>
      )}
    </div>
  );
};

export default RevenuePerCustomer;
