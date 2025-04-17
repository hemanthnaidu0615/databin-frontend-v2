import React, { useState } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';

const carriers = ['FedEx', 'UPS', 'DHL', 'USPS'];
const shippingMethods = ['Ground', 'Air', 'Express'];

const mockData = [
  {
    id: 'SHP001',
    orderId: 'ORD001',
    customer: 'John Doe',
    carrier: 'FedEx',
    method: 'Air',
    origin: 'New York, NY',
    destination: 'Los Angeles, CA',
    shipDate: '2025-04-15',
    delivery: '2025-04-18',
    cost: '$120',
    status: 'Delivered',
  },
  {
    id: 'SHP002',
    orderId: 'ORD002',
    customer: 'Jane Smith',
    carrier: 'UPS',
    method: 'Ground',
    origin: 'Chicago, IL',
    destination: 'Houston, TX',
    shipDate: '2025-04-14',
    delivery: '2025-04-19',
    cost: '$90',
    status: 'Delayed',
  },
  // Add more mock rows as needed...
];

const getStatusSeverity = (status: string) => {
  switch (status) {
    case 'Delivered':
      return 'success';
    case 'In Transit':
      return 'info';
    case 'Delayed':
      return 'danger';
    default:
      return null;
  }
};

const RecentShipmentsTable = () => {
  const [selectedCarrier, setSelectedCarrier] = useState<string | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<any>(null);

  const filteredData = mockData.filter((item) => {
    const matchesCarrier = selectedCarrier ? item.carrier === selectedCarrier : true;
    const matchesMethod = selectedMethod ? item.method === selectedMethod : true;
    return matchesCarrier && matchesMethod;
  });

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md space-y-6 dark:border dark:border-gray-700">

        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Recent Shipments</h2>
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
  <div>
    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Carrier</label>
    <Dropdown
      value={selectedCarrier}
      options={carriers}
      onChange={(e) => setSelectedCarrier(e.value)}
      placeholder="Select Carrier"
      className="w-full"
    />
  </div>

  <div>
    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Shipping Method</label>
    <Dropdown
      value={selectedMethod}
      options={shippingMethods}
      onChange={(e) => setSelectedMethod(e.value)}
      placeholder="Select Method"
      className="w-full"
    />
  </div>

  <div className="flex justify-end">
    <button
      onClick={() => {
        setSelectedCarrier(null);
        setSelectedMethod(null);
      }}
      className="text-sm px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
    >
      Clear Filters
    </button>
  </div>
</div>


      {/* Table */}
      <DataTable value={filteredData} paginator rows={5} stripedRows responsiveLayout="scroll" className="p-datatable-sm">
        <Column field="id" header="Shipment ID" />
        <Column field="orderId" header="Order ID" />
        <Column field="customer" header="Customer" />
        <Column field="carrier" header="Carrier" />
        <Column field="method" header="Shipping Method" />
        <Column field="origin" header="Origin" />
        <Column field="destination" header="Destination" />
        <Column field="shipDate" header="Ship Date" />
        <Column field="delivery" header="Est. Delivery" />
        <Column field="cost" header="Cost" />
        <Column
          field="status"
          header="Status"
          body={(rowData) => <Tag value={rowData.status} severity={getStatusSeverity(rowData.status)} />}
        />
        <Column
          header="Action"
          body={() => (
            <button className="text-purple-600 hover:underline text-sm font-medium">View</button>
          )}
        />
      </DataTable>
    </div>
  );
};

export default RecentShipmentsTable;
