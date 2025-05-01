import { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { Dialog } from "primereact/dialog";
import { motion } from "framer-motion";
import { Paginator } from "primereact/paginator";

interface Order {
  id: string;
  customer: string;
  event: string;
  eta: string;
}

const dummyOrders: Order[] = [
  { id: "ORD-1001", customer: "Alice Johnson", event: "Store Pickup", eta: "2h" },
  { id: "ORD-1002", customer: "David Miller", event: "Cancelled", eta: "Delivered" },
  { id: "ORD-1003", customer: "Megan Fox", event: "Warehouse", eta: "1h" },
  { id: "ORD-1004", customer: "John Doe", event: "Order Placed", eta: "4h" },
  { id: "ORD-1005", customer: "Sandra Lee", event: "Vendor Drop Shipping", eta: "6h" },
  { id: "ORD-1006", customer: "Brian O’Connor", event: "Distribution Center", eta: "3h" },
  { id: "ORD-1007", customer: "Michelle Chan", event: "Same-Day Delivery", eta: "30m" },
  { id: "ORD-1008", customer: "Carlos Ramirez", event: "Locker Pickup", eta: "Ready" },
  { id: "ORD-1009", customer: "Tina Cohen", event: "Curbside Pickup", eta: "45m" },
  { id: "ORD-1010", customer: "Robert Langdon", event: "Cancelled", eta: "-" },
  { id: "ORD-1011", customer: "Emily Rose", event: "Return Received", eta: "-" },
  { id: "ORD-1012", customer: "Nathan Drake", event: "Processing", eta: "1h" },
  { id: "ORD-1013", customer: "Chloe Frazer", event: "Shipped", eta: "Delivered" },
  { id: "ORD-1014", customer: "Lara Croft", event: "Store Pickup", eta: "Ready" },
  { id: "ORD-1015", customer: "Marcus Holloway", event: "Order Placed", eta: "5h" },
];

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
  const [globalFilter, setGlobalFilter] = useState("");
  const [visible, setVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState(5);

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

  const statusTemplate = (rowData: Order) => (
    <Tag value={mapEventToStatus(rowData.event)} />
  );
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

  const handlePageChange = (direction: string) => {
    if (direction === "next" && page * rows < dummyOrders.length) {
      setPage(page + 1);
    } else if (direction === "prev" && page > 1) {
      setPage(page - 1);
    }
  };

  return (
    <div className="mt-6">
      <div className="border rounded-xl shadow-sm p-4 overflow-x-auto bg-white dark:bg-gray-900">
        {/* Desktop View */}
        <div className="hidden sm:block">
          <DataTable
            value={dummyOrders.slice((page - 1) * rows, page * rows)}
            paginator={false}
            header={header}
            globalFilter={globalFilter}
            className="p-datatable-sm"
            emptyMessage="No orders found."
            responsiveLayout="scroll"
            scrollable
          >
            <Column field="id" header="Order ID" sortable />
            <Column header="Status" body={statusTemplate} sortable />
            <Column field="event" header="Event" body={eventTemplate} sortable />
            <Column field="eta" header="ETA" sortable />
            <Column header="Action" body={actionTemplate} />
          </DataTable>

          {/* Desktop Pagination */}
          <div className="hidden sm:block mt-4 p-4 bg-white dark:bg-gray-900 rounded-b-lg">
            <Paginator
              first={(page - 1) * rows}
              rows={rows}
              totalRecords={dummyOrders.length}
              onPageChange={(e) => setPage(e.page + 1)}
              rowsPerPageOptions={[5, 10, 20]}
              template="RowsPerPageDropdown CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
              currentPageReportTemplate="Showing {first} to {last} of {totalRecords} orders"
              className="dark:text-gray-100 dark:bg-gray-900 [&_.p-paginator]:bg-transparent [&_.p-paginator]:dark:bg-transparent [&_.p-paginator]:border-none"
            />
          </div>
        </div>

        {/* Mobile View */}
        <div className="sm:hidden">
          {dummyOrders.slice((page - 1) * rows, page * rows).map((order) => (
            <div
              key={order.id}
              className="p-4 mb-4 rounded-lg shadow-md bg-white dark:bg-gray-800"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-semibold">Order ID: {order.id}</h3>
                <Tag value={mapEventToStatus(order.event)} className="text-xs" />
              </div>
              <p className="text-xs mt-1">Event: {order.event}</p>
              <p className="text-xs">ETA: {order.eta}</p>
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
          <div className="mt-4 flex flex-col justify-between items-center bg-[#0F172A] rounded-md px-4 py-3 border border-[#1E293B]">
            <div className="flex items-center gap-2 mb-3">
              <label htmlFor="mobileRows" className="text-sm text-white font-medium">
                Rows per page:
              </label>
              <select
                id="mobileRows"
                value={rows}
                onChange={(e) => {
                  setRows(Number(e.target.value));
                  setPage(1);
                }}
                className="bg-[#1E293B] text-white text-sm px-3 py-1 rounded focus:outline-none border border-[#334155]"
              >
                {[5, 10, 20, 50].map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex w-full justify-between items-center">
              <button
                onClick={() => handlePageChange("prev")}
                disabled={page === 1}
                className={`text-sm px-3 py-1 rounded font-semibold border ${
                  page === 1
                    ? "bg-[#1E293B] text-gray-500 border-[#1E293B] cursor-not-allowed"
                    : "bg-[#1E293B] text-white border-[#334155] hover:bg-[#334155]"
                }`}
              >
                Prev
              </button>

              <span className="text-sm text-white font-semibold">
                {`Page ${page} of ${Math.ceil(dummyOrders.length / rows)}`}
              </span>

              <button
                onClick={() => handlePageChange("next")}
                disabled={page * rows >= dummyOrders.length}
                className={`text-sm px-3 py-1 rounded font-semibold border ${
                  page * rows >= dummyOrders.length
                    ? "bg-[#1E293B] text-gray-500 border-[#1E293B] cursor-not-allowed"
                    : "bg-[#1E293B] text-white border-[#334155] hover:bg-[#334155]"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Dialog Modal */}
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
          {/* Modal content goes here */}
        </motion.div>
      </Dialog>
    </div>
  );
};

export default OrdersInProcess;
