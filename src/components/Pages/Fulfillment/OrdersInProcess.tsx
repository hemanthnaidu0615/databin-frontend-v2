import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { Dialog } from "primereact/dialog";
import { motion } from "framer-motion";

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
  const [page] = useState(1);
  const [rows] = useState(5);

  const dateRange = useSelector((state: any) => state.dateRange.dates);
  const enterpriseKey = useSelector((state: any) => state.enterpriseKey.key);
  const [startDate, endDate] = dateRange || [];

  const formatDate = (date: Date) =>
    `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;

  // This function formats the ETA to display only the date in YYYY-MM-DD format
  const formatETA = (eta: string) => {
    if (!eta || eta === "Delivered" || eta === "Ready" || eta === "-") {
      return eta;
    }

    // Create a new Date object from the ISO string
    const date = new Date(eta);

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return eta; // If invalid, return the original eta string
    }

    // Format to "YYYY-MM-DD"
    return date.toISOString().slice(0, 10);
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
        const res = await fetch(
          `http://localhost:8080/api/fulfillment/orders-in-process?${params.toString()}`
        );
        const json = await res.json();
        setOrders(json.data || []);
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
            rowsPerPageOptions={[5, 10, 20, 50]}
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
          {filteredOrders
            .slice((page - 1) * rows, page * rows)
            .map((order) => (
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
              <div><strong>Status:</strong> {mapEventToStatus(selectedOrder.event)}</div>
              <div><strong>ETA:</strong> {formatETA(selectedOrder.eta)}</div>
              <div><strong>Event:</strong> {selectedOrder.event}</div>
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