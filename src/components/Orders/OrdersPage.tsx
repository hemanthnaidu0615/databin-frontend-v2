import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog'; // Import PrimeReact Dialog for the modal

// Components
import OrderSummary from './OrderSummary';
import OrderList from './OrderList';
import OrderModal from './OrderModal';

const OrdersPage: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null); // Placeholder for selected order data

  const openOrderDetails = (order: any) => {
    setSelectedOrder(order);
    setIsModalVisible(true);
  };

  const closeOrderDetails = () => {
    setIsModalVisible(false);
    setSelectedOrder(null);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Orders</h1>
      
      {/* Order Summary Component */}
      <OrderSummary />
      
      {/* Order List Component with Filters */}
      <OrderList onOrderClick={openOrderDetails} />
      
      {/* Order Modal for Details */}
      {selectedOrder && (
        <Dialog
          header="Order Details"
          visible={isModalVisible}
          onHide={closeOrderDetails}
          style={{ width: '50vw' }}
        >
          <OrderModal order={selectedOrder} />
        </Dialog>
      )}
    </div>
  );
};

export default OrdersPage;
