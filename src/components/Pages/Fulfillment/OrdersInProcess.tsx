"use client";

import { useState } from "react";
import { Tag } from "primereact/tag";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { motion } from "framer-motion";
import { BaseDataTable, TableColumn } from "../../modularity/tables/BaseDataTable";
import { axiosInstance } from "../../../axios";
import { formatDateTime } from "../../utils/kpiUtils";
import { useDateRangeEnterprise } from "../../utils/useGlobalFilters";
import * as XLSX from "xlsx";

interface Order {
  order_id: number;
  customer?: string;
  status: string;
  event: string;
  eta: string;
}

interface TimelineEvent {
  event: string;
  event_type: string;
  eta: string;
}

const statusColors: Record<string, string> = {
  "Order Placed": "bg-yellow-500",
  Processing: "bg-blue-500",
  "Ready for Pickup": "bg-blue-500",
  Completed: "bg-green-600",
  Unknown: "bg-gray-400",
  Shipped: "bg-purple-600",
  Cancelled: "bg-red-600",
  Returned: "bg-orange-600",
};

const getStatusColor = (status: string) => {
  return statusColors[status] || "bg-gray-400";
};

const mapEventToStatus = (event: string): string => {
  switch (event) {
    case "Order Placed":
      return "Order Placed";
    case "Processing":
    case "Store Pickup":
    case "Ship to Home":
    case "Distribution Center":
    case "Warehouse":
    case "Vendor Drop Shipping":
    case "Same-Day Delivery":
    case "Locker Pickup":
    case "Curbside Pickup":
      return "Processing";
    case "Shipped":
      return "Shipped";
    case "Cancelled":
      return "Cancelled";
    case "Return Received":
      return "Returned";
    default:
      return "Unknown";
  }
};

const OrdersInProcess = () => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderTimeline, setOrderTimeline] = useState<TimelineEvent[]>([]);
  const [timelineLoading, setTimelineLoading] = useState(false);
  const [timelineError, setTimelineError] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const { dateRange, enterpriseKey } = useDateRangeEnterprise();
  const [startDate, endDate] = dateRange || [];
const exportToXLSX = (data: any[]) => {
  const renamedData = data.map(item => ({
    "Order ID": item.order_id,
    "Status": mapEventToStatus(item.event),
    "Event": item.event,
    "ETA": item.eta,
  }));
  const worksheet = XLSX.utils.json_to_sheet(renamedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Orders In Process");
  XLSX.writeFile(workbook, "orders_in_process_export.xlsx");
};

const exportData = async () => {
  try {
    if (!startDate || !endDate) {
      alert('Date range not available. Please select a date range.');
      return;
    }

    const params = {
      startDate: formatDateTime(startDate),
      endDate: formatDateTime(endDate),
      enterpriseKey: enterpriseKey && enterpriseKey !== "All" ? enterpriseKey : undefined,
      size: '100000',
    };

    const response = await axiosInstance.get("/fulfillment/orders-in-process", { params });
    const dataToExport = response.data.data || [];
    exportToXLSX(dataToExport);
  } catch (err) {
    console.error("Export failed:", err);
    alert("Failed to export data.");
  }
};


  const formatETA = (eta: string) => {
    if (!eta || eta === "Delivered" || eta === "Ready" || eta === "-") return eta;
    const date = new Date(eta);
    return isNaN(date.getTime()) ? eta : date.toISOString().slice(0, 10);
  };

  const fetchData = async (params: any) => {
    if (!startDate || !endDate) return { data: [], count: 0 };

    const queryParams = {
      startDate: formatDateTime(startDate),
      endDate: formatDateTime(endDate),
      enterpriseKey: enterpriseKey || undefined,
      ...params,
    };

    try {
      const response = await axiosInstance.get("/fulfillment/orders-in-process", {
        params: queryParams,
      });
      const { data, count } = response.data as { data: Order[]; count: number };
      return {
        data: data.map((order) => ({
          ...order,
          status: mapEventToStatus(order.event),
        })),
        count,
      };
    } catch (error) {
      console.error(error);
      return { data: [], count: 0 };
    }
  };

  const handleViewClick = async (order: Order) => {
    setSelectedOrder(order);
    setVisible(true);
    setTimelineLoading(true);
    setTimelineError(null);
    setOrderTimeline([]);

    try {
      const response = await axiosInstance.get<{ timeline: TimelineEvent[] }>(
        "/fulfillment/details",
        { params: { orderId: order.order_id } }
      );
      setOrderTimeline(response.data.timeline);
    } catch (error) {
      setTimelineError("Failed to load order timeline");
    } finally {
      setTimelineLoading(false);
    }
  };

  const renderMobileCard = (item: Order, index: number) => (
    <div
      key={index}
      className="p-4 mb-4 rounded-lg shadow-md bg-white dark:bg-gray-800"
    >
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-semibold">Order ID: {item.order_id}</h3>
        <Tag
          value={mapEventToStatus(item.event)}
          className={`text-xs text-white ${getStatusColor(mapEventToStatus(item.event))}`}
        />
      </div>
      <div className="flex justify-between items-center mt-1">
        <p className="text-xs">Event: {item.event}</p>
        <Button
          icon="pi pi-eye"
          className="p-button-sm p-button-text"
          onClick={() => handleViewClick(item)}
        />
      </div>
    </div>
  );

  const columns: TableColumn<Order>[] = [
    {
      field: "order_id",
      header: "Order ID",
      sortable: true,
      filter: true,
    },
    {
      field: "status",
      header: "Status",
      sortable: true,
      filter: true,
      body: (rowData: Order) => (
        <Tag
          className={`${getStatusColor(rowData.status)} text-white px-3 py-1 rounded-lg`}
          value={rowData.status}
        />
      ),
    },
    {
      field: "order_id", // Reusing field for action column
      header: "Actions",
      body: (rowData: Order) => (
        <Button
          label="View"
          icon="pi pi-eye"
          className="p-button-sm p-button-text"
          onClick={() => handleViewClick(rowData)}
        />
      ),
      sortable: false,
      filter: false,
    },
  ];

  return (
    <div className="mt-6">
      <div className="border rounded-xl shadow-sm p-4 overflow-x-auto bg-white dark:bg-gray-900">
        <div className="flex justify-between items-center mb-4">
          <h2 className="app-subheading">Orders In Process</h2>
          <button
            className="px-4 py-2 text-sm border rounded-md dark:border-white/20 dark:hover:bg-white/10 dark:text-white/90"
            onClick={exportData}
          >
            Export
          </button>
        </div>
        <BaseDataTable<Order>
          columns={columns}
          fetchData={fetchData}
          mobileCardRender={renderMobileCard}
          initialSortField="order_id"
          initialRows={10}
          rowsPerPageOptions={[5, 10, 20, 50, 100]}
          globalFilterFields={["order_id", "status", "event", "eta"]} field={"order_id"} header={""}        />

        {/* Details Dialog */}
        <Dialog
          header={`Order Details`}
          visible={visible}
          onHide={() => setVisible(false)}
          style={{ width: "40rem" }}
          modal
          draggable={false}
          dismissableMask={true}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col md:flex-row gap-6"
          >
            {/* Order Info */}
            <div className="md:w-1/3 text-sm space-y-4">
              <div>
                <span className="font-semibold">Order ID:</span>{" "}
                <span className="text-sm">{selectedOrder?.order_id}</span>
              </div>
              <div className="flex text-sm items-center gap-2">
                <span className="font-semibold">Status:</span>
                {selectedOrder && (
                  <Tag
                    value={mapEventToStatus(selectedOrder.event)}
                    className={`text-white text-sm ${getStatusColor(mapEventToStatus(selectedOrder.event))}`}
                  />
                )}
              </div>
              {selectedOrder && (
                <div className="mt-2">
                  <span className="font-semibold">ETA:</span>{" "}
                  <span className="text-sm">{formatETA(selectedOrder.eta)}</span>
                </div>
              )}
            </div>

            {/* Timeline */}
            <div className="md:flex-1 text-sm">
              <h3 className="font-semibold mb-4">Timeline</h3>

              {timelineLoading && <p>Loading timeline...</p>}
              {timelineError && <p className="text-red-500">{timelineError}</p>}
              {!timelineLoading && !timelineError && orderTimeline.length === 0 && (
                <p>No timeline data available.</p>
              )}

              {!timelineLoading && !timelineError && orderTimeline.length > 0 && (
                <ol className="relative ml-6 before:absolute before:top-[8px] before:bottom-[30px] before:left-[1rem] before:w-px before:bg-gray-500 dark:before:bg-gray-600">
                  {orderTimeline.map((event, index) => {
                    const isLast = index === orderTimeline.length - 1;
                    return (
                      <li key={event.event} className="mb-6 relative">
                        <span
                          className={`absolute left-2 top-1.5 flex h-4 w-4 items-center justify-center rounded-full ring-2 ring-transparent dark:ring-gray-900 ${isLast
                              ? "bg-green-600"
                              : getStatusColor(mapEventToStatus(event.event_type))
                            }`}
                        />
                        <div className="ml-8">
                          <p className="mb-1 text-sm font-semibold">
                            {event.event_type}
                          </p>
                          <p className="text-xs">ETA: {formatETA(event.eta)}</p>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              )}
            </div>
          </motion.div>
        </Dialog>
      </div>
    </div>
  );
};

export default OrdersInProcess;