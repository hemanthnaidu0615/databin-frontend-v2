import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Paginator } from "primereact/paginator";
import "primereact/resources/themes/lara-dark-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import { axiosInstance } from "../../../axios";

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

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
};

const formatDate = (date: Date): string => {
  return `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
};

const InventoryTable: React.FC<InventoryTableProps> = ({ filters }) => {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [productSearch, setProductSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [allCategories, setAllCategories] = useState<string[]>([]);

  const isMobile = useIsMobile();
  const dateRange = useSelector((state: any) => state.dateRange.dates);
  const [startDate, endDate] = dateRange || [];

  const statusColors = {
    Available: "text-green-500",
    "Out of Stock": "text-red-500",
    "Low Stock": "text-yellow-500",
  };

  const fetchData = async () => {
    if (!startDate || !endDate) return;

    const formattedStart = formatDate(new Date(startDate));
    const formattedEnd = formatDate(new Date(endDate));
    const page = first / rows;

    const params = {
      startDate: formattedStart,
      endDate: formattedEnd,
      page: page.toString(),
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
      setTotalCount(data.count || 0);

      const mappedData: InventoryItem[] = (data.data || []).map((item: any) => ({
        name: item.product_name,
        category: item.category_name,
        warehouse: item.warehouse_name,
        source: item.warehouse_function,
        states: item.warehouse_state,
        status: item.inventory_status,
      }));

      let filtered = mappedData;
      if (filters.selectedRegion) {
        filtered = filtered.filter(item =>
          item.warehouse.toLowerCase() === filters.selectedRegion.toLowerCase()
        );
      }
      if (filters.selectedSource) {
        filtered = filtered.filter(item =>
          item.source.toLowerCase() === filters.selectedSource.toLowerCase()
        );
      }
      if (filters.selectedLocation) {
        filtered = filtered.filter(item =>
          item.states.toLowerCase().includes(filters.selectedLocation.toLowerCase())
        );
      }

      setInventoryItems(filtered);
    } catch (error) {
      console.error("Failed to fetch inventory data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [startDate, endDate, first, rows, productSearch, selectedStatus, selectedCategory, filters]);

  useEffect(() => {
    const fetchAllCategories = async () => {
      try {
        const response = await axiosInstance.get("/inventory/category-names");
        setAllCategories(Array.isArray(response.data) ? response.data.map((cat: any) => cat.name) : []);
      } catch (error) {
        console.error("Failed to fetch all categories:", error);
      }
    };

    fetchAllCategories();
  }, []);



  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
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
              setFirst(0);
            }}
          />
          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setFirst(0);
            }}
            className="px-3 py-1 rounded-md text-sm bg-white text-black border border-gray-300 dark:bg-gray-800 dark:text-white dark:border-white/30"
          >
            <option value="">Status</option>
            <option value="Available">Available</option>
            <option value="Out of Stock">Out of Stock</option>
            <option value="Low Stock">Low Stock</option>
          </select>
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setFirst(0);
            }}
            className="px-3 py-1 rounded-md text-sm bg-white text-black border border-gray-300 dark:bg-gray-800 dark:text-white dark:border-white/30"
          >
            <option value="">Category</option>
            {allCategories.map((cat, i) => (
              <option key={i} value={cat}>
                {cat}
              </option>
            ))}
          </select>

        </div>
      </div>

      {/* Desktop Table */}
      <div className="overflow-hidden">
        <table className="hidden md:table min-w-full text-sm text-left">
          <thead className="border-b dark:border-gray-700">
            <tr>
              <th className="py-2 px-1 app-table-heading">Product Name</th>
              <th className="py-2 px-1 app-table-heading">Category</th>
              <th className="py-2 px-1 app-table-heading">Warehouse</th>
              <th className="py-2 px-1 app-table-heading">Source</th>
              <th className="py-2 px-1 app-table-heading">State</th>
              <th className="py-2 px-1 app-table-heading">Status</th>
            </tr>
          </thead>
          <tbody>
            {inventoryItems.map((item, idx) => (
              <tr key={idx} className="border-t dark:border-gray-700">
                <td className="py-2 px-1 app-table-content">{item.name}</td>
                <td className="py-2 px-1 app-table-content">{item.category}</td>
                <td className="py-2 px-1 app-table-content">{item.warehouse}</td>
                <td className="py-2 px-1 app-table-content">{item.source}</td>
                <td className="py-2 px-1 app-table-content">{item.states}</td>
                <td className="py-2 px-1 app-table-content font-medium">
                  <span className={statusColors[item.status as keyof typeof statusColors]}>
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4 mt-4">
        {inventoryItems.map((item, idx) => (
          <div key={idx} className="border rounded-lg p-6 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200">{item.name}</div>
            <div className="grid grid-cols-2 text-xs gap-y-2 text-gray-700 dark:text-gray-300">
              <div><strong>Category:</strong> {item.category}</div>
              <div><strong>Warehouse:</strong> {item.warehouse}</div>
              <div><strong>Source:</strong> {item.source}</div>
              <div><strong>State:</strong> {item.states}</div>
              <div>
                <strong>Status:</strong>{" "}
                <span className={statusColors[item.status as keyof typeof statusColors]}>
                  {item.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Section */}
      <div className="p-4 bg-white dark:bg-gray-900 rounded-b-lg">
        {!isMobile && (
          <div className="flex justify-center dark:text-gray-100">
            <Paginator
              first={first}
              rows={rows}
              totalRecords={totalCount}
              onPageChange={(e) => {
                setFirst(e.first);
                setRows(e.rows);
              }}
              template="RowsPerPageDropdown CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
              currentPageReportTemplate="Showing {first} to {last} of {totalRecords} items"
              rowsPerPageOptions={[5, 10, 20, 50]}
              className="w-full text-sm dark:text-white"
            />
          </div>
        )}

        {isMobile && (
          <div className="flex flex-col sm:hidden text-sm text-gray-700 dark:text-gray-100 mt-4">
            <div className="flex items-center justify-between gap-2 mb-2 w-full">
              <div className="flex items-center gap-2">
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
                  className="px-2 py-1 rounded dark:bg-gray-800 bg-gray-100 dark:text-white text-gray-800"
                >
                  {[5, 10, 20, 50].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div className="text-black dark:text-white font-medium">
                Page {Math.floor(first / rows) + 1} of {Math.ceil(totalCount / rows)}
              </div>
            </div>

            <div className="flex justify-between gap-2 text-sm w-full px-2">
              <button
                onClick={() => setFirst(0)}
                disabled={first === 0}
                className="px-3 py-1.5 rounded-md font-medium bg-gray-100 dark:bg-gray-800 text-black dark:text-white disabled:opacity-40"
              >
                ⏮ First
              </button>
              <button
                onClick={() => setFirst(Math.max(0, first - rows))}
                disabled={first === 0}
                className="px-3 py-1.5 rounded-md font-medium bg-gray-100 dark:bg-gray-800 text-black dark:text-white disabled:opacity-40"
              >
                Prev
              </button>
              <button
                onClick={() => setFirst(first + rows)}
                disabled={first + rows >= totalCount}
                className="px-3 py-1.5 rounded-md font-medium bg-gray-100 dark:bg-gray-800 text-black dark:text-white disabled:opacity-40"
              >
                Next
              </button>
              <button
                onClick={() => setFirst((Math.ceil(totalCount / rows) - 1) * rows)}
                disabled={first + rows >= totalCount}
                className="px-3 py-1.5 rounded-md font-medium bg-gray-100 dark:bg-gray-800 text-black dark:text-white disabled:opacity-40"
              >
                ⏭ Last
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default InventoryTable;
