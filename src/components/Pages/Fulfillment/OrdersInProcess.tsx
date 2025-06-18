import { useEffect, useState } from "react";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { Dialog } from "primereact/dialog";
import { motion } from "framer-motion";
import { axiosInstance } from "../../../axios";
import { formatDateTime } from "../../utils/kpiUtils";
import { useDateRangeEnterprise } from "../../utils/useGlobalFilters";
import { TableView, usePagination, TableColumn } from "../../modularity/tables/Table";

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

const statusColors = {
  "Order Placed": "bg-yellow-500",
  Processing: "bg-blue-500",
  "Ready for Pickup": "bg-blue-500",
  Completed: "bg-green-600",
  Unknown: "bg-gray-400",
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

const formatETA = (eta: string) => {
  if (!eta || eta === "Delivered" || eta === "Ready" || eta === "-")
    return eta;
  const date = new Date(eta);
  return isNaN(date.getTime()) ? eta : date.toISOString().slice(0, 10);
};

const OrdersInProcess = () => {
  const { page, rows, onPageChange } = usePagination();
  const [orders, setOrders] = useState<Order[]>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [visible, setVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderTimeline, setOrderTimeline] = useState<TimelineEvent[]>([]);
  const [timelineLoading, setTimelineLoading] = useState(false);
  const [timelineError, setTimelineError] = useState<string | null>(null);

  const { dateRange, enterpriseKey } = useDateRangeEnterprise();
  const [startDate, endDate] = dateRange || [];

  const columns: TableColumn[] = [
    { field: "order_id", header: "Order ID", mobilePriority: true },
    {
      field: "status",
      header: "Status",
      type: "tag",
      mobilePriority: true
    },
    {
      field: "action",
      header: "Action",
      customBody: (row) => (
        <Button
          label="View"
          icon="pi pi-eye"
          className="p-button-sm p-button-text"
          onClick={() => handleViewClick(row)}
        />
      )
    },
  ];

  const config = {
    columns,
    statusColors,
    mobileCardFields: ["order_id", "status", "event"],
  };

  const fetchOrders = async () => {
    if (!startDate || !endDate) return;
    setLoading(true);

    try {
      const params: any = {
        startDate: formatDateTime(startDate),
        endDate: formatDateTime(endDate),
        page: Math.floor(page / rows),
        size: rows,
      };
      if (enterpriseKey) {
        params.enterpriseKey = enterpriseKey;
      }

      const res = await axiosInstance.get<{ data: Order[]; count: number }>(
        "/fulfillment/orders-in-process",
        { params }
      );

      const { data, count } = res.data;
      setOrders(
        data.map((order: Order) => ({
          ...order,
          status: mapEventToStatus(order.event),
        }))
      );
      setTotalRecords(count);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      setError("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [startDate, endDate, enterpriseKey, page, rows]);

  const handleViewClick = async (order: Order) => {
    setSelectedOrder(order);
    setVisible(true);
    setTimelineLoading(true);
    setTimelineError(null);
    setOrderTimeline([]);

    try {
      const res = await axiosInstance.get<{ timeline: TimelineEvent[] }>(
        "/fulfillment/details",
        {
          params: { orderId: order.order_id },
        }
      );
      setOrderTimeline(res.data.timeline);
    } catch (err) {
      console.error("Failed to fetch order timeline:", err);
      setTimelineError("Failed to load order timeline");
    } finally {
      setTimelineLoading(false);
    }
  };

  const filteredOrders = orders.filter(
    (order) =>
      globalFilter === "" ||
      order.order_id.toString().includes(globalFilter.toLowerCase()) ||
      order.event.toLowerCase().includes(globalFilter.toLowerCase())
  );

  return (
    <div className="mt-6">
      <TableView
        data={filteredOrders}
        config={config}
        pagination={{
          page,
          rows,
          totalRecords,
          onPageChange,
        }}
        loading={loading}
        error={error}
        globalFilter={globalFilter}
        onGlobalFilterChange={setGlobalFilter}
        searchPlaceholder="Search Orders"
        title="Orders In Process"
      />

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
          <div className="md:w-1/3 text-sm space-y-4">
            <div>
              <span className="font-semibold">Order ID:</span>
              <span className="text-sm">{selectedOrder?.order_id} </span>
            </div>
            <div className="flex text-sm items-center gap-2">
              <span className="font-semibold">Status:</span>
              {selectedOrder && (
                <Tag
                  value={mapEventToStatus(selectedOrder.event)}
                  className={`text-white "text-sm" ${statusColors[mapEventToStatus(selectedOrder.event) as keyof typeof statusColors]}`}
                />
              )}
            </div>
            {selectedOrder && (
              <div className="mt-2">
                <span className="font-semibold">ETA: </span>
                <span className="text-sm"> {formatETA(selectedOrder.eta)}</span>
              </div>
            )}
          </div>

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
                            : statusColors[
                            mapEventToStatus(event.event_type) as keyof typeof statusColors
                            ] ?? statusColors.Unknown
                          }`}
                      />
                      <div className="ml-8">
                        <p className="mb-1 text-sm font-semibold">{event.event_type}</p>
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
  );
};

export default OrdersInProcess;