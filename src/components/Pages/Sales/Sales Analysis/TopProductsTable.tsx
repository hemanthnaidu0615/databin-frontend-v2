import { useState, useMemo, useEffect } from "react";
import { Card } from "primereact/card";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useTheme } from "next-themes";
import { Skeleton } from "primereact/skeleton";
import { axiosInstance } from "../../../../axios";
import { formatDateTime, formatValue } from "../../../utils/kpiUtils";
import { useDateRangeEnterprise } from "../../../utils/useGlobalFilters";
import { getBaseTooltip, revenueTooltip } from "../../../modularity/graphs/graphWidget";

import { PrimeSelectFilter } from "../../../modularity/dropdowns/Dropdown";

const viewOptions = [
  { label: "By Revenue", value: "revenue" as "revenue" },
  { label: "By Units", value: "units" as "units" },
];
interface Product {
  product_name: string;
  total_sales: number;
  units_sold: number;
}

const convertToUSD = (rupees: number): number => {
  const exchangeRate = 0.012;
  return rupees * exchangeRate;
};

const TopProductsTable = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [viewMode, setViewMode] = useState<"revenue" | "units">("revenue");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { dateRange, enterpriseKey } = useDateRangeEnterprise();
  const [startDate, endDate] = dateRange || [];

  const [rows, setRows] = useState(5);
  const [first, setFirst] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const onPageChange = (event: { first: number; rows: number }) => {
    setFirst(event.first);
    setRows(event.rows);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      if (!startDate || !endDate) return;

      setLoading(true);
      setError(null);

      const formattedStart = formatDateTime(startDate);
      const formattedEnd = formatDateTime(endDate);

      const params = new URLSearchParams({
        startDate: formattedStart,
        endDate: formattedEnd,
      });

      if (enterpriseKey) {
        params.append("enterpriseKey", enterpriseKey);
      }

      try {
        const response = await axiosInstance.get(
          `analysis/product-sales-summary?${params.toString()}`
        );
        const data = response.data as { products?: Product[] };
        setProducts(data.products || []);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products data");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [startDate, endDate, enterpriseKey]);

  const filteredProducts = useMemo(() => {
    if (!searchTerm) return products;
    return products.filter((p) =>
      p.product_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) =>
      viewMode === "revenue"
        ? b.total_sales - a.total_sales
        : b.units_sold - a.units_sold
    );
  }, [viewMode, filteredProducts]);

  const topProducts = useMemo(
    () => sortedProducts.slice(0, 10),
    [sortedProducts]
  );

  const chartOptions: ApexOptions = useMemo(
    () => ({
      chart: {
        type: "bar",
        toolbar: { show: false },
        foreColor: theme === "dark" ? "#CBD5E1" : "#334155",
      },
      xaxis: {
        categories: topProducts.map((p) => p.product_name),
        labels: {
          style: {
            fontSize: "12px",
            colors: theme === "dark" ? "#CBD5E1" : "#334155",
          },
          formatter: (value: string) =>
            value.length > 20 ? value.substring(0, 20) + "..." : value,
        },
        crosshairs: { show: false },
        title: {
          text: "Products",
          style: {
            fontSize: "14px",
            fontWeight: "normal",
            color: theme === "dark" ? "#CBD5E1" : "#64748B",
          },
        },
      },
      yaxis: {
        title: {
          text: viewMode === "revenue" ? "Total Sales ($)" : "Units Sold",
          style: {
            fontSize: "14px",
            fontWeight: "normal",
            color: theme === "dark" ? "#CBD5E1" : "#64748B",
          },
        },
        labels: {
          formatter: (val: number) =>
            viewMode === "revenue" ? `$${formatValue(val)}` : formatValue(val),
        },
      },
      dataLabels: { enabled: false },
      plotOptions: { bar: { borderRadius: 4, columnWidth: "50%" } },
      grid: { borderColor: theme === "dark" ? "#334155" : "#E5E7EB" },
      colors: ["#a855f7"],
      legend: { show: false },
      tooltip: getBaseTooltip(isDark, revenueTooltip),
    }),
    [theme, viewMode, topProducts]
  );

  const chartSeries = [
    {
      name: viewMode === "revenue" ? "Rev" : "Units Sold",
      data:
        viewMode === "revenue"
          ? topProducts.map((p) => convertToUSD(p.total_sales))
          : topProducts.map((p) => p.units_sold),
    },
  ];

  const paginatedProducts = useMemo(() => {
    return sortedProducts.slice(first, first + rows);
  }, [sortedProducts, first, rows]);

  if (!startDate || !endDate) {
    return (
      <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-md rounded-xl">
        <div className="text-center text-gray-500 dark:text-gray-400 p-4">
          Please select a date range to view top products
        </div>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-md rounded-xl">
        <div className="p-4">
          <Skeleton width="150px" height="30px" className="mb-4" />
          <Skeleton width="100%" height="300px" />
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-md rounded-xl">
        <div className="p-4 text-red-500 dark:text-red-400">{error}</div>
      </Card>
    );
  }

  return (
    <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-md rounded-xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-4 pt-4 gap-4">
        <h2 className="app-subheading">Product Sales</h2>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setFirst(0);
            }}
            className="app-search-input w-full sm:w-64"
          />
          <PrimeSelectFilter<"revenue" | "units">
            value={viewMode}
            options={viewOptions}
            onChange={setViewMode}
            className="w-full sm:w-64 h-10 leading-[0.9rem]"
            placeholder="Select View Mode "
          />
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden sm:block px-4 pt-2 pb-6 app-table-heading">
        <DataTable
          value={sortedProducts}
          stripedRows
          responsiveLayout="scroll"
          scrollable
          scrollHeight="428px"
          sortMode="multiple"
          emptyMessage="No products found for the selected filters"
        >
          <Column
            field="product_name"
            header="Product Name"
            sortable
            className="app-table-content"
            style={{ minWidth: "200px" }}
          />
          <Column
            field="units_sold"
            header="Units Sold"
            sortable
            className="app-table-content"
            body={(rowData) => formatValue(rowData.units_sold)}
            style={{ minWidth: "100px"}}
          />
          <Column
            field="total_sales"
            header="Total Sales ($)"
            sortable
            className="app-table-content"
            body={(rowData) =>
              `$${formatValue(convertToUSD(rowData.total_sales))}`
            }
            style={{ minWidth: "150px" }}
          />
        </DataTable>
      </div>

      {/* Mobile-friendly stacked cards */}
      <div className="block sm:hidden space-y-4 px-4 pt-2 pb-6">
        {paginatedProducts.map((product, index) => (
          <div
            key={index}
            className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 flex flex-col gap-2 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex flex-col">
              <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                Products:
              </span>
              <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 break-words">
                {product.product_name}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Units Sold:
              </span>
              <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                {formatValue(product.units_sold)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Total Sales:
              </span>
              <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                ${formatValue(convertToUSD(product.total_sales))}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* 🟣 ADDED: Mobile paginator for screens < sm */}
      <div className="mt-4 text-sm text-gray-800 dark:text-gray-100 sm:hidden px-4 pb-6">
        <div className="flex flex-col gap-2 mb-2">
          <div className="flex flex-col gap-1">
            <label htmlFor="mobileRows" className="whitespace-nowrap">
              Rows per page:
            </label>
            <select
              id="mobileRows"
              value={rows}
              onChange={(e) => {
                setRows(Number(e.target.value));
                setFirst(0);
              }}
              className="px-2 py-1 rounded dark:bg-gray-800 bg-gray-100 dark:text-white text-gray-800 w-full border"
            >
              {[5, 10, 20, 50, 100].map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div>
            Page {Math.floor(first / rows) + 1} of{" "}
            {Math.ceil(sortedProducts.length / rows)}
          </div>
        </div>

        <div className="flex flex-wrap justify-between gap-2">
          <button
            onClick={() => onPageChange({ first: 0, rows })}
            disabled={first === 0}
            className="flex-1 px-2 py-1 text-xs rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50"
          >
            ⏮ First
          </button>

          <button
            onClick={() =>
              onPageChange({ first: Math.max(0, first - rows), rows })
            }
            disabled={first === 0}
            className="flex-1 px-2 py-1 text-xs rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50"
          >
            Prev
          </button>

          <button
            onClick={() =>
              onPageChange({
                first:
                  first + rows < sortedProducts.length ? first + rows : first,
                rows,
              })
            }
            disabled={first + rows >= sortedProducts.length}
            className="flex-1 px-2 py-1 text-xs rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50"
          >
            Next
          </button>

          <button
            onClick={() =>
              onPageChange({
                first: (Math.ceil(sortedProducts.length / rows) - 1) * rows,
                rows,
              })
            }
            disabled={first + rows >= sortedProducts.length}
            className="flex-1 px-2 py-1 text-xs rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50"
          >
            ⏭ Last
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="relative px-4 overflow-visible">
        <h3 className="text-md font-semibold text-gray-700 dark:text-gray-300 mb-4 ">
          Top 10 Products Visualization
        </h3>
        {topProducts.length > 0 ? (
          <Chart
            options={chartOptions}
            series={chartSeries}
            type="bar"
            height={topProducts.length * 30 + 100} 
          />
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-400 h-[280px] flex items-center justify-center">
            No product data available for visualization
          </div>
        )}
      </div>
    </Card>
  );
};

export default TopProductsTable;