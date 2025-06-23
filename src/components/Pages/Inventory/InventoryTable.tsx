"use client";

import React, { useEffect, useState } from "react";
import {
  DataTable,
  DataTablePageEvent,
  DataTableSortEvent,
  DataTableFilterEvent,
} from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { ProgressSpinner } from "primereact/progressspinner";
import { useSelector } from "react-redux";
import { axiosInstance } from "../../../axios";

import "primereact/resources/themes/lara-dark-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

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

const statusColors: Record<string, string> = {
  Available: "text-green-500",
  "Out of Stock": "text-red-500",
  "Low Stock": "text-yellow-500",
};

const InventoryTable: React.FC<InventoryTableProps> = ({ filters }) => {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  const [filtersState, setFiltersState] = useState<any>({
    global: { value: null, matchMode: "contains" },
    name: { value: null, matchMode: "contains" },
    category: { value: null, matchMode: "contains" },
    warehouse: { value: null, matchMode: "contains" },
    source: { value: null, matchMode: "contains" },
    states: { value: null, matchMode: "contains" },
    status: { value: null, matchMode: "contains" },
  });

  const [page, setPage] = useState<number>(0);
  const [rows, setRows] = useState<number>(10);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [sortField, setSortField] = useState<string>("name");
  const [sortOrder, setSortOrder] = useState<1 | -1>(1);

  const dateRange = useSelector((state: any) => state.dateRange.dates);
  const [startDate, endDate] = dateRange || [];

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const formatDate = (date: Date): string =>
    `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;

  const fetchData = async () => {
    if (!startDate || !endDate) return;
    setLoading(true);

    try {
      const params = new URLSearchParams();

      params.append("startDate", formatDate(new Date(startDate)));
      params.append("endDate", formatDate(new Date(endDate)));
      params.append("page", page.toString());
      params.append("size", rows.toString());

      if (sortField) {
        params.append("sortField", sortField);
        params.append("sortOrder", sortOrder === 1 ? "asc" : "desc");
      }

      if (filters.selectedRegion) params.append("regionFilter", filters.selectedRegion);
      if (filters.selectedSource) params.append("sourceFilter", filters.selectedSource);
      if (filters.selectedLocation) params.append("locationFilter", filters.selectedLocation);

      for (const key in filtersState) {
        const value = filtersState[key]?.value;
        if (value && key !== "global") {
          params.append(`${key}Filter`, value);
        }
      }

      const response = await axiosInstance.get(`/inventory/widget-data?${params}`);
      const resData = response.data;

      setInventoryItems(
        (resData.data || []).map((item: any) => ({
          name: item.product_name,
          category: item.category_name,
          warehouse: item.warehouse_name,
          source: item.warehouse_function,
          states: item.warehouse_state,
          status: item.inventory_status,
        }))
      );
      setTotalRecords(resData.count || 0);
    } catch (error) {
      console.error("Error fetching inventory data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate, page, rows, sortField, sortOrder, filters, filtersState]);

  const onPageChange = (e: DataTablePageEvent) => {
    setPage(e.page ?? 0);
    setRows(e.rows ?? 10);
  };

  const onSort = (e: DataTableSortEvent) => {
    setSortField(e.sortField ?? "name");
    setSortOrder(e.sortOrder === -1 ? -1 : 1);
  };

  const onFilter = (e: DataTableFilterEvent) => {
    setFiltersState(e.filters);
    setPage(0);
  };

  const renderStatus = (status: string) => (
    <span className={statusColors[status] ?? ""}>{status}</span>
  );

  const renderFilterInput = (placeholder = "Search") => {
    return (options: any) => (
      <InputText
        value={options.value || ""}
        onChange={(e) => options.filterCallback(e.target.value)}
        placeholder={placeholder}
        className="p-column-filter"
      />
    );
  };

  const renderMobileCard = (item: InventoryItem, index: number) => (
    <div
      key={index}
      className="bg-white dark:bg-gray-900 border rounded-lg shadow p-4 mb-3"
    >
      <div className="font-semibold text-lg mb-2">{item.name}</div>
      <div className="text-sm text-gray-600 dark:text-gray-300">
        <p>
          <strong>Category:</strong> {item.category}
        </p>
        <p>
          <strong>Warehouse:</strong> {item.warehouse}
        </p>
        <p>
          <strong>Source:</strong> {item.source}
        </p>
        <p>
          <strong>State:</strong> {item.states}
        </p>
        <p>
          <strong>Status:</strong> {renderStatus(item.status)}
        </p>
      </div>
    </div>
  );

  return (
    <div className="card p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md">
      <h3 className="app-section-title mb-4">Inventory List</h3>

      {loading ? (
        <div className="flex justify-center mt-5">
          <ProgressSpinner />
        </div>
      ) : isMobile ? (
        <>
          <div>{inventoryItems.map(renderMobileCard)}</div>

          {/* MOBILE PAGINATION UI */}
          <div className="flex flex-col text-sm text-gray-700 dark:text-gray-100 mt-4">
            {/* Rows per page selector */}
            <div className="flex flex-col gap-2 mb-2 w-full">
              <label htmlFor="mobileRows" className="whitespace-nowrap">
                Rows per page:
              </label>
              <select
                id="mobileRows"
                value={rows}
                onChange={(e) => {
                  setRows(Number(e.target.value));
                  setPage(0);
                }}
                className="px-2 py-1 rounded dark:bg-gray-800 bg-gray-100 dark:text-white text-gray-800 w-full border"
              >
                {[5, 10, 20, 50].map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            {/* Page info */}
            <div className="text-black dark:text-white font-medium">
              Page {page + 1} of {Math.ceil(totalRecords / rows)}
            </div>

            {/* Pagination buttons */}
            <div className="flex flex-wrap justify-between gap-2 w-full mt-2">
              <button
                onClick={() => setPage(0)}
                disabled={page === 0}
                className="flex-1 px-2 py-1 text-xs rounded-md font-medium bg-gray-100 dark:bg-gray-800 text-black dark:text-white disabled:opacity-40"
              >
                ⏮ First
              </button>
              <button
                onClick={() => setPage(Math.max(0, page - 1))}
                disabled={page === 0}
                className="flex-1 px-2 py-1 text-xs rounded-md font-medium bg-gray-100 dark:bg-gray-800 text-black dark:text-white disabled:opacity-40"
              >
                Prev
              </button>
              <button
                onClick={() =>
                  setPage(Math.min(page + 1, Math.ceil(totalRecords / rows) - 1))
                }
                disabled={page + 1 >= Math.ceil(totalRecords / rows)}
                className="flex-1 px-2 py-1 text-xs rounded-md font-medium bg-gray-100 dark:bg-gray-800 text-black dark:text-white disabled:opacity-40"
              >
                Next
              </button>
              <button
                onClick={() => setPage(Math.ceil(totalRecords / rows) - 1)}
                disabled={page + 1 >= Math.ceil(totalRecords / rows)}
                className="flex-1 px-2 py-1 text-xs rounded-md font-medium bg-gray-100 dark:bg-gray-800 text-black dark:text-white disabled:opacity-40"
              >
                ⏭ Last
              </button>
            </div>
          </div>
        </>
      ) : (
        <DataTable
          value={inventoryItems}
          lazy
          paginator
          first={page * rows}
          rows={rows}
          totalRecords={totalRecords}
          onPage={onPageChange}
          rowsPerPageOptions={[10, 20, 50]}
          sortMode="single"
          sortField={sortField}
          sortOrder={sortOrder}
          onSort={onSort}
          onFilter={onFilter}
          filters={filtersState}
          globalFilterFields={["name", "category", "warehouse", "source", "states", "status"]}
          emptyMessage="No inventory items found"
          responsiveLayout="scroll"
        >
          <Column
            field="name"
            header="Product Name"
            sortable
            filter
            filterElement={renderFilterInput()}
          />
          <Column
            field="category"
            header="Category"
            sortable
            filter
            filterElement={renderFilterInput()}
          />
          <Column
            field="warehouse"
            header="Warehouse"
            sortable
            filter
            filterElement={renderFilterInput()}
          />
          <Column
            field="source"
            header="Source"
            sortable
            filter
            filterElement={renderFilterInput()}
          />
          <Column
            field="states"
            header="State"
            sortable
            filter
            filterElement={renderFilterInput()}
          />
          <Column
            field="status"
            header="Status"
            sortable
            filter
            body={(rowData) => renderStatus(rowData.status)}
            filterElement={renderFilterInput()}
          />
        </DataTable>
      )}
    </div>
  );
};

export default InventoryTable;
