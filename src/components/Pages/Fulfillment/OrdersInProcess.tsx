import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { Dialog } from "primereact/dialog";
import { motion } from "framer-motion";

interface Order {
  id: string;
  customer: string;
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

// Safe date formatting
const formatDate = (date: any) => {
  if (!date || isNaN(new Date(date).getTime())) return "";
  const d = new Date(date);
  return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}-${d
    .getDate()
    .toString()
    .padStart(2, "0")}`;
};

const OrdersInProcess = () => {
  const [globalFilter, setGlobalFilter] = useState("");
  const [visible, setVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);

  const dateRange = useSelector((state: any) => state.dateRange.dates);
  const enterpriseKey = useSelector((state: any) => state.enterpriseKey.key);
  const [startDate, endDate] = dateRange || [];

  const fetchOrders = async (page: number, size: number) => {
    if (!startDate || !endDate) {
      console.warn("Missing or invalid date range.");
      return;
    }

    setLoading(true);

    const formattedStart = formatDate(startDate);
    const formattedEnd = formatDate(endDate);

    const url = new URL("http://localhost:8080/api/fulfillment/orders-in-process");
    url.searchParams.append("startDate", formattedStart);
    url.searchParams.append("endDate", formattedEnd);
    url.searchParams.append("page", page.toString());
    url.searchParams.append("size", size.toString());
    if (enterpriseKey) {
      url.searchParams.append("enterpriseKey", enterpriseKey);
    }

    // Prevent caching issues
    url.searchParams.append("_ts", Date.now().toString());

    console.log("Fetching:", url.toString());

    try {
      const response = await fetch(url.toString());
      const data = await response.json();
      console.log("Fetched:", data);

      if (Array.isArray(data?.data)) {
        setOrders((prevOrders) => [...prevOrders, ...data.data]);
      } else {
        console.warn("Unexpected response format:", data);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }

    setLoading(false);
  };

  // Reset orders when filter changes
  useEffect(() => {
    setOrders([]);
    setPage(0);

    if (startDate && endDate) {
      fetchOrders(0, 1000);
    }
  }, [formatDate(startDate), formatDate(endDate), enterpriseKey]);

  // Load next page when page state increases
  useEffect(() => {
    if (page === 0) return;
    fetchOrders(page, 1000);
  }, [page]);

  // Infinite scroll
  const tableContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const container = tableContainerRef.current?.querySelector(".p-datatable-scrollable-body");
    if (!container) return;

    const onScroll = (e: Event) => {
      const target = e.target as HTMLElement;
      const isBottom = target.scrollHeight - target.scrollTop <= target.clientHeight + 10;
      if (isBottom && !loading) {
        setPage((prevPage) => prevPage + 1);
      }
    };

    container.addEventListener("scroll", onScroll);
    return () => container.removeEventListener("scroll", onScroll);
  }, [loading, orders]);

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

  const statusTemplate = (rowData: Order) => <Tag value={mapEventToStatus(rowData.event)} />;
  const eventTemplate = (rowData: Order) => <Tag value={rowData.event} />;

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

  const handleScroll = (e: any) => {
    const bottom =
      e.target.scrollHeight === e.target.scrollTop + e.target.clientHeight;
    if (bottom && !loading) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <div className="mt-6" onScroll={handleScroll} style={{ maxHeight: "80vh", overflowY: "auto" }}>
      <div
        className="border rounded-xl shadow-sm p-4 overflow-x-auto bg-white dark:bg-gray-900"
        ref={tableContainerRef}
      >
        <DataTable
          value={orders}
          paginator={false}
          header={header}
          globalFilter={globalFilter}
          className="p-datatable-sm"
          emptyMessage={!loading ? "No orders found." : ""}
          responsiveLayout="scroll"
          scrollable
        >
          <Column field="order_id" header="Order ID" sortable />
          <Column header="Status" body={statusTemplate} sortable />
          <Column field="event" header="Event" body={eventTemplate} sortable />
          <Column field="eta" header="ETA" sortable />
          <Column header="Action" body={actionTemplate} />
        </DataTable>

        {loading && <p className="mt-2 text-gray-500 text-sm">Loading...</p>}
      </div>

      <Dialog
        header={`Order Details: ${selectedOrder?.id}`}
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
          <p><strong>Customer:</strong> {selectedOrder?.customer}</p>
          <p><strong>Event:</strong> {selectedOrder?.event}</p>
          <p><strong>ETA:</strong> {selectedOrder?.eta}</p>
        </motion.div>
      </Dialog>
    </div>
  );
};

export default OrdersInProcess;
