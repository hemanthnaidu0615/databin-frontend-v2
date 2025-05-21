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

// Mobile detection hook
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768); // md = 768px
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
  const [filteredItems, setFilteredItems] = useState<InventoryItem[]>([]);
  const [productSearch, setProductSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(5);

  const isMobile = useIsMobile();

  const statusColors = {
    Available: "text-green-500",
    "Out of Stock": "text-red-500",
    "Low Stock": "text-yellow-500",
  };

  const dateRange = useSelector((state: any) => state.dateRange.dates);
  const [startDate, endDate] = dateRange || [];

  useEffect(() => {
    const fetchData = async () => {
      if (!startDate || !endDate) {
        console.warn("Start and end date are required.");
        return;
      }

      const formattedStart = formatDate(new Date(startDate));
      const formattedEnd = formatDate(new Date(endDate));

      const params = new URLSearchParams({
        startDate: formattedStart,
        endDate: formattedEnd,
      });



      try {
        const response = await axiosInstance.get(
          "/inventory/widget-data", // We only need the path, since the base URL is set in axiosInstance
          { params }
        );

        const data = response.data as { data?: any[] };
        const apiData = data.data || [];

        const mappedData: InventoryItem[] = apiData.map((item: any) => ({
          name: item.product_name,
          category: item.category_name,
          warehouse: item.warehouse_name,
          source: item.warehouse_function,
          states: item.warehouse_state,
          status: item.inventory_status,
        }));

        setInventoryItems(mappedData);
      } catch (error) {
        console.error("Failed to fetch inventory data:", error);
      }
    };

    fetchData();
  }, [startDate, endDate]);

  useEffect(() => {
    const applyFilters = () => {
      let data = [...inventoryItems];

      if (filters.selectedRegion) {
        data = data.filter(
          (item) =>
            item.warehouse.toLowerCase() ===
            filters.selectedRegion.toLowerCase()
        );
      }

      if (filters.selectedSource) {
        data = data.filter(
          (item) =>
            item.source.toLowerCase() === filters.selectedSource.toLowerCase()
        );
      }

      if (filters.selectedLocation) {
        data = data.filter((item) =>
          item.states
            .toLowerCase()
            .includes(filters.selectedLocation.toLowerCase())
        );
      }

      if (selectedStatus) {
        data = data.filter((item) => item.status === selectedStatus);
      }

      if (selectedCategory) {
        data = data.filter((item) => item.category === selectedCategory);
      }

      if (productSearch) {
        data = data.filter((item) =>
          item.name.toLowerCase().includes(productSearch.toLowerCase())
        );
      }

      setFilteredItems(data);
    };

    applyFilters();
  }, [
    inventoryItems,
    filters,
    selectedStatus,
    selectedCategory,
    productSearch,
  ]);

  // Insert this helper inside the InventoryTable component
  const getPageOptions = () => {
    const total = filteredItems.length;
    if (total <= 5) return [5];
    if (total <= 10) return [5, 10];
    if (total <= 20) return [5, 10, 15, 20];
    if (total <= 50) return [10, 20, 30, 50];
    return [10, 20, 50, 100];
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          Inventory List
        </h3>
        <div className="flex gap-2 flex-wrap items-center">
          <input
            type="text"
            placeholder="Search Product"
            className="px-2 py-1 text-sm border rounded-md bg-white text-black border-gray-300 dark:bg-gray-700 dark:text-white dark:border-gray-600"
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
            {Array.from(
              new Set(inventoryItems.map((item) => item.category))
            ).map((cat, i) => (
              <option key={i} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-hidden">
        <table className="hidden md:table min-w-full text-sm text-left">
          <thead className="text-gray-500 dark:text-gray-400 border-b dark:border-gray-700">
            <tr>
              <th className="py-2 px-1">Product Name</th>
              <th className="py-2 px-1">Category</th>
              <th className="py-2 px-1">Warehouse</th>
              <th className="py-2 px-1">Source</th>
              <th className="py-2 px-1">State</th>
              <th className="py-2 px-1">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.slice(first, first + rows).map((item, idx) => (
              <tr key={idx} className="border-t dark:border-gray-700">
                <td className="py-2 px-1">{item.name}</td>
                <td className="py-2 px-1">{item.category}</td>
                <td className="py-2 px-1">{item.warehouse}</td>
                <td className="py-2 px-1">{item.source}</td>
                <td className="py-2 px-1">{item.states}</td>
                <td
                  className={`py-2 px-1 font-medium ${statusColors[item.status as keyof typeof statusColors]
                    }`}
                >
                  {item.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 bg-white dark:bg-gray-900 rounded-b-lg">
        {/* Desktop Paginator */}
        {!isMobile && (
          <div className="flex justify-center dark:text-gray-100">
            <Paginator
              first={first}
              rows={rows}
              totalRecords={filteredItems.length}
              onPageChange={(e) => {
                setFirst(e.first);
                setRows(e.rows);
              }}
              template="RowsPerPageDropdown CurrentPageReport PrevPageLink PageLinks NextPageLink"
              currentPageReportTemplate="Showing {first} to {last} of {totalRecords} items"
              rowsPerPageOptions={[5, 10, 20]}
              className="w-full text-sm dark:text-white"
            />
          </div>
        )}

        {/* Mobile-Only Custom Pagination */}
        {isMobile && (
          <div className="flex flex-col sm:hidden text-sm text-gray-700 dark:text-gray-100 mt-4">
            {/* Top Row: Dropdown & Page Info */}
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
                  {getPageOptions().map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div className="text-black dark:text-white font-medium">
                Page {Math.floor(first / rows) + 1} of{" "}
                {Math.ceil(filteredItems.length / rows)}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between gap-2 text-sm w-full px-2">
              <button
                onClick={() => setFirst(0)}
                disabled={first === 0}
                className="px-3 py-1.5 rounded-md font-medium bg-gray-100 dark:bg-gray-800 text-black dark:text-white disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                ⏮ First
              </button>

              <button
                onClick={() => setFirst(Math.max(0, first - rows))}
                disabled={first === 0}
                className="px-3 py-1.5 rounded-md font-medium bg-gray-100 dark:bg-gray-800 text-black dark:text-white disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                Prev
              </button>

              <button
                onClick={() =>
                  setFirst(
                    first + rows < filteredItems.length ? first + rows : first
                  )
                }
                disabled={first + rows >= filteredItems.length}
                className="px-3 py-1.5 rounded-md font-medium bg-gray-100 dark:bg-gray-800 text-black dark:text-white disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                Next
              </button>

              <button
                onClick={() =>
                  setFirst((Math.ceil(filteredItems.length / rows) - 1) * rows)
                }
                disabled={first + rows >= filteredItems.length}
                className="px-3 py-1.5 rounded-md font-medium bg-gray-100 dark:bg-gray-800 text-black dark:text-white disabled:opacity-40 disabled:cursor-not-allowed transition"
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
