import React, { useState, useEffect } from "react";
import { Paginator } from "primereact/paginator";
import "primereact/resources/themes/lara-dark-indigo/theme.css";
import "primereact/resources/primereact.min.css";

interface Filters {
  selectedRegion: string;
  selectedSource: string;
  selectedLocation: string;
}

interface InventoryTableProps {
  filters: Filters;
}

const InventoryTable: React.FC<InventoryTableProps> = ({ filters }) => {
  const [inventoryItems, setInventoryItems] = useState<
    {
      name: string;
      sku: string;
      category: string;
      stock: number;
      warehouse: string;
      status: string;
      updated: string;
      source: string;
      states: string;
    }[]
  >([]);

  const [productSearch, setProductSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(5);

  const fullInventory = [
    {
      name: "Product A",
      sku: "SKU001",
      category: "Electronics",
      stock: 120,
      warehouse: "North",
      status: "In Stock",
      updated: "2025-04-30",
      source: "Factory",
      states: "California",
    },
    {
      name: "Product B",
      sku: "SKU002",
      category: "Furniture",
      stock: 10,
      warehouse: "East",
      status: "Low Stock",
      updated: "2025-04-28",
      source: "Distributor",
      states: "Texas",
    },
    {
      name: "Product C",
      sku: "SKU003",
      category: "Electronics",
      stock: 0,
      warehouse: "South",
      status: "Out of Stock",
      updated: "2025-04-25",
      source: "Factory",
      states: "Nevada",
    },
    {
      name: "Product D",
      sku: "SKU004",
      category: "Appliances",
      stock: 45,
      warehouse: "West",
      status: "In Stock",
      updated: "2025-04-29",
      source: "Manufacturer",
      states: "Arizona",
    },
    {
      name: "Product E",
      sku: "SKU005",
      category: "Furniture",
      stock: 5,
      warehouse: "North",
      status: "Low Stock",
      updated: "2025-04-30",
      source: "Distributor",
      states: "Florida",
    },
    {
      name: "Product F",
      sku: "SKU006",
      category: "Clothing",
      stock: 0,
      warehouse: "East",
      status: "Out of Stock",
      updated: "2025-04-27",
      source: "Factory",
      states: "New York",
    },
    {
      name: "Product G",
      sku: "SKU007",
      category: "Electronics",
      stock: 250,
      warehouse: "South",
      status: "In Stock",
      updated: "2025-04-30",
      source: "Factory",
      states: "Illinois",
    },
    {
      name: "Product H",
      sku: "SKU008",
      category: "Books",
      stock: 15,
      warehouse: "West",
      status: "Low Stock",
      updated: "2025-04-29",
      source: "Publisher",
      states: "Washington",
    },
  ];

  const statusColors = {
    "In Stock": "text-green-500",
    "Low Stock": "text-yellow-500",
    "Out of Stock": "text-red-500",
  };

  const categoryOptions = Array.from(
    new Set(fullInventory.map((item) => item.category))
  ).map((cat) => ({
    label: cat,
    value: cat,
  }));

  const statusOptions = ["In Stock", "Low Stock", "Out of Stock"].map(
    (status) => ({
      label: status,
      value: status,
    })
  );

  useEffect(() => {
    const filtered = fullInventory.filter(
      (item) =>
        item.name.toLowerCase().includes(productSearch.toLowerCase()) &&
        (!filters.selectedRegion ||
          item.warehouse === filters.selectedRegion) &&
        (!filters.selectedSource || item.source === filters.selectedSource) &&
        (!filters.selectedLocation ||
          item.states.includes(filters.selectedLocation)) &&
        (!selectedStatus || item.status === selectedStatus) &&
        (!selectedCategory || item.category === selectedCategory)
    );

    const paginated = filtered.slice(first, first + rows);
    setInventoryItems(paginated);
  }, [productSearch, selectedStatus, selectedCategory, first, rows, filters]);

  const totalRecords = fullInventory.filter(
    (item) =>
      item.name.toLowerCase().includes(productSearch.toLowerCase()) &&
      (!filters.selectedRegion || item.warehouse === filters.selectedRegion) &&
      (!filters.selectedSource || item.source === filters.selectedSource) &&
      (!filters.selectedLocation ||
        item.states.includes(filters.selectedLocation)) &&
      (!selectedStatus || item.status === selectedStatus) &&
      (!selectedCategory || item.category === selectedCategory)
  ).length;

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
      {/* Filters */}
      <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          Inventory List
        </h3>
        <div className="flex gap-2 flex-wrap items-center">
          <input
            type="text"
            placeholder="Search Product"
            className="px-2 py-1 text-sm border dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 dark:text-white"
            value={productSearch}
            onChange={(e) => setProductSearch(e.target.value)}
          />

          {/* Status Select */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-white">Status</span>
            <select
              className="w-36 px-3 py-1 rounded-md text-sm bg-gray-800 text-white border border-white/30"
              value={selectedStatus || ""}
              onChange={(e) => {
                setSelectedStatus(e.target.value || null);
                setFirst(0);
              }}
            >
              <option value="">Select</option>
              {statusOptions.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>

          {/* Category Select */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-white">Category</span>
            <select
              className="w-36 px-3 py-1 rounded-md text-sm bg-gray-800 text-white border border-white/30"
              value={selectedCategory || ""}
              onChange={(e) => {
                setSelectedCategory(e.target.value || null);
                setFirst(0);
              }}
            >
              <option value="">Select</option>
              {categoryOptions.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table View */}
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
              <th className="py-2 px-1">Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {inventoryItems.map((item, idx) => (
              <tr key={idx} className="border-t dark:border-gray-700">
                <td className="py-2 px-1">{item.name}</td>
                <td className="py-2 px-1">{item.category}</td>
                <td className="py-2 px-1">{item.warehouse}</td>
                <td className="py-2 px-1">{item.source}</td>
                <td className="py-2 px-1">{item.states}</td>
                <td
                  className={`py-2 px-1 font-medium ${
                    statusColors[item.status as keyof typeof statusColors]
                  }`}
                >
                  {item.status}
                </td>
                <td className="py-2 px-1">{item.updated}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {inventoryItems.map((item, idx) => (
          <div key={idx} className="border rounded-lg p-6 dark:border-gray-700">
            <div className="text-sm font-semibold mb-1 text-gray-700 dark:text-gray-200">
              {item.name}
            </div>
            <div className="grid grid-cols-2 text-xs gap-y-1 text-gray-700 dark:text-gray-300">
              <div>
                <strong>Category:</strong> {item.category}
              </div>
              <div>
                <strong>Warehouse:</strong> {item.warehouse}
              </div>
              <div>
                <strong>Source:</strong> {item.source}
              </div>
              <div>
                <strong>States:</strong> {item.states}
              </div>
              <div>
                <strong>Status:</strong>{" "}
                <span
                  className={
                    statusColors[item.status as keyof typeof statusColors]
                  }
                >
                  {item.status}
                </span>
              </div>
              <div>
                <strong>Updated:</strong> {item.updated}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {/* Desktop Pagination (sm and up) */}
      <div className="hidden sm:block p-4 bg-white dark:bg-gray-900 rounded-b-lg">
        <div className="flex justify-center dark:text-gray-100">
          <Paginator
            first={first}
            rows={rows}
            totalRecords={totalRecords}
            onPageChange={(e) => {
              setFirst(e.first);
              setRows(e.rows);
            }}
            template="RowsPerPageDropdown CurrentPageReport PrevPageLink PageLinks NextPageLink"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} orders"
            rowsPerPageOptions={[5, 10, 20]}
            className="w-full text-sm dark:text-white [&_.p-paginator-current]:text-sm [&_.p-dropdown]:py-1 [&_.p-paginator-pages]:gap-1 [&_.p-paginator-page]:!px-2 !rounded-md [&_.p-highlight]:bg-blue-600 [&_.p-highlight]:text-white"          />
        </div>
      </div>

      {/* Custom Mobile Pagination (below sm) */}
      <div className="sm:hidden mt-6 flex flex-col sm:flex-row items-center justify-between px-4 py-2 bg-white dark:bg-gray-900 rounded-b-lg text-sm text-gray-800 dark:text-gray-100">
        {/* Rows per page dropdown */}
        <div className="flex items-center gap-2">
          <label htmlFor="mobileRows" className="whitespace-nowrap">
            Rows per page:
          </label>
          <select
            id="mobileRows"
            value={rows}
            onChange={(e) => {
              setRows(Number(e.target.value));
              setFirst(0); // reset to first page
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

        {/* Pagination controls */}
        <div className="flex w-full sm:w-auto justify-between items-center">
          {/* Left - Prev */}
          <button
            onClick={() => setFirst(Math.max(0, first - rows))}
            disabled={first === 0}
            className="px-3 py-1 rounded-md bg-gray-700 text-white disabled:opacity-50"
          >
            Prev
          </button>

          {/* Center - Page Info */}
          <div className="text-center flex-1 text-sm">
            Page {Math.floor(first / rows) + 1} of{" "}
            {Math.ceil(totalRecords / rows)}
          </div>

          {/* Right - Next */}
          <button
            onClick={() =>
              setFirst(first + rows < totalRecords ? first + rows : first)
            }
            disabled={first + rows >= totalRecords}
            className="px-3 py-1 rounded-md bg-gray-700 text-white disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default InventoryTable;
