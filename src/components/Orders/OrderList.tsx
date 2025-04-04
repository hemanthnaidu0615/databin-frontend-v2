import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';

// Placeholder orders data
const orders = [
  { id: '1', customer: 'John Doe', status: 'Pending', total: '$100', date: '2025-03-30' },
  { id: '2', customer: 'Jane Smith', status: 'Fulfilled', total: '$250', date: '2025-03-28' },
  { id: '3', customer: 'Sam Green', status: 'Pending', total: '$50', date: '2025-03-27' },
  { id: '4', customer: 'Anna Black', status: 'Fulfilled', total: '$150', date: '2025-03-26' },
];

type OrderListProps = {
  onOrderClick: (order: any) => void;
};

const OrderList: React.FC<OrderListProps> = ({ onOrderClick }) => {
  return (
    <div className="bg-white p-4 border rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Order List</h2>
      <DataTable value={orders} paginator rows={10}>
        <Column field="id" header="Order ID" />
        <Column field="customer" header="Customer" />
        <Column field="status" header="Status" />
        <Column field="total" header="Total" />
        <Column field="date" header="Date" />
        <Column
          body={(rowData) => (
            <Button
              label="View Details"
              onClick={() => onOrderClick(rowData)}
              className="p-button-link"
            />
          )}
        />
      </DataTable>
    </div>
  );
};

export default OrderList;
