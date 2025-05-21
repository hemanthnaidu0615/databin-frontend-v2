import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { DataTable } from "primereact/datatable";
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

const mapEventToStatus = (event: string): string => {
  switch (event) {
    case "Order Placed":
    case "Processing":
    case "Distribution Center":
    case "Warehouse":
    case "Vendor Drop Shipping":
    case "Ship to Home":
      return "Processing";
    case "Store Pickup":
    case "Locker Pickup":
    case "Curbside Pickup":
      return "Ready for Pickup";
    case "Same-Day Delivery":
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
  const [globalFilter, setGlobalFilter] = useState("");
  const [visible, setVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(5);



  const dateRange = useSelector((state: any) => state.dateRange.dates);
  const enterpriseKey = useSelector((state: any) => state.enterpriseKey.key);
  const [startDate, endDate] = dateRange || [];

  const formatDate = (date: Date) =>
    `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;

  const formatETA = (eta: string) => {
    if (!eta || eta === "Delivered" || eta === "Ready" || eta === "-") return eta;
    const date = new Date(eta);
    return isNaN(date.getTime()) ? eta : date.toISOString().slice(0, 10);
  };

  useEffect(() => {
    const fetchOrders = async () => {
      if (!startDate || !endDate) return;

      const formattedStart = formatDate(new Date(startDate));
      const formattedEnd = formatDate(new Date(endDate));

      const params = new URLSearchParams({
        startDate: formattedStart,
        endDate: formattedEnd,
      });

      if (enterpriseKey) {
        params.append("enterpriseKey", enterpriseKey);
      }

      try {
        const res = await axiosInstance.get("/fulfillment/orders-in-process", {
          params: {
            startDate: formattedStart,
            endDate: formattedEnd,
            ...(enterpriseKey ? { enterpriseKey } : {}),
          },
        });
        const data = res.data as { data: Order[] };
        setOrders(data.data || []);

      } catch (err) {
        console.error("Failed to fetch orders-in-process:", err);
      }
    };

    fetchOrders();
  }, [startDate, endDate, enterpriseKey]);

  const header = (
    <div className="flex justify-between items-center gap-2 flex-wrap">
      <h2 className="text-sm md:text-lg font-semibold">Orders in Process</h2>
      <span className="p-input-icon-left w-full md:w-auto">
        <InputText
          type="search"
          onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
            setGlobalFilter(e.target.value)
          }
          placeholder="Search Orders"
          className="p-inputtext-sm w-full"
          style={{ paddingLeft: "2rem" }}
        />
      </span>
    </div>
  );

  const filteredOrders = orders.filter(
    (order) =>
      globalFilter === "" ||
      order.order_id.toString().includes(globalFilter.toLowerCase()) ||
      order.event.toLowerCase().includes(globalFilter.toLowerCase())
  );

  const getPageOptions = () => {
    const total = filteredOrders.length;
    if (total <= 5) return [5];
    if (total <= 10) return [5, 10];
    if (total <= 20) return [5, 10, 15, 20];
    if (total <= 50) return [10, 20, 30, 50];
    return [10, 20, 50, 100];
  };

  const eventTemplate = (rowData: Order) => <Tag value={rowData.event} />;
  const etaTemplate = (rowData: Order) => formatETA(rowData.eta);

  const handleViewClick = (order: Order) => {
    setSelectedOrder(order);
    setVisible(true);
  };

  const actionTemplate = (rowData: Order) => (
    <Button
      label="View"
      icon="pi pi-eye"
      className="p-button-sm p-button-text"
      onClick={() => handleViewClick(rowData)}
    />
  );

  return (
    <div className="mt-6">
      <div className="border rounded-xl shadow-sm p-4 overflow-x-auto bg-white dark:bg-gray-900">
        {/* Desktop View */}
        <div className="hidden sm:block">
          <DataTable
            value={filteredOrders}
            paginator
            rows={rows}
            stripedRows
            header={header}
            globalFilter={globalFilter}
            className="p-datatable-sm"
            paginatorTemplate="RowsPerPageDropdown CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} orders"
            rowsPerPageOptions={getPageOptions()}
            onPage={(e) => {
              setFirst(e.first);
              setRows(e.rows);
            }}
            first={first}
            emptyMessage="No orders found."
            responsiveLayout="scroll"
            scrollable
          >
            <Column field="order_id" header="Order ID" sortable />
            <Column header="Status" body={eventTemplate} sortable />
            <Column field="eta" header="ETA" body={etaTemplate} sortable />
            <Column header="Action" body={actionTemplate} />
          </DataTable>
        </div>

        {/* Mobile View */}
        <div className="sm:hidden">
          {filteredOrders.slice(first, first + rows).map((order) => (
            <div
              key={order.order_id}
              className="p-4 mb-4 rounded-lg shadow-md bg-white dark:bg-gray-800"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-semibold">Order ID: {order.order_id}</h3>
                <Tag value={mapEventToStatus(order.event)} className="text-xs" />
              </div>
              <p className="text-xs mt-1">Event: {order.event}</p>
              <p className="text-xs">ETA: {formatETA(order.eta)}</p>
              <div className="mt-2">
                <Button
                  label="View"
                  icon="pi pi-eye"
                  className="p-button-sm p-button-text"
                  onClick={() => handleViewClick(order)}
                />
              </div>
            </div>
          ))}

          {/* Mobile Pagination */}
          <div className="mt-4 text-sm text-gray-800 dark:text-gray-100">
            <div className="flex items-center justify-between gap-2 mb-2">
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

              <div>
                Page {Math.floor(first / rows) + 1} of{" "}
                {Math.ceil(filteredOrders.length / rows)}
              </div>
            </div>

            <div className="flex justify-between gap-2">
              <button
                onClick={() => setFirst(0)}
                disabled={first === 0}
                className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 disabled:opacity-50"
              >
                ⏮ First
              </button>
              <button
                onClick={() => setFirst(Math.max(0, first - rows))}
                disabled={first === 0}
                className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 disabled:opacity-50"
              >
                Prev
              </button>
              <button
                onClick={() =>
                  setFirst(
                    first + rows < filteredOrders.length ? first + rows : first
                  )
                }
                disabled={first + rows >= filteredOrders.length}
                className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 disabled:opacity-50"
              >
                Next
              </button>
              <button
                onClick={() =>
                  setFirst(
                    (Math.ceil(filteredOrders.length / rows) - 1) * rows
                  )
                }
                disabled={first + rows >= filteredOrders.length}
                className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 disabled:opacity-50"
              >
                ⏭ Last
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Dialog Modal */}
      <Dialog
        header={`Order Details: ${selectedOrder?.order_id}`}
        visible={visible}
        onHide={() => setVisible(false)}
        style={{ width: "40rem" }}
        modal
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-6"
        >
          {selectedOrder ? (
            <>
              <div>
                <strong>Status:</strong> {mapEventToStatus(selectedOrder.event)}
              </div>
              <div>
                <strong>ETA:</strong> {formatETA(selectedOrder.eta)}
              </div>
              <div>
                <strong>Event:</strong> {selectedOrder.event}
              </div>
            </>
          ) : (
            <p>No order selected.</p>
          )}
        </motion.div>
      </Dialog>
    </div>
  );
};

export default OrdersInProcess;
