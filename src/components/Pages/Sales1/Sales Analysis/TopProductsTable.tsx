import { useState, useMemo, useEffect } from "react";
import { useSelector } from "react-redux";
import { Card } from "primereact/card";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dropdown } from "primereact/dropdown";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useTheme } from "next-themes";
import { Skeleton } from "primereact/skeleton";
import dayjs from "dayjs";

const viewOptions = [
  { label: "By Revenue", value: "revenue" },
  { label: "By Units", value: "units" },
];

interface Product {
  product_name: string;
  total_sales: number;
  units_sold: number;
}

const formatDate = (date: Date) => dayjs(date).format("YYYY-MM-DD");

// INR to USD conversion
const convertToUSD = (rupees: number): number => {
  const exchangeRate = 0.012; // Adjust as needed
  return rupees * exchangeRate;
};

// Number formatting helper
const formatValue = (value: number): string => {
  if (value >= 1_000_000) return (value / 1_000_000).toFixed(1) + "m";
  if (value >= 1_000) return (value / 1_000).toFixed(1) + "k";
  return value.toFixed(0);
};

const TopProductsTable = () => {
  const { theme } = useTheme();
  const [viewMode, setViewMode] = useState<"revenue" | "units">("revenue");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get filters from Redux
  const dateRange = useSelector((state: any) => state.dateRange.dates);
  const enterpriseKey = useSelector((state: any) => state.enterpriseKey.key);
  const [startDate, endDate] = dateRange || [];

  // Fetch products data when filters change
  useEffect(() => {
    const fetchProducts = async () => {
      if (!startDate || !endDate) return;

      setLoading(true);
      setError(null);

      const formattedStart = formatDate(new Date(startDate));
      const formattedEnd = formatDate(new Date(endDate));

      const params = new URLSearchParams({
        startDate: formattedStart,
        endDate: formattedEnd,
      });

      if (enterpriseKey) {
        params.append('enterpriseKey', enterpriseKey);
      }

      try {
        const response = await fetch(
          `http://localhost:8080/api/analysis/product-sales-summary?${params.toString()}`
        );
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();
        setProducts(data.products || []);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load product data");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [startDate, endDate, enterpriseKey]);

  // Get all products sorted by current view mode (for table)
  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) =>
      viewMode === "revenue" 
        ? b.total_sales - a.total_sales 
        : b.units_sold - a.units_sold
    );
  }, [viewMode, products]);

  // Get top 10 products sorted by current view mode (for chart)
  const topProducts = useMemo(() => {
    return sortedProducts.slice(0, 10);
  }, [sortedProducts]);

  const chartOptions: ApexOptions = useMemo(() => ({
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
        formatter: function(value: string) {
          return value.length > 20 ? value.substring(0, 20) + '...' : value;
        }
      },
      title: {
        text: "Product",
        style: {
          fontSize: "14px",
          fontWeight: "normal",
          color: theme === "dark" ? "#CBD5E1" : "#64748B",
        },
      },
    },
    yaxis: {
      title: {
        text: viewMode === "revenue" ? "Total Sales (USD)" : "Units Sold",
        style: {
          fontSize: "14px",
          fontWeight: "normal",
          color: theme === "dark" ? "#CBD5E1" : "#64748B",
        },
      },
      labels: {
        formatter: function(val: number) {
          return viewMode === "revenue" 
            ? `$${formatValue(val)}` 
            : formatValue(val);
        }
      }
    },
    dataLabels: { enabled: false },
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: "50%",
      },
    },
    grid: {
      borderColor: theme === "dark" ? "#334155" : "#E5E7EB",
    },
    colors: ["#2563eb"],
    legend: { show: false },
    tooltip: {
      y: {
        formatter: function(val: number) {
          return viewMode === "revenue" 
            ? `$${val.toFixed(2)}` 
            : `${val} units`;
        }
      }
    }
  }), [theme, viewMode, topProducts]);

  const chartSeries = [
    {
      name: viewMode === "revenue" ? "Revenue (USD)" : "Units Sold",
      data:
        viewMode === "revenue"
          ? topProducts.map((p) => convertToUSD(p.total_sales))
          : topProducts.map((p) => p.units_sold),
    },
  ];

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
        <div className="p-4 text-red-500 dark:text-red-400">
          {error}
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-md rounded-xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-4 pt-4 gap-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          Product Sales
        </h2>
        <Dropdown
          value={viewMode}
          options={viewOptions}
          onChange={(e) => setViewMode(e.value)}
          className="w-40"
        />
      </div>

      <div className="px-4 pt-2 pb-6">
        <DataTable
          value={sortedProducts}
          stripedRows
          responsiveLayout="scroll"
          scrollable
          scrollHeight="400px"
          sortMode="multiple"
          emptyMessage="No products found for the selected filters"
        >
          <Column 
            field="product_name" 
            header="Product Name" 
            sortable 
            className="text-sm" 
            style={{ minWidth: '200px' }}
          />
          <Column
            field="units_sold"
            header="Units Sold"
            sortable
            className="text-sm"
            body={(rowData) => formatValue(rowData.units_sold)}
            style={{ minWidth: '100px' }}
          />
          <Column
            field="total_sales"
            header="Total Sales (USD)"
            sortable
            className="text-sm"
            body={(rowData) => `$${formatValue(convertToUSD(rowData.total_sales))}`}
            style={{ minWidth: '150px' }}
          />
        </DataTable>
      </div>

      <div className="px-4 pb-6">
        <h3 className="text-md font-semibold text-gray-700 dark:text-gray-300 mb-4">
          Top 10 Products Visualization
        </h3>
        {topProducts.length > 0 ? (
          <Chart
            options={chartOptions}
            series={chartSeries}
            type="bar"
            height={350}
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