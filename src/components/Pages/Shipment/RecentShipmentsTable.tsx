"use client";

import React, { useEffect, useState } from "react";
import {
  DataTable,
  DataTableFilterEvent,
  DataTablePageEvent,
  DataTableSortEvent,
} from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { ProgressSpinner } from "primereact/progressspinner";
import { axiosInstance } from "../../../axios";
import { useDateRangeEnterprise } from "../../utils/useGlobalFilters";

// ✅ Mobile detection hook
const useIsMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < breakpoint);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [breakpoint]);
  return isMobile;
};

interface Shipment {
  shipment_id: string;
  customer_name: string;
  carrier: string;
  actual_shipment_date: string;
  shipment_status: string;
}

const RecentShipmentsTable: React.FC = () => {
  const [data, setData] = useState<Shipment[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<any>({
    global: { value: null, matchMode: "contains" },
    shipment_id: { value: null, matchMode: "contains" },
    customer_name: { value: null, matchMode: "contains" },
    carrier: { value: null, matchMode: "contains" },
    actual_shipment_date: { value: null, matchMode: "contains" },
    shipment_status: { value: null, matchMode: "contains" },
  });

  const [page, setPage] = useState(0);
  const [rows, setRows] = useState(10);
  const [sortField, setSortField] = useState("shipment_id");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const [visible, setVisible] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState<any>(null);

  const { dateRange, enterpriseKey } = useDateRangeEnterprise();
  const [startDate, endDate] = dateRange || [];

  const isMobile = useIsMobile();

  const fetchData = async () => {
    // Removed isReady check since it's not available
    const params: any = {
      startDate,
      endDate,
      page,
      size: rows,
      sortField,
      sortOrder,
    };

    if (enterpriseKey?.trim()) {
      params.enterpriseKey = enterpriseKey;
    }

    for (const key in filters) {
      const value = filters[key]?.value;
      const matchMode = filters[key]?.matchMode;
      if (value && matchMode && key !== "global") {
        params[`${key}.value`] = value;
        params[`${key}.matchMode`] = matchMode;
      }
    }

    setLoading(true);
    try {
      const response = await axiosInstance.get("/recent-shipments", { params });
      const { data: shipmentData, count } = response.data;
      setData(shipmentData || []);
      setTotalRecords(count || 0);
    } catch (err) {
      console.error("Error fetching recent shipments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [startDate, endDate, enterpriseKey, page, rows, sortField, sortOrder, filters]);

  const onPageChange = (e: DataTablePageEvent) => {
    setPage(e.page ?? 0);
    setRows(e.rows ?? 10);
  };

  const onSort = (e: DataTableSortEvent) => {
    const newSortField = e.sortField ?? "";
    const isSameField = newSortField === sortField;
    const newSortOrder = isSameField ? (sortOrder === "asc" ? "desc" : "asc") : "asc";
    setSortField(newSortField);
    setSortOrder(newSortOrder);
  };

  const onFilter = (e: DataTableFilterEvent) => {
    setFilters(e.filters);
  };


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

  const getStatusSeverity = (status: string) => {
    switch (status) {
      case "Delivered":
        return "success";
      case "In Transit":
        return "info";
      case "Delayed":
        return "danger";
      default:
        return null;
    }
  };

  const formatDate = (iso: string) => iso?.split("T")[0] ?? "";

  const showDetails = async (shipment: any) => {
    try {
      const response = await axiosInstance.get("/recent-shipments/details", {
        params: { shipmentId: shipment.shipment_id },
      });
      setSelectedShipment(response.data);
    } catch (err) {
      console.error("Error loading details:", err);
      setSelectedShipment(null);
    } finally {
      setVisible(true);
    }
  };

  const totalPages = Math.ceil(totalRecords / rows);

  return (
    <div className="card p-4">
      <h2 className="text-xl mb-3">Recent Shipments</h2>

      {loading ? (
        <div className="flex justify-center mt-5">
          <ProgressSpinner />
        </div>
      ) : isMobile ? (
        <>
          <div className="space-y-4">
            {data.map((shipment) => (
              <div
                key={shipment.shipment_id}
                className="border rounded-lg p-4 shadow-sm bg-white dark:bg-gray-900"
              >
                <div className="text-sm mb-1">
                  <strong>Shipment ID:</strong> {shipment.shipment_id}
                </div>
                <div className="text-sm mb-1">
                  <strong>Customer:</strong> {shipment.customer_name}
                </div>
                <div className="text-sm mb-1">
                  <strong>Carrier:</strong> {shipment.carrier}
                </div>
                <div className="text-sm mb-1">
                  <strong>Ship Date:</strong> {formatDate(shipment.actual_shipment_date)}
                </div>
                <div className="text-sm mb-2 flex items-center gap-2">
                  <strong>Status:</strong>
                  <Tag
                    value={shipment.shipment_status}
                    severity={getStatusSeverity(shipment.shipment_status)}
                  />
                </div>
                <button
                  className="text-purple-600 dark:text-purple-400 text-sm font-medium underline"
                  onClick={() => showDetails(shipment)}
                >
                  View Details
                </button>
              </div>
            ))}
          </div>

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
              Page {page + 1} of {totalPages}
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
                onClick={() => setPage(Math.min(page + 1, totalPages - 1))}
                disabled={page + 1 >= totalPages}
                className="flex-1 px-2 py-1 text-xs rounded-md font-medium bg-gray-100 dark:bg-gray-800 text-black dark:text-white disabled:opacity-40"
              >
                Next
              </button>
              <button
                onClick={() => setPage(totalPages - 1)}
                disabled={page + 1 >= totalPages}
                className="flex-1 px-2 py-1 text-xs rounded-md font-medium bg-gray-100 dark:bg-gray-800 text-black dark:text-white disabled:opacity-40"
              >
                Last
              </button>
            </div>
          </div>
        </>
      ) : (
        <DataTable
          value={data}
          paginator
          lazy
          rows={rows}
          first={page * rows}
          totalRecords={totalRecords}
          onPage={onPageChange}
          rowsPerPageOptions={[10, 20, 50, 100]}
          sortMode="single"
          sortField={sortField}
          sortOrder={sortOrder === "asc" ? 1 : -1}
          onSort={onSort}
          onFilter={onFilter}
          filters={filters}
          globalFilterFields={[
            "shipment_id",
            "customer_name",
            "carrier",
            "actual_shipment_date",
            "shipment_status",
          ]}
          responsiveLayout="scroll"
          emptyMessage="No shipments found"
        >
          <Column
            field="shipment_id"
            header="Shipment ID"
            sortable
            filter
            filterField="shipment_id"
            filterElement={renderFilterInput()}
          />
          <Column
            field="customer_name"
            header="Customer"
            sortable
            filter
            filterField="customer_name"
            filterElement={renderFilterInput()}
          />
          <Column
            field="carrier"
            header="Carrier"
            sortable
            filter
            filterField="carrier"
            filterElement={renderFilterInput()}
          />
          <Column
            field="actual_shipment_date"
            header="Ship Date"
            sortable
            filter
            filterField="actual_shipment_date"
            body={(rowData: Shipment) => formatDate(rowData.actual_shipment_date)}
            filterElement={renderFilterInput()}
          />
          <Column
            field="shipment_status"
            header="Status"
            sortable
            filter
            filterField="shipment_status"
            body={(rowData: Shipment) => (
              <Tag
                value={rowData.shipment_status}
                severity={getStatusSeverity(rowData.shipment_status)}
              />
            )}
            filterElement={renderFilterInput()}
          />
          <Column
            header="Action"
            body={(rowData: Shipment) => (
              <button
                className="text-purple-500 text-sm"
                onClick={() => showDetails(rowData)}
              >
                View
              </button>
            )}
          />
        </DataTable>
      )}

      <Dialog
        header="Shipment Details"
        visible={visible}
        onHide={() => setVisible(false)}
        style={{ width: "90vw", maxWidth: "600px" }}
        dismissableMask
        draggable={false}
      >
        {selectedShipment ? (
          <div className="text-sm space-y-2">
            <div>
              <strong>Order ID:</strong> {selectedShipment.order_id}
            </div>
            <div>
              <strong>Customer:</strong> {selectedShipment.customer}
            </div>
            <div>
              <strong>Carrier:</strong> {selectedShipment.carrier}
            </div>
            <div>
              <strong>Status:</strong> {selectedShipment.status}
            </div>
            <div>
              <strong>Ship Date:</strong> {formatDate(selectedShipment.ship_date)}
            </div>
            <div>
              <strong>Estimated Delivery:</strong> {formatDate(selectedShipment.estimated_delivery)}
            </div>
            <div>
              <strong>Origin:</strong> {selectedShipment.origin}
            </div>
            <div>
              <strong>Destination:</strong> {selectedShipment.destination}
            </div>
            <div>
              <strong>Cost:</strong> ${selectedShipment.cost}
            </div>
          </div>
        ) : (
          <p>No data found</p>
        )}
      </Dialog>
    </div>
  );
};

export default RecentShipmentsTable;
