import { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';

interface Order {
  id: string;
  customer: string;
  status: string;
  stage: string;
  eta: string;
}

const dummyOrders: Order[] = [
  { id: 'ORD-1001', customer: 'Alice Johnson', status: 'Processing', stage: 'Picking', eta: '2h' },
  { id: 'ORD-1002', customer: 'David Miller', status: 'Shipped', stage: 'Shipping', eta: 'Delivered' },
  { id: 'ORD-1003', customer: 'Megan Fox', status: 'Packing', stage: 'Packing', eta: '1h' },
  { id: 'ORD-1004', customer: 'John Doe', status: 'Processing', stage: 'Order Received', eta: '4h' },
];

const statusColors: Record<string, string> = {
  Processing: 'blue',
  Picking: 'orange',
  Packing: 'purple',
  Shipped: 'green',
};

const OrdersInProcess = () => {
  const [globalFilter, setGlobalFilter] = useState('');

  const header = (
    <div className="flex justify-between items-center">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Orders in Process</h2>
      <span className="p-input-icon-left">
        <i className="pi pi-search text-gray-500" />
        <InputText
          type="search"
          onInput={(e: React.ChangeEvent<HTMLInputElement>) => setGlobalFilter(e.target.value)}
          placeholder="Search Orders"
          className="p-inputtext-sm"
        />
      </span>
    </div>
  );

  const statusTemplate = (rowData: Order) => (
    <Tag value={rowData.status} severity={statusColors[rowData.status] as any || 'info'} />
  );

  const actionTemplate = () => (
    <Button label="View" icon="pi pi-eye" className="p-button-sm p-button-text" />
  );

  return (
    <div className="mt-6">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-4">
        <DataTable
          value={dummyOrders}
          paginator
          rows={5}
          header={header}
          globalFilter={globalFilter}
          className="p-datatable-sm"
          emptyMessage="No orders found."
          responsiveLayout="scroll"
        >
          <Column field="id" header="Order ID" sortable />
          <Column field="customer" header="Customer" sortable />
          <Column field="status" header="Status" body={statusTemplate} sortable />
          <Column field="stage" header="Current Stage" sortable />
          <Column field="eta" header="ETA" sortable />
          <Column header="Action" body={actionTemplate} />
        </DataTable>
      </div>
    </div>
  );
};

export default OrdersInProcess;
