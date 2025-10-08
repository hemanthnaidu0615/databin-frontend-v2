import { useState, useMemo, useEffect } from "react";
import { Card } from "primereact/card";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useTheme } from "next-themes";
import { Skeleton } from "primereact/skeleton";
import { axiosInstance } from "../../../../axios";
import { formatDateTime, formatValue , formatUSD } from "../../../utils/kpiUtils";
import { useDateRangeEnterprise } from "../../../utils/useGlobalFilters";
import { getBaseTooltip, revenueTooltip } from "../../../modularity/graphs/graphWidget";
import FilteredDataDialog from "../../../modularity/tables/FilteredDataDialog";
import { FaTable } from "react-icons/fa";
import { PrimeSelectFilter } from "../../../modularity/dropdowns/Dropdown";
import { useCallback } from "react";
import * as XLSX from "xlsx";
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

const exportToXLSX = (data: any[]) => {
  const renamedData = data.map((item) => ({
    "Product Name": item.product_name,
    "Units Sold": item.units_sold,
    "Total Sales (USD)": formatUSD(convertToUSD(item.total_sales)),
  }));

  const worksheet = XLSX.utils.json_to_sheet(renamedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Product Sales");
  XLSX.writeFile(workbook, "product_sales_export.xlsx");
};

const exportData = async () => {
  try {
    if (!startDate || !endDate) {
      alert("Date range not available. Please select a date range.");
      return;
    }

    const formattedStart = formatDateTime(startDate);
    const formattedEnd = formatDateTime(endDate);

    const params = {
      startDate: formattedStart,
      endDate: formattedEnd,
      enterpriseKey: enterpriseKey || undefined,
      
      size: "100000",
    };

    const response = await axiosInstance.get(
      `/analysis/product-sales-summary`,
      { params }
    );
    const dataToExport = (response.data as { products?: any[] }).products || [];
    exportToXLSX(dataToExport);
  } catch (err) {
    console.error("Export failed:", err);
    alert("Failed to export data.");
  }
};
  const [rows, setRows] = useState(5);
  const [first, setFirst] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
 
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogFilter, setDialogFilter] = useState<string | null>(null);

  const createFetchData = (endpoint: string, baseParams: Record<string, any>) => {
    return (params = {}) => {
      return async (tableParams: any) => {
        const combinedParams = {
          ...baseParams,
          ...params,
          page: tableParams.page,
          size: tableParams.pageSize,
          sortField: tableParams.sortField,
          sortOrder: tableParams.sortOrder,
          filters: tableParams.filters,
        };

        try {
          const response = await axiosInstance.get(endpoint, { params: combinedParams });

          
          return {
            data: (response.data as { products?: any[] }).products || [],   
            count: (response.data as { count?: number }).count || 0,
          };
        } catch (error) {
          console.error("Failed to fetch filtered data:", error);
          return { data: [], count: 0 };
        }
      };

      if (tableParams && typeof tableParams === "object") {
        Object.entries(tableParams).forEach(([k, v]) => {
          if (["page", "size", "rows", "first", "sortField", "sortOrder"].includes(k)) return;
          if (k.endsWith(".value") || k.endsWith(".matchMode") || !k.includes("filters")) {
            queryParams[k] = v;
          }
        });
      }

      if (tableParams && tableParams.filters && typeof tableParams.filters === "object") {
        Object.entries(tableParams.filters).forEach(([field, filterObj]: any) => {
          if (filterObj == null) return;
          if (filterObj.value !== undefined && filterObj.value !== null && filterObj.value !== "") {
            queryParams[`${field}.value`] = filterObj.value;
          }
          if (filterObj.matchMode !== undefined && filterObj.matchMode !== null) {
            queryParams[`${field}.matchMode`] = filterObj.matchMode;
          }
        });
      }
      try {
        const response = await axiosInstance.get(endpoint, { params: queryParams });
        return {
          data: (response.data as { products?: any[] }).products || [],
          count: (response.data as { count?: number }).count || 0,
        };
      } catch (err) {
        console.error("Failed to fetch filtered data:", err);
        return { data: [], count: 0 };
      }
    };
  };
};

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

  const topProducts = useMemo(() => sortedProducts.slice(0, 10), [sortedProducts]);
  const dialogFetchData = useCallback(
    createFetchData("analysis/details-products-grid", {
      startDate: startDate ? formatDateTime(startDate) : undefined,
      endDate: endDate ? formatDateTime(endDate) : undefined,
      enterpriseKey,
      productName: dialogFilter || undefined,
    }),
    [startDate, endDate, enterpriseKey, dialogFilter]
  );


  const chartOptions: ApexOptions = useMemo(
    () => ({
      chart: {
        type: "bar",
        toolbar: { show: false },
        foreColor: isDark ? "#CBD5E1" : "#334155",
        events: {
          dataPointSelection: (_: any, _chartContext, config) => {
            const index = config.dataPointIndex;
            const selectedProduct = topProducts[index]?.product_name;
            if (selectedProduct) {
              setDialogFilter(selectedProduct);
              setDialogVisible(true);
            }
          },
        },
      },

      xaxis: {
        categories: topProducts.map((p) => p.product_name),
        labels: {
          style: {
            fontSize: "12px",
            colors: isDark ? "#CBD5E1" : "#334155",
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
            color: isDark ? "#CBD5E1" : "#64748B",
          },
        },
      },
      yaxis: {
        title: {
          text: viewMode === "revenue" ? "Total Sales ($)" : "Units Sold",
          style: {
            fontSize: "14px",
            fontWeight: "normal",
            color: isDark ? "#CBD5E1" : "#64748B",
          },
        },
        labels: {
          formatter: (val: number) =>
            viewMode === "revenue" ? `$${formatValue(val)}` : formatValue(val),
        },
      },
      dataLabels: { enabled: false },
      plotOptions: { bar: { borderRadius: 4, columnWidth: "50%" } },
      grid: { borderColor: isDark ? "#334155" : "#E5E7EB" },
      colors: ["#a855f7"],
      legend: { show: false },
      tooltip: getBaseTooltip(isDark, revenueTooltip),
    }),
    [isDark, viewMode, topProducts]
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
  const productDialogMobileCardRender = (product: any, index: number) => (
    <div
      key={`${product.product_name || index}`}
      className={`bg-gray-100 dark:bg-gray-800 rounded-lg p-4 flex flex-col gap-2 shadow-sm border ${isDark ? "border-gray-700" : "border-gray-200"
        } mb-3`}
    >
      <div className="flex flex-col">
        <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">Product Name:</span>
        <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 break-words">
          {product.product_name || "N/A"}
        </span>
      </div>

      <div className="flex flex-col">
        <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">Description:</span>
        <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 break-words">
          {product.product_description || "N/A"}
        </span>
      </div>

      <div className="flex justify-between">
        <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">Quantity:</span>
        <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
          {product.quantity || 0}
        </span>
      </div>

      <div className="flex justify-between">
      <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">Unit Price:</span>
      <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
        {formatUSD(product.unit_price)}
      </span>
    </div>

    <div className="flex justify-between">
      <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">Total Amount:</span>
      <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
        {formatUSD(product.total_amount)}
      </span>
    </div>
    </div>
  );

  return (
    <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-md rounded-xl">
      <div className="flex flex-col gap-4 px-4 pt-4">
     {/* The new container for the heading and button */}
  <div className="flex justify-between items-center mb-2">
    <h2 className="app-subheading">Product Sales</h2>
    <button
      className="px-4 py-2 text-sm border rounded-md dark:border-white/20 dark:hover:bg-white/10 dark:text-white/90"
      onClick={exportData}
    >
      Export
    </button>
  </div>
        <div className="flex flex-col gap-2 w-full">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setFirst(0);
            }}
            className="app-search-input w-full max-w-full"
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
            style={{ minWidth: "100px" }}
          />
          <Column
            field="total_sales"
            header="Total Sales ($)"
            sortable
            className="app-table-content"
            body={(rowData) => `$${formatValue(convertToUSD(rowData.total_sales))}`}
            style={{ minWidth: "150px" }}
          />
        </DataTable>
      </div>

      {/* Mobile Table */}
      <div className="block sm:hidden p-4 pb-8">
        <DataTable
          value={paginatedProducts}
          paginator
          paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
          rows={rows}
          first={first}
          onPage={onPageChange}
          rowsPerPageOptions={[5, 10, 25]}
          emptyMessage="No products found for the selected filters"
          className="app-table-content"
          scrollable
          scrollHeight="320px"
        >
          <Column
            field="product_name"
            header="Product Name"
            body={(rowData) => (
              <div className="truncate max-w-[220px]" title={rowData.product_name}>
                {rowData.product_name}
              </div>
            )}
            style={{ minWidth: "160px" }}
          />
          <Column
            field="units_sold"
            header="Units Sold"
            body={(rowData) => formatValue(rowData.units_sold)}
            style={{ minWidth: "100px" }}
          />
          <Column
            field="total_sales"
            header="Total Sales ($)"
            body={(rowData) => `$${formatValue(convertToUSD(rowData.total_sales))}`}
            style={{ minWidth: "140px" }}
          />
        </DataTable>
      </div>

      {/* Chart with button next to title */}
      <div className="px-4 pb-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="app-subheading text-lg font-semibold">
            Top 10 Products Visualization
          </h3>
          <div className="flex items-center gap-2"> {/* New wrapper for buttons */}
          <button
        className="px-4 py-2 text-sm border rounded-md dark:border-white/20 dark:hover:bg-white/10 dark:text-white/90"
        onClick={exportData}
      >
        Export
      </button>
          <button
            className="text-purple-500 hover:text-purple-700"
            onClick={() => {
              setDialogFilter(null); 
              setDialogVisible(true);
            }}
            aria-label="Open product details"
          >
            <FaTable size={18} />
          </button>
        </div>
        </div>
        <Chart
          options={chartOptions}
          series={chartSeries}
          type="bar"
          height={320}
          width="100%"
        />
      </div>

      {/* FilteredDataDialog for detailed product info */}
      <FilteredDataDialog
        visible={dialogVisible}
        onHide={() => setDialogVisible(false)}
        header="Product Details"
        fetchData={dialogFetchData}
  columns={[
    { field: "product_name", header: "Product Name", sortable: true, filter: true },
    { field: "product_description", header: "Description", sortable: true, filter: true },
    { field: "quantity", header: "Quantity", sortable: true, filter: true }, 
    { field: "unit_price", header: "Unit Price", sortable: true, filter: false, body: (rowData) => formatUSD(rowData.unit_price) },
    { field: "total_amount", header: "Total Amount", sortable: true, filter: false, body: (rowData) => formatUSD(rowData.total_amount) },
  ]}
  mobileCardRender={productDialogMobileCardRender}
      />

    </Card>
  );
};

export default TopProductsTable;
