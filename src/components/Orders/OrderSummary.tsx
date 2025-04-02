import React from 'react';

const OrderSummary: React.FC = () => {
  // Placeholder data, replace with real data when available
  const totalOrders = 150;
  const totalRevenue = '$15,000';
  const ordersFulfilled = 120;
  const pendingOrders = 30;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="p-4 border rounded-lg bg-white">
        <h3 className="font-semibold text-xl">Total Orders</h3>
        <p className="text-lg">{totalOrders}</p>
      </div>
      <div className="p-4 border rounded-lg bg-white">
        <h3 className="font-semibold text-xl">Total Revenue</h3>
        <p className="text-lg">{totalRevenue}</p>
      </div>
      <div className="p-4 border rounded-lg bg-white">
        <h3 className="font-semibold text-xl">Orders Fulfilled</h3>
        <p className="text-lg">{ordersFulfilled}</p>
      </div>
      <div className="p-4 border rounded-lg bg-white">
        <h3 className="font-semibold text-xl">Pending Orders</h3>
        <p className="text-lg">{pendingOrders}</p>
      </div>
    </div>
  );
};

export default OrderSummary;
