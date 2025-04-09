import React, { useState } from 'react';
import { orders as allOrders, Order } from './ordersData';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'; // Import icons from react-icons

interface Props {
  orders?: Order[];
}

const statusColors: Record<string, string> = {
  Delivered: 'bg-green-600',
  Pending: 'bg-yellow-500',
  Cancelled: 'bg-red-600',
};

const OrderStatusBadge: React.FC<{ status: Order['status'] }> = ({ status }) => {
  return (
    <span className={`inline-block px-2 py-1 text-xs rounded-full text-white ${statusColors[status]}`}>
      {status}
    </span>
  );
};

const OrderList: React.FC<Props> = ({ orders = allOrders }) => {
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedOrderId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y dark:divide-gray-800 text-left"> {/* Added text-left */}
<thead>
  <tr className="text-left text-sm dark:text-gray-400">
    <th className="py-3 px-4"> {/* No label for icon */}</th>
    <th className="py-3 px-4">Order ID</th>
    <th className="py-3 px-4">Date</th>
    <th className="py-3 px-4">Customer</th>
    <th className="py-3 px-4">Product</th>
    <th className="py-3 px-4">Total</th>
    <th className="py-3 px-4">Status</th>
    <th className="py-3 px-4">Payment</th>
  </tr>
</thead>
<tbody className="text-sm dark:text-gray-400">
  {orders.map((order) => (
    <React.Fragment key={order.id}>
      <tr
        className="hover:dark:bg-white/[0.05] transition-colors cursor-pointer"
        onClick={() => toggleExpand(order.id)}
      >
        <td className="py-3 px-4">
          {expandedOrderId === order.id ? (
            <FaChevronUp className="text-gray-500 dark:text-gray-400" />
          ) : (
            <FaChevronDown className="text-gray-500 dark:text-gray-400" />
          )}
        </td>
        <td className="py-3 px-4">{order.id}</td>
        <td className="py-3 px-4">{order.date}</td>
        <td className="py-3 px-4">{order.customer}</td>
        <td className="py-3 px-4">{order.product}</td>
        <td className="py-3 px-4">${order.total}</td>
        <td className="py-3 px-4">
          <OrderStatusBadge status={order.status} />
        </td>
        <td className="py-3 px-4">{order.paymentMethod}</td>
      </tr>

      {expandedOrderId === order.id && (
        <tr>
          <td colSpan={8} className="px-4 pb-6 pt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
{/* 1. Order Summary */}
<div className="bg-gray-100 dark:bg-white/5 p-4 rounded-xl">
  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Order Summary</h3>
  <div className="text-sm space-y-2 text-gray-600 dark:text-gray-300">
    <div className="flex justify-between items-center">
      <span className="text-gray-500 dark:text-gray-400">Order ID</span>
      <span className="text-right text-gray-900 dark:text-white font-medium">{order.id}</span>
    </div>
    <div className="flex justify-between items-center">
      <span className="text-gray-500 dark:text-gray-400">Order Date</span>
      <span className="text-right text-gray-900 dark:text-white font-medium">{order.date}</span>
    </div>
    <div className="flex justify-between items-center">
      <span className="text-gray-500 dark:text-gray-400">Status</span>
      <span className="text-right"><OrderStatusBadge status={order.status} /></span>
    </div>
    <div className="flex justify-between items-center">
      <span className="text-gray-500 dark:text-gray-400">Payment Method</span>
      <span className="text-right text-gray-900 dark:text-white font-medium">{order.paymentMethod}</span>
    </div>
    <div className="flex justify-between items-center">
      <span className="text-gray-500 dark:text-gray-400">Order Type</span>
      <span className="text-right text-gray-900 dark:text-white font-medium">Online</span>
    </div>
  </div>
</div>

                      {/* 2. Customer Info */}
                      <div className="bg-gray-100 dark:bg-white/5 p-4 rounded-xl">
  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Customer Information</h3>
  <div className="text-sm space-y-2 text-gray-600 dark:text-gray-300">
    <div className="flex justify-between items-center">
      <span className="text-gray-500 dark:text-gray-400">Name</span>
      <span className="text-right text-gray-900 dark:text-white font-medium">{order.customer}</span>
    </div>
    <div className="flex justify-between items-center">
      <span className="text-gray-500 dark:text-gray-400">Email</span>
      <span className="text-right text-gray-900 dark:text-white font-medium">john.smith@example.com</span>
    </div>
    <div className="flex justify-between items-center">
      <span className="text-gray-500 dark:text-gray-400">Phone</span>
      <span className="text-right text-gray-900 dark:text-white font-medium">+1 (555) 123-4567</span>
    </div>
    <div className="flex justify-between items-center">
      <span className="text-gray-500 dark:text-gray-400">Address</span>
      <span className="text-right text-gray-900 dark:text-white font-medium">123 Main St, SF</span>
    </div>
  </div>
</div>

                      {/* 3. Products */}
                      <div className="bg-gray-100 dark:bg-white/5 text-gray-800 dark:text-gray-300 p-6 rounded-xl col-span-1 md:col-span-2 xl:col-span-1">
  <h3 className="text-sm font-semibold text-gray-700 dark:text-white mb-4">Products</h3>

  <div className="space-y-6">
    {order.products.map((product, i) => (
      <div key={i} className="border-b border-gray-200 dark:border-white/10 pb-4 last:border-none last:pb-0">
        <div className="flex justify-between items-start">
          <div>
            <div className="text-base font-medium text-gray-900 dark:text-white">{product.name}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">{product.specs}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Qty: {product.qty}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Unit Price: ${product.price.toFixed(2)}</div>
          </div>
          <div className="text-right text-gray-900 dark:text-white font-semibold">
            ${(product.price * product.qty).toFixed(2)}
          </div>
        </div>
      </div>
    ))}
  </div>

  <hr className="border-gray-300 dark:border-white/10 my-5" />

  {/* Totals */}
  <div className="space-y-2 text-sm">
    <div className="flex justify-between">
      <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
      <span className="text-gray-900 dark:text-white">
        ${order.products.reduce((acc, p) => acc + p.qty * p.price, 0).toFixed(2)}
      </span>
    </div>
    <div className="flex justify-between">
      <span className="text-gray-600 dark:text-gray-400">Shipping</span>
      <span className="text-gray-900 dark:text-white">$0.00</span>
    </div>
    <div className="flex justify-between">
      <span className="text-gray-600 dark:text-gray-400">Tax</span>
      <span className="text-gray-900 dark:text-white">$104.91</span>
    </div>
    <div className="flex justify-between font-semibold text-base pt-3">
      <span className="text-gray-900 dark:text-white">Total</span>
      <span className="text-gray-900 dark:text-white">
        ${(
          order.products.reduce((acc, p) => acc + p.qty * p.price, 0) + 104.91
        ).toFixed(2)}
      </span>
    </div>
  </div>
</div>



                      {/* 4. Shipping Info */}
                      <div className="bg-gray-100 dark:bg-white/5 p-4 rounded-xl">
  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Shipping Information</h3>
  <div className="text-sm space-y-2 text-gray-600 dark:text-gray-300">
    <div className="flex justify-between items-center">
      <span className="text-gray-500 dark:text-gray-400">Carrier</span>
      <span className="text-right text-gray-900 dark:text-white font-medium">UPS</span>
    </div>
    <div className="flex justify-between items-center">
      <span className="text-gray-500 dark:text-gray-400">Tracking #</span>
      <span className="text-right text-gray-900 dark:text-white font-medium">UP39285917364</span>
    </div>
    <div className="flex justify-between items-center">
      <span className="text-gray-500 dark:text-gray-400">Method</span>
      <span className="text-right text-gray-900 dark:text-white font-medium">Express</span>
    </div>
    <div className="flex justify-between items-center">
      <span className="text-gray-500 dark:text-gray-400">ETA</span>
      <span className="text-right text-gray-900 dark:text-white font-medium">Apr 05, 2025</span>
    </div>
    <div className="flex justify-between items-center">
      <span className="text-gray-500 dark:text-gray-400">Delivered</span>
      <span className="text-right text-gray-900 dark:text-white font-medium">Apr 04, 2025</span>
    </div>
  </div>
</div>

                      {/* 5. Fulfillment Timeline */}
<div className="bg-gray-100 dark:bg-white/5 p-4 rounded-xl">
  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
    Fulfillment Timeline
  </h3>

  {(() => {
    // Define dynamic steps based on order status
    let steps: { label: string; date: string; complete: boolean; cancelled?: boolean }[] = [];

    if (order.status === 'Delivered') {
      steps = [
        { label: 'Order Placed', date: order.date, complete: true },
        { label: 'Payment Confirmed', date: order.date, complete: true },
        { label: 'Delivered', date: 'Apr 04', complete: true },
      ];
    } else if (order.status === 'Pending') {
      steps = [
        { label: 'Order Placed', date: order.date, complete: true },
        { label: 'Payment Confirmed', date: '', complete: false },
        { label: 'Delivered', date: '', complete: false },
      ];
    } else if (order.status === 'Cancelled') {
      steps = [
        { label: 'Order Placed', date: order.date, complete: true },
        { label: 'Payment Confirmed', date: order.date, complete: true },
        { label: 'Cancelled', date: 'Apr 04', complete: false, cancelled: true },
      ];
    }

    return (
      <div className="relative pl-6">
        {steps.map((step, idx, arr) => (
          <div key={idx} className="relative pb-8">
            {idx !== arr.length - 1 && (
              <span className="absolute left-2.5 top-0 h-full w-px bg-gray-300 dark:bg-white/10" />
            )}
            <span
              className={`absolute left-0 top-0 w-3 h-3 rounded-full border-2 ${
                step.cancelled
                  ? 'bg-red-500 border-red-500'
                  : step.complete
                  ? 'bg-green-500 border-green-500'
                  : 'bg-gray-400 border-gray-400'
              }`}
            />
            <div className="ml-4">
              <p
                className={`text-sm font-medium ${
                  step.cancelled ? 'text-red-600 dark:text-red-400' : 'text-gray-800 dark:text-white'
                }`}
              >
                {step.label}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {step.date || 'Pending'}
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  })()}
</div>

                      {/* 6. Actions */}
                      <div className="bg-gray-100 dark:bg-white/5 p-4 rounded-xl flex flex-col">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Actions</h3>
                        <div className="space-y-2">
                          <button className="w-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-white py-2 px-4 rounded-xl">
                            View Invoice
                          </button>
                          <button className="w-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-white py-2 px-4 rounded-xl">
                            Print Order
                          </button>
                          <button className="w-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-white py-2 px-4 rounded-xl">
                            Update Status
                          </button>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderList;
