import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { DataTable, DataTablePageEvent, DataTableSortEvent, DataTableFilterEvent } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { Dialog } from "primereact/dialog";
import { motion } from "framer-motion";
import { axiosInstance } from "../../../axios";

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
  const [orders, setOrders] = useState<Order[]>([]);
  // For filtering, use the object so filtering works with DataTable
  const [filters, setFilters] = useState<any>({
    order_id: { value: null, matchMode: "contains" },
    status: { value: null, matchMode: "contains" },
    event: { value: null, matchMode: "contains" },
    eta: { value: null, matchMode: "contains" },
  });

  // Removed globalFilter as per your original code you only filtered by columns

  const [page, setPage] = useState(0);
  const [rows, setRows] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);

  const [sortField, setSortField] = useState<string | null>("order_id");
  const [sortOrder, setSortOrder] = useState<1 | -1>(1);

  const [visible, setVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const [orderTimeline, setOrderTimeline] = useState<TimelineEvent[]>([]);
  const [timelineLoading, setTimelineLoading] = useState(false);
  const [timelineError, setTimelineError] = useState<string | null>(null);

  const dateRange = useSelector((state: any) => state.dateRange.dates);
  const enterpriseKey = useSelector((state: any) => state.enterpriseKey.key);
  const [startDate, endDate] = dateRange || [];

  const firstRecord = page * rows + 1;
  const lastRecord = Math.min(totalRecords, firstRecord + rows - 1);

  const formatDate = (date: Date) =>
    `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;

  const formatETA = (eta: string) => {
    if (!eta || eta === "Delivered" || eta === "Ready" || eta === "-") return eta;
    const date = new Date(eta);
    return isNaN(date.getTime()) ? eta : date.toISOString().slice(0, 10);
  };

  useEffect(() => {
    if (!startDate || !endDate) return;
    setLoading(true);
    (async () => {
      try {
        const params: any = {
          startDate: formatDate(new Date(startDate)),
          endDate: formatDate(new Date(endDate)),
          page,
          size: rows,
          sortField,
          sortOrder: sortOrder === 1 ? "asc" : "desc",
        };
        if (enterpriseKey) {
          params.enterpriseKey = enterpriseKey;
        }

        // Add filters for columns
        for (const key in filters) {
          if (filters[key]?.value) {
            params[`${key}.value`] = filters[key].value;
            params[`${key}.matchMode`] = filters[key].matchMode;
          }
        }

        const res = await axiosInstance.get<{ data: Order[]; count: number }>("/fulfillment/orders-in-process", {
          params,
        });
        const { data, count } = res.data;
        setOrders(
          data.map((order) => ({
            ...order,
            status: mapEventToStatus(order.event),
          }))
        );
        setTotalRecords(count);
      } catch (error) {
        console.error(error);
        setOrders([]);
        setTotalRecords(0);
      }
      setLoading(false);
    })();
  }, [startDate, endDate, enterpriseKey, page, rows, sortField, sortOrder, filters]);

  // Fix sorting toggling logic
  const onSort = (event: DataTableSortEvent) => {
    if (event.sortField === sortField) {
      // Toggle order on same field
      setSortOrder(event.sortOrder === 1 ? -1 : 1);
    } else {
      setSortField(event.sortField ?? null);
      setSortOrder(1);
    }
  };

  const onPage = (event: DataTablePageEvent) => {
    setPage(event.page ?? 0);
    setRows(event.rows ?? 10);
  };

  // Filter callback to update filters state correctly
  const onFilter = (event: DataTableFilterEvent) => {
    setFilters(event.filters);
  };

  const handleViewClick = async (order: Order) => {
    setSelectedOrder(order);
    setVisible(true);
    setTimelineLoading(true);
    setTimelineError(null);
    setOrderTimeline([]);

    try {
      const res = await axiosInstance.get<{ timeline: TimelineEvent[] }>("/fulfillment/details", {
        params: { orderId: order.order_id },
      });
      setOrderTimeline(res.data.timeline);
    } catch (error) {
      setTimelineError("Failed to load order timeline");
    }
    setTimelineLoading(false);
  };

  const actionTemplate = (rowData: Order) => (
    <Button
      label="View"
      icon="pi pi-eye"
      className="p-button-sm p-button-text"
      onClick={() => handleViewClick(rowData)}
    />
  );

  // Filter input renderer for each column
  const renderFilterInput = (options: any) => (
    <InputText
      value={options.value || ""}
      onChange={(e) => options.filterCallback(e.target.value)}
      placeholder="Search"
      className="p-column-filter"
    />
  );

  return (
    <div className="mt-6">
      <div className="border rounded-xl shadow-sm p-4 overflow-x-auto bg-white dark:bg-gray-900">
        {/* Desktop View */}
        <div className="hidden sm:block">
          <DataTable
            value={orders}
            paginator
            first={page * rows}
            rows={rows}
            totalRecords={totalRecords}
            loading={loading}
            onPage={onPage}
            header={
              <h2 className="app-subheading">Orders In Process</h2>
            }
            paginatorTemplate="RowsPerPageDropdown CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
            currentPageReportTemplate={`Showing ${firstRecord} to ${lastRecord} of ${totalRecords} orders`}
            rowsPerPageOptions={[5, 10, 20, 50, 100]}
            sortMode="single"
            sortField={sortField ?? undefined}
            sortOrder={sortOrder}
            onSort={onSort}
            filters={filters}
            onFilter={onFilter}
            lazy
            globalFilterFields={["order_id", "status", "event", "eta"]}
            responsiveLayout="scroll"
            emptyMessage="No orders found"
          >
            <Column
              field="order_id"
              header="Order ID"
              sortable
              filter
              filterPlaceholder="Search Order ID"
              filterMatchMode="contains"
              filterElement={renderFilterInput}
              style={{ width: "150px" }}
            />
            <Column
              field="status"
              header="Status"
              sortable
              filter
              filterPlaceholder="Search Status"
              filterMatchMode="contains"
              filterElement={renderFilterInput}
              body={(rowData: Order) => (
                <Tag
                  className={`${getStatusColor(rowData.status)} text-white px-3 py-1 rounded-lg`}
                  value={rowData.status}
                />
              )}
              style={{ width: "150px" }}
            />
            {/* <Column
              field="event"
              header="Event"
              sortable
              filter
              filterPlaceholder="Search Event"
              filterMatchMode="contains"
              filterElement={renderFilterInput}
              style={{ width: "200px" }}
            />
            <Column
              field="eta"
              header="ETA"
              sortable
              filter
              filterPlaceholder="Search ETA"
              filterMatchMode="contains"
              filterElement={renderFilterInput}
              body={(rowData: Order) => formatETA(rowData.eta)}
              style={{ width: "150px" }}
            /> */}
            <Column
              header="Actions"
              body={actionTemplate}
              exportable={false}
              style={{ width: "110px" }}
            />
          </DataTable>
        </div>

        {/* Mobile View */}
        <div className="sm:hidden">
          <h2 className="app-subheading mb-4">Orders Under Fulfillment</h2>

          {orders.map((order) => (
            <div
              key={order.order_id}
              className="p-4 mb-4 rounded-lg shadow-md bg-white dark:bg-gray-800"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-semibold">Order ID: {order.order_id}</h3>
                <Tag
                  value={mapEventToStatus(order.event)}
                  className={`text-xs text-white ${getStatusColor(mapEventToStatus(order.event))}`}
                />
              </div>
              <div className="flex justify-between items-center mt-1">
                <p className="text-xs">Event: {order.event}</p>
                <Button
                  icon="pi pi-eye"
                  className="p-button-sm p-button-text"
                  onClick={() => handleViewClick(order)}
                  disabled={loading}
                />
              </div>
            </div>
          ))}

          {/* Mobile Pagination */}
          <div className="mt-4 text-sm text-gray-800 dark:text-gray-100">
            <div className="flex flex-col gap-2 mb-2 w-full">
              <div className="flex flex-col gap-1">
                <label htmlFor="mobileRows" className="whitespace-nowrap">
                  Rows per page:
                </label>
                <select
                  id="mobileRows"
                  value={rows}
                  onChange={(e) => {
                    setRows(Number(e.target.value));
                    setPage(0); // reset to first page when rows per page changes
                  }}
                  className="px-2 py-1 rounded dark:bg-gray-800 bg-gray-100 dark:text-white text-gray-800 w-full border"
                  disabled={loading}
                >
                  {[5, 10, 20, 50, 100].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div className="text-black dark:text-white font-medium">
                Page {page + 1} of {Math.max(1, Math.ceil(totalRecords / rows))}
              </div>
            </div>

            <div className="flex flex-wrap justify-between gap-2 w-full">
              <button
                onClick={() => setPage(0)}
                disabled={page === 0 || loading}
                className="flex-1 px-2 py-1 text-xs rounded bg-gray-200 dark:bg-gray-700 text-black dark:text-white disabled:opacity-50"
              >
                ⏮ First
              </button>
              <button
                onClick={() => setPage(Math.max(0, page - 1))}
                disabled={page === 0 || loading}
                className="flex-1 px-2 py-1 text-xs rounded bg-gray-200 dark:bg-gray-700 text-black dark:text-white disabled:opacity-50"
              >
                Prev
              </button>
              <button
                onClick={() =>
                  setPage(
                    page + 1 < Math.ceil(totalRecords / rows) ? page + 1 : page
                  )
                }
                disabled={page + 1 >= Math.ceil(totalRecords / rows) || loading}
                className="flex-1 px-2 py-1 text-xs rounded bg-gray-200 dark:bg-gray-700 text-black dark:text-white disabled:opacity-50"
              >
                Next
              </button>
              <button
                onClick={() => setPage(Math.ceil(totalRecords / rows) - 1)}
                disabled={page + 1 >= Math.ceil(totalRecords / rows) || loading}
                className="flex-1 px-2 py-1 text-xs rounded bg-gray-200 dark:bg-gray-700 text-black dark:text-white disabled:opacity-50"
              >
                ⏭ Last
              </button>
            </div>
          </div>
        </div>


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
