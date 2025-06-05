import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import ApexCharts from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useNavigate } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { axiosInstance } from "../../axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShareFromSquare } from "@fortawesome/free-solid-svg-icons";

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

  const dateRange = useSelector((state: any) => state.dateRange.dates);
  const enterpriseKey = useSelector((state: any) => state.enterpriseKey.key);
  const [startDate, endDate] = dateRange;

  const navigate = useNavigate();

  const formatValue = (Revenue: number) => {
    if (Revenue >= 1_000_000) return (Revenue / 1_000_000).toFixed(1) + "M";
    if (Revenue >= 1_000) return (Revenue / 1_000).toFixed(1) + "K";
    return Revenue.toFixed(0);
  };

  const fetchData = async () => {
    if (!startDate || !endDate) return;

    const formattedStart = formatDate(startDate);
    const formattedEnd = formatDate(endDate);

    const params = new URLSearchParams({
      startDate: formattedStart,
      endDate: formattedEnd,
    });

    if (enterpriseKey) {
      params.append("enterpriseKey", enterpriseKey);
    }

    try {
      setIsLoading(true);

      const response = await axiosInstance.get(
        `/revenue/top-customers?${params.toString()}`
      );

      const result = response.data as {
        top_customers: { customer_name: string; revenue: number }[];
      };

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

  useEffect(() => {
    fetchData();
  }, [startDate, endDate, enterpriseKey]);

  useEffect(() => {
    const scrollY = sessionStorage.getItem("scrollPosition");
    if (scrollY) {
      window.scrollTo({ top: parseInt(scrollY), behavior: "auto" });
      sessionStorage.removeItem("scrollPosition");
    }
  }, []);

  const apexOptions: ApexOptions = {
    chart: {
      type: "bar",
      toolbar: { show: false },
      foreColor: "#a855f7",
    },
    colors: ["#a855f7"],
    xaxis: {
      categories: data.map((d) => d.customer),
      title: {
        text: "Customer",
        style: {
          fontWeight: "normal",
          fontSize: "14px",
          color: "#a855f7",
        },
      },
      tooltip: {
        enabled: false,
      },
      crosshairs: {
        show: false,
      },
      labels: {
        style: {
          colors: "#a855f7",
        },
      },
    },
    yaxis: {
      title: {
        text: "Revenue",
        style: {
          fontWeight: "normal",
          fontSize: "14px",
          color: "#a855f7",
        },
      },
      labels: {
        formatter: formatValue,
        style: {
          colors: "#a855f7",
        },
      },
    },
    plotOptions: {
      bar: {
        dataLabels: { position: "top" },
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      x: { show: false },
      y: {
        formatter: formatValue,
      },
    },
    series: [
      {
        name: "Revenue",
        data: data.map((d) => d.revenue),
      },
    ],
  };

  const onViewMore = () => {
    sessionStorage.setItem("scrollPosition", window.scrollY.toString());
    navigate("/sales/dashboard");
  };

  return (
    <div className="relative border border-gray-200 dark:border-gray-800 p-4 sm:p-5 shadow-md bg-white dark:bg-gray-900 rounded-xl">
      {size === "full" && (
        <div className="flex justify-between items-start sm:items-center flex-wrap sm:flex-nowrap gap-2 mb-4">
          <div className="flex items-start justify-between w-full sm:w-auto">
            <h2 className="app-subheading flex-1 mr-2">Revenue Per Customer</h2>

            {/* Mobile arrow (→) */}
            <button
              onClick={onViewMore}
              className="sm:hidden text-purple-600 w-6 shadow text-xl font-medium self-start"
            >
              <FontAwesomeIcon
                icon={faShareFromSquare}
                size="sm"
                style={{ color: "#a855f7" }}
              />
            </button>
          </div>

          {/* Desktop & tablet "View More" */}
          <button
            onClick={onViewMore}
            className="hidden sm:block text-xs font-medium text-purple-600 hover:underline"
          >
            View More
          </button>
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
        </>
      )}
    </div>
  );
};

export default RevenuePerCustomer;
