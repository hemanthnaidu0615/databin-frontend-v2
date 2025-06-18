import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../../axios";
import { PrimeSelectFilter } from "../../modularity/dropdowns/Dropdown";
import { TableView, usePagination, TableColumn } from "../../modularity/tables/Table";
import { formatDateTime } from "../../utils/kpiUtils";
import { useDateRangeEnterprise } from "../../utils/useGlobalFilters";

interface Filters {
  selectedRegion: string;
  selectedSource: string;
  selectedLocation: string;
}

interface InventoryItem {
  name: string;
  category: string;
  warehouse: string;
  source: string;
  states: string;
  status: string;
}

interface InventoryTableProps {
  filters: Filters;
}

const statusColors = {
  Available: "text-green-500",
  "Out of Stock": "text-red-500",
  "Low Stock": "text-yellow-500",
};

const InventoryTable: React.FC<InventoryTableProps> = ({ filters }) => {
  const { page, rows, onPageChange } = usePagination();
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [productSearch, setProductSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [totalRecords, setTotalRecords] = useState(0);
  const [allCategories, setAllCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { dateRange } = useDateRangeEnterprise();
  const [startDate, endDate] = dateRange || [];

  const columns: TableColumn[] = [
    { field: "name", header: "Product Name", mobilePriority: true },
    { field: "category", header: "Category" },
    { field: "warehouse", header: "Warehouse" },
    { field: "source", header: "Source" },
    { field: "states", header: "State" },
    {
      field: "status",
      header: "Status",
      type: "tag",
      mobilePriority: true
    },
  ];

  const config = {
    columns,
    statusColors,
    mobileCardFields: ["name", "category", "warehouse", "source", "states", "status"],
  };

  const fetchData = async () => {
    if (!startDate || !endDate) return;

    setLoading(true);
    const formattedStart = formatDateTime(startDate);
    const formattedEnd = formatDateTime(endDate);
    const currentPage = page / rows;

    const params = {
      startDate: formattedStart,
      endDate: formattedEnd,
      page: currentPage.toString(),
      size: rows.toString(),
      ...(productSearch && { searchProduct: productSearch }),
      ...(selectedStatus && { statusFilter: selectedStatus }),
      ...(selectedCategory && { categoryFilter: selectedCategory }),
    };

    try {
      const response = await axiosInstance.get("/inventory/widget-data", {
        params,
      });

      const data = response.data as { count?: number; data?: any[] };
      setTotalRecords(data.count || 0);

      const mappedData: InventoryItem[] = (data.data || []).map(
        (item: any) => ({
          name: item.product_name,
          category: item.category_name,
          warehouse: item.warehouse_name,
          source: item.warehouse_function,
          states: item.warehouse_state,
          status: item.inventory_status,
        })
      );

      let filtered = mappedData;
      if (filters.selectedRegion) {
        filtered = filtered.filter(
          (item) =>
            item.warehouse.toLowerCase() ===
            filters.selectedRegion.toLowerCase()
        );
      }
      if (filters.selectedSource) {
        filtered = filtered.filter(
          (item) =>
            item.source.toLowerCase() === filters.selectedSource.toLowerCase()
        );
      }
      if (filters.selectedLocation) {
        filtered = filtered.filter((item) =>
          item.states
            .toLowerCase()
            .includes(filters.selectedLocation.toLowerCase())
        );
      }

      setInventoryItems(filtered);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch inventory data:", err);
      setError("Failed to load inventory data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [
    startDate,
    endDate,
    page,
    rows,
    productSearch,
    selectedStatus,
    selectedCategory,
    filters,
  ]);

  useEffect(() => {
    const fetchAllCategories = async () => {
      try {
        const response = await axiosInstance.get("/inventory/category-names");
        setAllCategories(
          Array.isArray(response.data)
            ? response.data.map((cat: any) => cat.name)
            : []
        );
      } catch (err) {
        console.error("Failed to fetch all categories:", err);
      }
    };

    fetchAllCategories();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
        <h3 className="app-section-title">Inventory List</h3>
        <div className="flex gap-2 flex-wrap items-center">
          <input
            type="text"
            placeholder="Search Product"
            className="app-search-input"
            value={productSearch}
            onChange={(e) => {
              setProductSearch(e.target.value);
              onPageChange(0, rows);
            }}
          />
          <PrimeSelectFilter<string>
            placeholder="All statuses"
            value={selectedStatus}
            options={["Available", "Out of Stock", "Low Stock"].map((status) => ({
              label: status,
              value: status,
            }))}
            onChange={(val) => {
              setSelectedStatus(val);
              onPageChange(0, rows);
            }}
            className="px-2 py-0 rounded-md text-sm bg-white leading-[0.9rem] text-black border border-gray-300 dark:bg-gray-800 dark:text-white dark:border-white/30 h-10"
          />

          <PrimeSelectFilter<string>
            placeholder="All categories"
            value={selectedCategory}
            options={allCategories.map((cat) => ({
              label: cat,
              value: cat,
            }))}
            onChange={(val) => {
              setSelectedCategory(val);
              onPageChange(0, rows);
            }}
            className="px-2 py-0 rounded-md text-sm bg-white leading-[0.9rem] text-black border border-gray-300 dark:bg-gray-800 dark:text-white dark:border-white/30 h-10"
          />
        </div>
      </div>

      <TableView
        data={inventoryItems}
        config={config}
        pagination={{
          page,
          rows,
          totalRecords,
          onPageChange,
        }}
        loading={loading}
        error={error}
      />
    </div>
  );
};

export default InventoryTable;