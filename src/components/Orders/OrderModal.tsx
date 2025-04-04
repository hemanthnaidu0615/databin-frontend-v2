import React from 'react';

type OrderModalProps = {
  order: any;
};

const OrderModal: React.FC<OrderModalProps> = ({ order }) => {
  return (
    <div>
      <h3 className="font-semibold text-xl">Order ID: {order.id}</h3>
      <p><strong>Customer:</strong> {order.customer}</p>
      <p><strong>Status:</strong> {order.status}</p>
      <p><strong>Total:</strong> {order.total}</p>
      <p><strong>Order Date:</strong> {order.date}</p>
      {/* Add more order details as needed */}
    </div>
  );
};

export default OrderModal;
