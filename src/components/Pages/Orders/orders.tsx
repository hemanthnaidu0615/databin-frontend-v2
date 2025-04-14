import React, { useState, useEffect } from 'react';
import { orders as allOrders, Order } from './ordersData';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { Dialog } from '@headlessui/react';
import { Paginator } from 'primereact/paginator';

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
  const [expandedOrderIds, setExpandedOrderIds] = useState<string[]>([]);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(5);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [mobileOrder, setMobileOrder] = useState<Order | null>(null);
  const [showMobileDialog, setShowMobileDialog] = useState(false);
  

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
  
      if (mobile && expandedOrderIds.length > 0 && !showMobileDialog) {
        const firstExpandedId = expandedOrderIds[0];
        const order = orders.find((o) => o.id === firstExpandedId);
        if (order) {
          setSelectedOrder(order);
          setShowMobileDialog(true);
        }
      }
    };
  
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [expandedOrderIds, orders, showMobileDialog]);
  
  

  const toggleExpand = (order: Order) => {
    if (isMobile) {
      setMobileOrder(order);
    } else {
      setExpandedOrderIds((prev) =>
        prev.includes(order.id) ? prev.filter((i) => i !== order.id) : [...prev, order.id]
      );
    }
  };

  const onPageChange = (e: { first: number; rows: number }) => {
    setFirst(e.first);
    setRows(e.rows);
    setExpandedOrderIds([]);
    setMobileOrder(null);
  };

  const paginatedOrders = orders.slice(first, first + rows);

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800 text-left">
          <thead className="bg-gray-100 dark:bg-gray-900">
            <tr className="text-left text-sm text-gray-600 dark:text-gray-300">
              <th className="py-3 px-4"></th>
              <th className="py-3 px-4">Order ID</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Product</th>
              <th className="py-3 px-4">Total</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Payment</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-800 dark:text-gray-200">
            {paginatedOrders.map((order) => (
              <React.Fragment key={order.id}>
                <tr
                  className="hover:bg-gray-50 hover:dark:bg-white/[0.05] transition-colors cursor-pointer"
                  onClick={() => toggleExpand(order)}
                >
                  <td className="py-3 px-4">
                    {expandedOrderIds.includes(order.id) ? (
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

              {expandedOrderIds.includes(order.id) && (
                <tr>
                <td colSpan={8} className="px-4 pb-6 pt-2 bg-gray-50 dark:bg-gray-950 rounded-b-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {/* Order Summary */}
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
                  </div>

                      {/* 2. Customer Info */}
                      <div className="mt-6 bg-gray-100 dark:bg-white/5 p-4 rounded-xl">
  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Customer Information</h3>
  <div className="text-sm space-y-2 text-gray-600 dark:text-gray-300">
    <div className="flex justify-between items-center">
      <span className="text-gray-500 dark:text-gray-400">Name</span>
      <span className="text-right text-gray-900 dark:text-white font-medium">{selectedOrder?.customer || 'N/A'}</span>
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


{/* Mobile Products Widget */}
<div className="bg-gray-100 dark:bg-white/5 text-gray-800 dark:text-gray-300 p-4 rounded-xl">
  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Products</h3>

  <div className="space-y-4">
    {mobileOrder?.products.map((product, i) => (
      <div
        key={i}
        className="border-b border-gray-300 dark:border-white/10 pb-3 last:pb-0 last:border-none"
      >
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {product.name}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">{product.specs}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Qty: {product.qty}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Unit Price: ${product.price.toFixed(2)}
            </div>
          </div>
          <div className="text-sm text-right font-semibold text-gray-900 dark:text-white">
            ${(product.price * product.qty).toFixed(2)}
          </div>
        </div>
      </div>
    ))}
  </div>


  {/* Totals */}
  {mobileOrder && (
  <div className="mt-6 bg-gray-100 dark:bg-white/5 text-gray-800 dark:text-gray-300 p-4 rounded-xl">
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Payment Summary</h3>
    <div className="space-y-2 text-sm">
      <div className="flex justify-between">
        <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
        <span className="text-gray-900 dark:text-white">
          ${mobileOrder.products.reduce((acc, p) => acc + p.qty * p.price, 0).toFixed(2)}
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
          ${(mobileOrder.products.reduce((acc, p) => acc + p.qty * p.price, 0) + 104.91).toFixed(2)}
        </span>
      </div>
    </div>
  </div>
)}

                      {/* 4. Shipping Info */}
                      <div className="bg-gray-100 dark:bg-white/5 p-4 rounded-xl mt-6">
  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
    Shipping Information
  </h3>
  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
    <div className="flex justify-between items-center">
      <span className="text-gray-500 dark:text-gray-400">Carrier</span>
      <span className="text-right font-medium text-gray-900 dark:text-white">UPS</span>
    </div>
    <div className="flex justify-between items-center">
      <span className="text-gray-500 dark:text-gray-400">Tracking #</span>
      <span className="text-right font-medium text-gray-900 dark:text-white">UP39285917364</span>
    </div>
    <div className="flex justify-between items-center">
      <span className="text-gray-500 dark:text-gray-400">Method</span>
      <span className="text-right font-medium text-gray-900 dark:text-white">Express</span>
    </div>
    <div className="flex justify-between items-center">
      <span className="text-gray-500 dark:text-gray-400">ETA</span>
      <span className="text-right font-medium text-gray-900 dark:text-white">Apr 05, 2025</span>
    </div>
    <div className="flex justify-between items-center">
      <span className="text-gray-500 dark:text-gray-400">Delivered</span>
      <span className="text-right font-medium text-gray-900 dark:text-white">Apr 04, 2025</span>
    </div>
  </div>
</div>

                      {/* 5. Fulfillment Timeline */}
                      <div className="bg-gray-100 dark:bg-white/5 p-4 rounded-xl">
  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Fulfillment Timeline</h3>
  <div className="relative pl-6">
    {(() => {
      let steps: { label: string; date: string; complete: boolean; cancelled?: boolean }[] = [];

      if (order.status === 'Delivered') {
        steps = [
          { label: 'Order Placed', date: order.date, complete: true },
          { label: 'Payment Confirmed', date: order.date, complete: true },
          { label: 'Delivered', date: 'Apr 04, 2025', complete: true },
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
          { label: 'Cancelled', date: 'Apr 04, 2025', complete: false, cancelled: true },
        ];
      }

      return (
        <div className="space-y-6">
          {steps.map((step, idx, arr) => (
            <div key={idx} className="relative">
              {idx !== arr.length - 1 && (
                <span className="absolute left-1.5 top-3 h-full w-px bg-gray-300 dark:bg-white/10" />
              )}
              <span
                className={`absolute left-0 top-1.5 w-3 h-3 rounded-full border-2 ${
                  step.cancelled
                    ? 'bg-red-500 border-red-500'
                    : step.complete
                    ? 'bg-green-500 border-green-500'
                    : 'bg-gray-400 border-gray-400'
                }`}
              />
              <div className="ml-6">
                <p
                  className={`text-sm font-medium ${
                    step.cancelled ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'
                  }`}
                >
                  {step.label}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">{step.date || 'Pending'}</p>
              </div>
            </div>
          ))}
        </div>
      );
    })()}
  </div>
</div>


                      {/* 6. Actions */}
{/* 6. Actions */}
<div className="bg-gray-100 dark:bg-white/5 p-4 rounded-xl flex flex-col mt-6">
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

       {/* Paginator */}
       <div className="p-4 bg-white dark:bg-gray-900 rounded-b-lg">
  {/* Full paginator for screens >= sm */}
  <div className="hidden sm:block dark:text-gray-100 
                  [&_.p-paginator]:bg-white 
                  [&_.p-paginator]:dark:bg-gray-900 
                  [&_.p-paginator]:border-none">
    <Paginator
      first={first}
      rows={rows}
      totalRecords={orders.length}
      onPageChange={onPageChange}
      rowsPerPageOptions={[5, 10, 20]}
      template="RowsPerPageDropdown CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
      currentPageReportTemplate="Showing {first} to {last} of {totalRecords} orders"
      className="dark:text-gray-100 dark:bg-gray-900"
    />
  </div>

  {/* Simple pagination for mobile (smaller than sm) */}
  <div className="flex items-center justify-between sm:hidden text-sm text-gray-700 dark:text-gray-100">
    <button 
      onClick={() => onPageChange({ first: first - rows, rows })}
      disabled={first === 0}
      className="px-3 py-1 rounded disabled:opacity-50 dark:bg-gray-800 bg-gray-100"
    >
      Prev
    </button>
    <span>
      Page {first / rows + 1} of {Math.ceil(orders.length / rows)}
    </span>
    <button 
      onClick={() => onPageChange({ first: first + rows, rows })}
      disabled={first + rows >= orders.length}
      className="px-3 py-1 rounded disabled:opacity-50 dark:bg-gray-800 bg-gray-100"
    >
      Next
    </button>
  </div>

  <Dialog open={!!mobileOrder} onClose={() => setMobileOrder(null)} className="relative z-50">
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
  <div className="fixed inset-0 flex items-end justify-center sm:items-center p-4">
    <Dialog.Panel className="w-full max-w-md bg-white dark:bg-gray-900 rounded-t-2xl sm:rounded-xl shadow-xl p-4 max-h-[90vh] overflow-y-auto">
      {mobileOrder && (
        <>
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            Order #{mobileOrder.id}
          </h2>

          {/* Order Summary */}
          <div className="bg-gray-100 dark:bg-white/5 p-4 rounded-xl">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Order Summary</h3>
            <div className="text-sm space-y-2 text-gray-600 dark:text-gray-300">
              <div className="flex justify-between items-center">
                <span className="text-gray-500 dark:text-gray-400">Order ID</span>
                <span className="text-right font-medium text-gray-900 dark:text-white">{mobileOrder.id}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 dark:text-gray-400">Order Date</span>
                <span className="text-right font-medium text-gray-900 dark:text-white">{mobileOrder.date}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 dark:text-gray-400">Status</span>
                <span className="text-right"><OrderStatusBadge status={mobileOrder.status} /></span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 dark:text-gray-400">Payment Method</span>
                <span className="text-right font-medium text-gray-900 dark:text-white">{mobileOrder.paymentMethod}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 dark:text-gray-400">Order Type</span>
                <span className="text-right font-medium text-gray-900 dark:text-white">Online</span>
              </div>
            </div>
          </div>

          {/* Customer Info */}
          <div className="mt-6 bg-gray-100 dark:bg-white/5 p-4 rounded-xl">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Customer Information</h3>
            <div className="text-sm space-y-2 text-gray-600 dark:text-gray-300">
              <div className="flex justify-between items-center">
                <span className="text-gray-500 dark:text-gray-400">Name</span>
                <span className="text-right font-medium text-gray-900 dark:text-white">{mobileOrder.customer}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 dark:text-gray-400">Email</span>
                <span className="text-right font-medium text-gray-900 dark:text-white">john.smith@example.com</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 dark:text-gray-400">Phone</span>
                <span className="text-right font-medium text-gray-900 dark:text-white">+1 (555) 123-4567</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 dark:text-gray-400">Address</span>
                <span className="text-right font-medium text-gray-900 dark:text-white">123 Main St, SF</span>
              </div>
            </div>
          </div>

          {/* Products */}
          <div className="mt-6 bg-gray-100 dark:bg-white/5 p-4 rounded-xl">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Products</h3>
            <div className="space-y-4 text-sm text-gray-600 dark:text-gray-300">
              {mobileOrder.products.map((product, i) => (
                <div
                  key={i}
                  className="flex justify-between border-b border-gray-200 dark:border-white/10 pb-4 last:border-none last:pb-0"
                >
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">{product.name}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{product.specs}</div>
                    <div className="text-xs mt-1 text-gray-500 dark:text-gray-400">Qty: {product.qty}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Unit Price: ${product.price.toFixed(2)}</div>
                  </div>
                  <div className="text-right font-semibold text-gray-900 dark:text-white">
                    ${(product.price * product.qty).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Summary */}
          <div className="mt-6 bg-gray-100 dark:bg-white/5 p-4 rounded-xl">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Payment Summary</h3>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Subtotal</span>
                <span className="text-gray-900 dark:text-white">
                  ${mobileOrder.products.reduce((acc, p) => acc + p.qty * p.price, 0).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Shipping</span>
                <span className="text-gray-900 dark:text-white">$0.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Tax</span>
                <span className="text-gray-900 dark:text-white">$104.91</span>
              </div>
              <div className="flex justify-between font-semibold text-base pt-3">
                <span className="text-gray-900 dark:text-white">Total</span>
                <span className="text-gray-900 dark:text-white">
                  ${(mobileOrder.products.reduce((acc, p) => acc + p.qty * p.price, 0) + 104.91).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Shipping Info */}
          <div className="mt-6 bg-gray-100 dark:bg-white/5 p-4 rounded-xl">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Shipping Information</h3>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <div className="flex justify-between items-center">
                <span className="text-gray-500 dark:text-gray-400">Carrier</span>
                <span className="text-right font-medium text-gray-900 dark:text-white">UPS</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 dark:text-gray-400">Tracking #</span>
                <span className="text-right font-medium text-gray-900 dark:text-white">UP39285917364</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 dark:text-gray-400">Method</span>
                <span className="text-right font-medium text-gray-900 dark:text-white">Express</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 dark:text-gray-400">ETA</span>
                <span className="text-right font-medium text-gray-900 dark:text-white">Apr 05, 2025</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 dark:text-gray-400">Delivered</span>
                <span className="text-right font-medium text-gray-900 dark:text-white">Apr 04, 2025</span>
              </div>
            </div>
          </div>

          {/* Fulfillment Timeline */}
<div className="mt-6 bg-gray-100 dark:bg-white/5 p-4 rounded-xl">
  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
    Fulfillment Timeline
  </h3>
  <div className="relative pl-6">
    {(() => {
      let steps: { label: string; date: string; complete: boolean; cancelled?: boolean }[] = [];

      if (mobileOrder?.status === 'Delivered') {
        steps = [
          { label: 'Order Placed', date: mobileOrder.date, complete: true },
          { label: 'Payment Confirmed', date: mobileOrder.date, complete: true },
          { label: 'Delivered', date: 'Apr 04', complete: true },
        ];
      } else if (mobileOrder?.status === 'Pending') {
        steps = [
          { label: 'Order Placed', date: mobileOrder.date, complete: true },
          { label: 'Payment Confirmed', date: '', complete: false },
          { label: 'Delivered', date: '', complete: false },
        ];
      } else if (mobileOrder?.status === 'Cancelled') {
        steps = [
          { label: 'Order Placed', date: mobileOrder.date, complete: true },
          { label: 'Payment Confirmed', date: mobileOrder.date, complete: true },
          { label: 'Cancelled', date: 'Apr 04', complete: false, cancelled: true },
        ];
      }

      return steps.map((step, idx, arr) => (
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
      ));
    })()}
  </div>
</div>

{/* 6. Actions */}
<div className="mt-6 bg-gray-100 dark:bg-white/5 p-4 rounded-xl">
  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Actions</h3>
  <div className="flex flex-col gap-2">
    <button
      className="w-full rounded-xl px-4 py-2 bg-white text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 transition-colors"
    >
      View Invoice
    </button>
    <button
      className="w-full rounded-xl px-4 py-2 bg-white text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 transition-colors"
    >
      Print Order
    </button>
    <button
      className="w-full rounded-xl px-4 py-2 bg-white text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 transition-colors"
    >
      Update Status
    </button>
  </div>
</div>



        </>
      )}
    </Dialog.Panel>
  </div>
</Dialog>



       </div>
    </div>
    </>
  );
};

export default OrderList;
