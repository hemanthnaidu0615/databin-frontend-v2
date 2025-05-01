import React, { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext"; // Import InputText

type Props = {
  selectedCarrier: string | null;
  selectedMethod: string | null;
};

const mockData = [
  {
    id: "SHP-001",
    orderId: "ORD-1001",
    customer: "Alice Johnson",
    carrier: "UPS",
    method: "Ground",
    origin: "New York, NY",
    destination: "Los Angeles, CA",
    shipDate: "2025-04-20",
    delivery: "2025-04-25",
    cost: "$35.00",
    status: "In Transit",
  },
  {
    id: "SHP-002",
    orderId: "ORD-1002",
    customer: "Bob Smith",
    carrier: "FedEx",
    method: "2-Day",
    origin: "Chicago, IL",
    destination: "Houston, TX",
    shipDate: "2025-04-18",
    delivery: "2025-04-20",
    cost: "$42.00",
    status: "Delivered",
  },

  {
    id: "SHP002",
    orderId: "ORD002",
    customer: "Jane Smith",
    carrier: "UPS",
    method: "Standard",
    origin: "Chicago, IL",
    destination: "Houston, TX",
    shipDate: "2025-04-14",
    delivery: "2025-04-19",
    cost: "$90",
    status: "Delayed",
  },
  {
    id: "SHP003",
    orderId: "ORD003",
    customer: "Alice Johnson",
    carrier: "DHL",
    method: "Expedited",
    origin: "Miami, FL",
    destination: "Seattle, WA",
    shipDate: "2025-04-12",
    delivery: "2025-04-15",
    cost: "$150",
    status: "Delivered",
  },
  {
    id: "SHP004",
    orderId: "ORD004",
    customer: "Robert Brown",
    carrier: "FedEx",
    method: "Standard",
    origin: "Atlanta, GA",
    destination: "Denver, CO",
    shipDate: "2025-04-10",
    delivery: "2025-04-16",
    cost: "$100",
    status: "Delivered",
  },
  {
    id: "SHP005",
    orderId: "ORD005",
    customer: "Emily Davis",
    carrier: "UPS",
    method: "Same-Day",
    origin: "Boston, MA",
    destination: "Phoenix, AZ",
    shipDate: "2025-04-13",
    delivery: "2025-04-16",
    cost: "$130",
    status: "In Transit",
  },
  {
    id: "SHP006",
    orderId: "ORD006",
    customer: "Michael Wilson",
    carrier: "DHL",
    method: "Standard",
    origin: "San Francisco, CA",
    destination: "Dallas, TX",
    shipDate: "2025-04-11",
    delivery: "2025-04-17",
    cost: "$110",
    status: "Delayed",
  },
  {
    id: "SHP007",
    orderId: "ORD007",
    customer: "Sophia Martinez",
    carrier: "FedEx",
    method: "Expedited",
    origin: "Portland, OR",
    destination: "Orlando, FL",
    shipDate: "2025-04-14",
    delivery: "2025-04-17",
    cost: "$160",
    status: "Delivered",
  },
  {
    id: "SHP008",
    orderId: "ORD008",
    customer: "David Anderson",
    carrier: "UPS",
    method: "Standard",
    origin: "Las Vegas, NV",
    destination: "Nashville, TN",
    shipDate: "2025-04-09",
    delivery: "2025-04-15",
    cost: "$95",
    status: "Delivered",
  },
  {
    id: "SHP009",
    orderId: "ORD009",
    customer: "Olivia Thomas",
    carrier: "DHL",
    method: "Same-Day",
    origin: "Philadelphia, PA",
    destination: "San Diego, CA",
    shipDate: "2025-04-13",
    delivery: "2025-04-16",
    cost: "$140",
    status: "In Transit",
  },
  {
    id: "SHP010",
    orderId: "ORD010",
    customer: "Daniel White",
    carrier: "FedEx",
    method: "Standard",
    origin: "Indianapolis, IN",
    destination: "Charlotte, NC",
    shipDate: "2025-04-12",
    delivery: "2025-04-18",
    cost: "$105",
    status: "Pending",
  },
  {
    id: "SHP011",
    orderId: "ORD011",
    customer: "Grace Lee",
    carrier: "UPS",
    method: "Expedited",
    origin: "Minneapolis, MN",
    destination: "Tampa, FL",
    shipDate: "2025-04-15",
    delivery: "2025-04-18",
    cost: "$125",
    status: "Delivered",
  },
];

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

const RecentShipmentsTable: React.FC<Props> = ({
  selectedCarrier,
  selectedMethod,
}) => {
  const [selectedShipment, setSelectedShipment] = useState<any | null>(null);
  const [visible, setVisible] = useState(false);

  const [mobileFirst, setMobileFirst] = useState(0);
  const [mobileRows, setMobileRows] = useState(3);
  const [searchQuery, setSearchQuery] = useState(""); // Added state for search query

  const filteredData = mockData.filter((item) => {
    const matchCarrier = selectedCarrier
      ? item.carrier === selectedCarrier
      : true;
    const matchMethod = selectedMethod ? item.method === selectedMethod : true;
    const matchSearchQuery = item.id
      .toLowerCase()
      .includes(searchQuery.toLowerCase()); // Filter based on search query
    return matchCarrier && matchMethod && matchSearchQuery;
  });

  const mobilePageData = filteredData.slice(
    mobileFirst,
    mobileFirst + mobileRows
  );

  const showDetails = (shipment: any) => {
    setSelectedShipment(shipment);
    setVisible(true);
  };

  const shipmentDetails = (shipment: any) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-800 dark:text-gray-200">
      <div>
        <strong>Shipment ID:</strong> {shipment.id}
      </div>
      <div>
        <strong>Order ID:</strong> {shipment.orderId}
      </div>
      <div>
        <strong>Customer:</strong> {shipment.customer}
      </div>
      <div>
        <strong>Carrier:</strong> {shipment.carrier}
      </div>
      <div>
        <strong>Shipping Method:</strong> {shipment.method}
      </div>
      <div>
        <strong>Status:</strong>{" "}
        <Tag
          value={shipment.status}
          severity={getStatusSeverity(shipment.status)}
        />
      </div>
      <div>
        <strong>Ship Date:</strong> {shipment.shipDate}
      </div>
      <div>
        <strong>Estimated Delivery:</strong> {shipment.delivery}
      </div>
      <div>
        <strong>Origin:</strong> {shipment.origin}
      </div>
      <div>
        <strong>Destination:</strong> {shipment.destination}
      </div>
      <div>
        <strong>Cost:</strong> {shipment.cost}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col flex-1 h-full overflow-hidden rounded-xl border border-gray-200 bg-white px-6 pb-6 pt-4 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="flex justify-between items-center gap-2 flex-wrap mb-4">
        <h2 className="text-sm md:text-lg font-semibold">Orders in Process</h2>
        <span className="p-input-icon-left w-full md:w-auto">
          <InputText
            type="search"
            onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchQuery(e.target.value)
            }
            placeholder="Search Shipment ID"
            className="p-inputtext-sm w-full"
            style={{ paddingLeft: "2rem" }}
          />
        </span>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block">
        <DataTable
          value={filteredData}
          paginator
          rows={5}
          stripedRows
          className="p-datatable-sm w-full [&_.p-paginator]:w-full [&_.p-paginator]:flex [&_.p-paginator]:justify-between [&_.p-dropdown]:py-1 [&_.p-paginator-pages]:gap-1 [&_.p-paginator-page]:!px-2 !rounded-md [&_.p-highlight]:bg-blue-600 [&_.p-highlight]:text-white"
          responsiveLayout="scroll"
          paginatorTemplate="RowsPerPageDropdown CurrentPageReport PrevPageLink PageLinks NextPageLink"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} orders"
          rowsPerPageOptions={[5, 10, 20, 50]}
          sortMode="multiple"
        >
          <Column field="id" header="Shipment ID" sortable />
          <Column field="customer" header="Customer" sortable />
          <Column field="carrier" header="Carrier" sortable />
          <Column field="shipDate" header="Ship Date" sortable />
          <Column
            field="status"
            header="Status"
            body={(rowData) => (
              <Tag
                value={rowData.status}
                severity={getStatusSeverity(rowData.status)}
              />
            )}
            sortable
          />
          <Column
            header="Action"
            body={(rowData) => (
              <button
                onClick={() => showDetails(rowData)}
                className="text-purple-500 hover:underline text-sm font-medium"
              >
                View
              </button>
            )}
          />
        </DataTable>
      </div>

      {/* Mobile View - Cards */}
      <div className="block md:hidden space-y-4">
        {mobilePageData.map((shipment, index) => (
          <div
            key={index}
            className="border rounded-xl p-4 bg-white dark:bg-white/[0.03] shadow-sm"
          >
            <div className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">
              {shipment.id} - {shipment.customer}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              <div>
                <strong>Carrier:</strong> {shipment.carrier}
              </div>
              <div>
                <strong>Ship Date:</strong> {shipment.shipDate}
              </div>
              <div>
                <strong>Status:</strong>{" "}
                <Tag
                  value={shipment.status}
                  severity={getStatusSeverity(shipment.status)}
                />
              </div>
            </div>
            <div className="mt-2">
              <button
                onClick={() => showDetails(shipment)}
                className="text-purple-500 hover:underline text-sm font-medium"
              >
                View Details
              </button>
            </div>
          </div>
        ))}

        {/* Custom Mobile Pagination */}
        {filteredData.length > mobileRows && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-4 gap-3 text-sm text-gray-700 dark:text-gray-100">
            {/* Rows per page dropdown */}
            <div className="flex items-center gap-2">
              <label htmlFor="mobileRows" className="whitespace-nowrap">
                Rows per page:
              </label>
              <select
                id="mobileRows"
                value={mobileRows}
                onChange={(e) => {
                  setMobileRows(Number(e.target.value));
                  setMobileFirst(0); // reset to first page
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
                onClick={() =>
                  setMobileFirst((prev) => Math.max(0, prev - mobileRows))
                }
                disabled={mobileFirst === 0}
                className="px-3 py-1 rounded dark:bg-gray-800 bg-gray-100 disabled:opacity-50"
              >
                Prev
              </button>

              {/* Center - Page Indicator */}
              <div className="text-center flex-1 text-sm">
                Page {Math.floor(mobileFirst / mobileRows) + 1} of{" "}
                {Math.ceil(filteredData.length / mobileRows)}
              </div>

              {/* Right - Next */}
              <button
                onClick={() =>
                  setMobileFirst((prev) =>
                    prev + mobileRows < filteredData.length
                      ? prev + mobileRows
                      : prev
                  )
                }
                disabled={mobileFirst + mobileRows >= filteredData.length}
                className="px-3 py-1 rounded dark:bg-gray-800 bg-gray-100 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Dialog */}
      <Dialog
        header="Shipment Details"
        visible={visible}
        onHide={() => setVisible(false)}
        style={{ width: "90vw", maxWidth: "600px" }}
        breakpoints={{ "960px": "95vw" }}
        className="p-dialog-sm dark:bg-white/[0.03]"
      >
        {selectedShipment ? shipmentDetails(selectedShipment) : <p>No data</p>}
        <div className="mt-4 text-right">
          <Button
            label="Close"
            icon="pi pi-times"
            onClick={() => setVisible(false)}
            className="p-button-text text-purple-500"
          />
        </div>
      </Dialog>
    </div>
  );
};

export default RecentShipmentsTable;
