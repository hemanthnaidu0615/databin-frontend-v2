import React, { useState, useEffect, useCallback } from "react";
import { Order } from "./ordersData";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { Dialog } from "@headlessui/react";
import { Paginator } from "primereact/paginator";
import { useSelector } from "react-redux";

export const fetchOrderDetails = async (
  orderId: string
): Promise<any | null> => {
  try {
    const response = await fetch(
      `http://localhost:8080/api/orders/${orderId}/details`
    );
    const data = await response.json();

    if (typeof data.value === "string") {
      return JSON.parse(data.value);
    }

    return data.value ?? null;
  } catch (error) {
    console.error(`Error fetching details for order ${orderId}:`, error);
    return null;
  }
};

function cleanAndFormatPhoneNumber(rawPhone: string): string {
  const digitsOnly = rawPhone.split(/[xX]|ext/)[0].replace(/[^\d]/g, "");

  const normalized = digitsOnly.length === 10 ? "1" + digitsOnly : digitsOnly;

  if (/^1\d{10}$/.test(normalized)) {
    const country = "+1";
    const area = normalized.slice(1, 4);
    const middle = normalized.slice(4, 7);
    const last = normalized.slice(7, 11);
    return `${country} (${area}) ${middle}-${last}`;
  }

  return rawPhone;
}
function convertToUSD(rupees: number): number {
  const exchangeRate = 0.012;
  return rupees * exchangeRate;
}

function formatUSD(amount: number): string {
  const usdAmount = convertToUSD(amount);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(usdAmount);
}

interface Props {
  orders?: Order[];
}

const statusColors: Record<string, string> = {
  Delivered: "bg-green-600",
  "In Transit": "bg-yellow-500",
  Delayed: "bg-red-600",
};

const OrderStatusBadge: React.FC<{ status: Order["status"] }> = ({
  status,
}) => {
  return (
    <span
      className={`inline-block px-2 py-1 text-xs rounded-full text-white ${statusColors[status]}`}
    >
      {status}
    </span>
  );
};

const OrderList: React.FC<Props> = ({ orders = [] }) => {
  const [expandedOrderIds, setExpandedOrderIds] = useState<string[]>([]);
  const [first, setFirst] = useState(0); // First item on the page
  const [rows, setRows] = useState(20); // Number of rows per page (default to 20)
  const [isMobile, setIsMobile] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [mobileOrder, setMobileOrder] = useState<Order | null>(null);
  const [showMobileDialog, setShowMobileDialog] = useState(false);
  const [orderDetails, setOrderDetails] = useState<Map<string, any>>(new Map());
  const [loadingOrderDetails, setLoadingOrderDetails] = useState<
    Map<string, boolean>
  >(new Map());

  const dateRange = useSelector((state: any) => state.dateRange.dates);
  const [startDate, endDate] = dateRange;

  const fetchAndSetDetails = useCallback(
    (orderId: string) => {
      if (orderDetails.has(orderId) || loadingOrderDetails.get(orderId)) return;

      setLoadingOrderDetails((prev) => new Map(prev).set(orderId, true));

      fetchOrderDetails(orderId).then((details) => {
        if (details) {
          setOrderDetails((prev) => new Map(prev).set(orderId, details));
        }
        setLoadingOrderDetails((prev) => new Map(prev).set(orderId, false));
      });
    },
    [orderDetails, loadingOrderDetails]
  );

  const toggleExpand = (order: Order) => {
    if (isMobile) {
      setSelectedOrder(order);
      setMobileOrder(order);
    } else {
      setExpandedOrderIds((prev) =>
        prev.includes(order.id)
          ? prev.filter((i) => i !== order.id)
          : [...prev, order.id]
      );

      if (!expandedOrderIds.includes(order.id) && !orderDetails.has(order.id)) {
        fetchAndSetDetails(order.id);
      }
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
              <th className="py-3 px-4 hidden md:table-cell">Date</th>
              <th className="py-3 px-4 hidden md:table-cell">Customer</th>
              <th className="py-3 px-4 hidden md:table-cell">Product</th>
              <th className="py-3 px-4 hidden md:table-cell">Total</th>
              <th className="py-3 px-4 hidden md:table-cell">Status</th>
              <th className="py-3 px-4 hidden md:table-cell">Payment</th>
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
                  <td className="py-3 px-4 hidden md:table-cell">
                    {order.date}
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell">
                    {order.customer}
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell">
                    {order.product}
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell">
                    {formatUSD(order.total)}
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell">
                    <OrderStatusBadge status={order.status} />
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell">
                    {order.paymentMethod}
                  </td>
                </tr>

                {expandedOrderIds.includes(order.id) && (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-4 pb-6 pt-2 bg-gray-50 dark:bg-gray-950 rounded-b-lg"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {/* 1. Order Summary */}
                        <div className="bg-gray-100 dark:bg-white/5 p-4 rounded-xl">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                            Order Summary
                          </h3>
                          <div className="text-sm space-y-2 text-gray-600 dark:text-gray-300">
                            <div className="flex justify-between items-center">
                              <span className="text-gray-500 dark:text-gray-400">
                                Order ID
                              </span>
                              <span className="text-right text-gray-900 dark:text-white font-medium">
                                {order.id}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-500 dark:text-gray-400">
                                Order Date
                              </span>
                              <span className="text-right text-gray-900 dark:text-white font-medium">
                                {order.date}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-500 dark:text-gray-400">
                                Status
                              </span>
                              <span className="text-right">
                                <OrderStatusBadge status={order.status} />
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-500 dark:text-gray-400">
                                Payment Method
                              </span>
                              <span className="text-right text-gray-900 dark:text-white font-medium">
                                {order.paymentMethod}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-500 dark:text-gray-400">
                                Order Type
                              </span>
                              <span className="text-right text-gray-900 dark:text-white font-medium">
                                {orderDetails.get(order.id)?.order_summary
                                  ?.order_type ?? "N/A"}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* 2. Customer Information */}
                        <div className="hidden md:block bg-gray-100 dark:bg-white/5 p-4 rounded-xl">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                            Customer Information
                          </h3>
                          <div className="text-sm space-y-2 text-gray-600 dark:text-gray-300">
                            <div className="flex justify-between items-center">
                              <span className="text-gray-500 dark:text-gray-400">
                                Name
                              </span>
                              <span className="text-right text-gray-900 dark:text-white font-medium">
                                {order.customer}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-500 dark:text-gray-400">
                                Email
                              </span>
                              <span className="text-right text-gray-900 dark:text-white font-medium">
                                {orderDetails.get(order.id)?.customer_info
                                  ?.email ?? "N/A"}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-500 dark:text-gray-400">
                                Phone
                              </span>
                              <span className="text-right text-gray-900 dark:text-white font-medium">
                                {cleanAndFormatPhoneNumber(
                                  orderDetails.get(order.id)?.customer_info
                                    ?.phone ?? ""
                                ) || "N/A"}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-500 dark:text-gray-400">
                                Address
                              </span>
                              <span className="text-right text-gray-900 dark:text-white font-medium">
                                {orderDetails.get(order.id)?.customer_info
                                  ?.address ?? "N/A"}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Products Section */}
                        <div className="hidden md:block bg-gray-100 dark:bg-white/5 text-gray-800 dark:text-gray-300 p-6 rounded-xl col-span-1">
                          <h3 className="text-sm font-semibold text-gray-700 dark:text-white mb-4">
                            Products
                          </h3>

                          <div className="space-y-6">
                            {(
                              orderDetails.get(order.id)?.products ||
                              order.products ||
                              []
                            ).map((product: any, i: number) => {
                              const quantity = product.quantity ?? product.qty;
                              const unitPrice =
                                product.unit_price ?? product.price;
                              const totalPrice = quantity * unitPrice;

                              return (
                                <div
                                  key={i}
                                  className="border-b border-gray-200 dark:border-white/10 pb-4 last:border-none last:pb-0"
                                >
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <div className="text-base font-medium text-gray-900 dark:text-white">
                                        {product.name}
                                      </div>
                                      <div className="text-sm text-gray-600 dark:text-gray-400">
                                        {product.category ||
                                          product.specs ||
                                          ""}
                                      </div>
                                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                        Qty: {quantity}
                                      </div>
                                      <div className="text-xs text-gray-600 dark:text-gray-400">
                                        Unit Price: {formatUSD(unitPrice)}
                                      </div>
                                    </div>
                                    <div className="text-right text-gray-900 dark:text-white font-semibold">
                                      {formatUSD(totalPrice)}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          <hr className="border-gray-300 dark:border-white/10 my-5" />

                          {/* Totals */}
                          <div className="hidden md:block space-y-2 text-sm">
                            {(() => {
                              const products =
                                orderDetails.get(order.id)?.products ||
                                order.products ||
                                [];

                              const subtotal = products.reduce(
                                (acc: number, p: any) =>
                                  acc +
                                  (p.quantity ?? p.qty) *
                                    (p.unit_price ?? p.price),
                                0
                              );

                              const shipping = products.reduce(
                                (acc: number, p: any) =>
                                  acc + (p.shipping ?? 0),
                                0
                              );
                              const tax = products.reduce(
                                (acc: number, p: any) => acc + (p.tax ?? 0),
                                0
                              );
                              const total =
                                products.reduce(
                                  (acc: number, p: any) => acc + (p.total ?? 0),
                                  0
                                ) || subtotal + shipping + tax;

                              return (
                                <>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">
                                      Subtotal
                                    </span>
                                    <span className="text-gray-900 dark:text-white">
                                      {formatUSD(subtotal)}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">
                                      Shipping
                                    </span>
                                    <span className="text-gray-900 dark:text-white">
                                      {formatUSD(shipping)}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">
                                      Tax
                                    </span>
                                    <span className="text-gray-900 dark:text-white">
                                      {formatUSD(tax)}
                                    </span>
                                  </div>
                                  <div className="flex justify-between font-semibold text-base pt-3">
                                    <span className="text-gray-900 dark:text-white">
                                      Total
                                    </span>
                                    <span className="text-gray-900 dark:text-white">
                                      {formatUSD(total)}
                                    </span>
                                  </div>
                                </>
                              );
                            })()}
                          </div>
                        </div>

                        {/* 4. Shipping Information */}
                        <div className="bg-gray-100 dark:bg-white/5 p-4 rounded-xl">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                            Shipping Information
                          </h3>
                          <div className="text-sm space-y-2 text-gray-600 dark:text-gray-300">
                            <div className="flex justify-between items-center">
                              <span className="text-gray-500 dark:text-gray-400">
                                Carrier
                              </span>
                              <span className="text-right text-gray-900 dark:text-white font-medium">
                                {orderDetails.get(order.id)?.shipping_info
                                  ?.carrier ?? "N/A"}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-500 dark:text-gray-400">
                                Tracking #
                              </span>
                              <span className="text-right text-gray-900 dark:text-white font-medium">
                                {orderDetails.get(order.id)?.shipping_info
                                  ?.tracking_id ?? "N/A"}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-500 dark:text-gray-400">
                                Method
                              </span>
                              <span className="text-right text-gray-900 dark:text-white font-medium">
                                {orderDetails.get(order.id)?.shipping_info
                                  ?.method ?? "N/A"}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-500 dark:text-gray-400">
                                ETA
                              </span>
                              <span className="text-right text-gray-900 dark:text-white font-medium">
                                {orderDetails.get(order.id)?.shipping_info
                                  ?.eta ?? "N/A"}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-500 dark:text-gray-400">
                                Delivered
                              </span>
                              <span className="text-right text-gray-900 dark:text-white font-medium">
                                {orderDetails.get(order.id)?.shipping_info
                                  ?.delivered ?? "N/A"}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* 5. Fulfillment Timeline */}
                        <div className="bg-gray-100 dark:bg-white/5 p-4 rounded-xl">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Fulfillment Timeline
                          </h3>

                          {(() => {
                            let steps: {
                              label: string;
                              date: string;
                              complete: boolean;
                              Delayed?: boolean;
                            }[] = [];

                            if (order.status === "Delivered") {
                              steps = [
                                {
                                  label: "Order Placed",
                                  date: order.date,
                                  complete: true,
                                },
                                {
                                  label: "Payment Confirmed",
                                  date: order.date,
                                  complete: true,
                                },
                                {
                                  label: "Delivered",
                                  date: "Apr 04",
                                  complete: true,
                                },
                              ];
                            } else if (order.status === "In Transit") {
                              steps = [
                                {
                                  label: "Order Placed",
                                  date: order.date,
                                  complete: true,
                                },
                                {
                                  label: "Payment Confirmed",
                                  date: "",
                                  complete: true,
                                },
                                {
                                  label: "Delivered",
                                  date: "",
                                  complete: false,
                                },
                              ];
                            } else if (order.status === "Delayed") {
                              steps = [
                                {
                                  label: "Order Placed",
                                  date: order.date,
                                  complete: true,
                                },
                                {
                                  label: "Payment Confirmed",
                                  date: order.date,
                                  complete: true,
                                },
                                {
                                  label: "Delayed",
                                  date: "Apr 04",
                                  complete: false,
                                  Delayed: true,
                                },
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
                                        step.Delayed
                                          ? "bg-red-500 border-red-500"
                                          : step.complete
                                          ? "bg-green-500 border-green-500"
                                          : "bg-gray-400 border-gray-400"
                                      }`}
                                    />
                                    <div className="ml-4">
                                      <p
                                        className={`text-sm font-medium ${
                                          step.Delayed
                                            ? "text-red-600 dark:text-red-400"
                                            : "text-gray-800 dark:text-white"
                                        }`}
                                      >
                                        {step.label}
                                      </p>
                                      <p className="text-xs text-gray-600 dark:text-gray-400">
                                        {step.date || "In Transit"}
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
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                            Actions
                          </h3>
                          <div className="space-y-2">
                            <button className="w-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-white py-2 px-4 rounded-xl">
                              View Invoice
                            </button>
                            <button className="w-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-white py-2 px-4 rounded-xl">
                              Print Order
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
          <div
            className="hidden sm:block dark:text-gray-100 
                  [&_.p-paginator]:bg-white 
                  [&_.p-paginator]:dark:bg-gray-900 
                  [&_.p-paginator]:border-none"
          >
            <Paginator
              first={first}
              rows={rows}
              totalRecords={orders.length}
              onPageChange={onPageChange}
              rowsPerPageOptions={[20, 50, 100]}
              template="RowsPerPageDropdown CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
              currentPageReportTemplate="Showing {first} to {last} of {totalRecords} orders"
              className="dark:text-gray-100 dark:bg-gray-900"
            />
          </div>

          {/* Custom Simple Pagination for Mobile (smaller than sm) */}
<div className="flex flex-col sm:flex-row sm:items-center justify-between sm:hidden text-sm text-gray-700 dark:text-gray-100">
  {/* Rows per page dropdown */}
  <div className="flex items-center gap-2">
    <label htmlFor="mobileRows" className="whitespace-nowrap">Rows per page:</label>
    <select
      id="mobileRows"
      value={rows}
      onChange={(e) => {
        setRows(Number(e.target.value));
        setFirst(0); // reset to first page
      }}
      className="px-2 py-1 rounded dark:bg-gray-800 bg-gray-100 dark:text-white text-gray-800"
    >
      {[5, 10, 20, 50].map((option) => (
        <option key={option} value={option}>{option}</option>
      ))}
    </select>
  </div>

  {/* Pagination controls */}
  <div className="flex w-full sm:w-auto justify-between items-center">
    {/* Left - Prev */}
    <button
      onClick={() => onPageChange({ first: Math.max(0, first - rows), rows })}
              
              disabled={first === 0}
              className="px-3 py-1 rounded dark:bg-gray-800 bg-gray-100 disabled:opacity-50"
              >
              Prev
            </button>
            {/* Center - Page Indicator */}
    <div className="text-center flex-1 text-sm">
      Page {Math.floor(first / rows) + 1} of {Math.ceil(orders.length / rows)}
    </div>

    {/* Right - Next */}
    <button
      onClick={() => onPageChange({ first: first + rows < orders.length ? first + rows : first, rows })}
              disabled={first + rows >= orders.length}
              className="px-3 py-1 rounded dark:bg-gray-800 bg-gray-100 disabled:opacity-50"
              >
              Next
            </button>
          </div>
          </div>

          <Dialog
            open={!!mobileOrder}
            onClose={() => setMobileOrder(null)}
            className="relative z-50"
          >
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
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                        Order Summary
                      </h3>
                      <div className="text-sm space-y-2 text-gray-600 dark:text-gray-300">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500 dark:text-gray-400">
                            Order ID
                          </span>
                          <span className="text-right font-medium text-gray-900 dark:text-white">
                            {mobileOrder.id}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500 dark:text-gray-400">
                            Order Date
                          </span>
                          <span className="text-right font-medium text-gray-900 dark:text-white">
                            {mobileOrder.date}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500 dark:text-gray-400">
                            Status
                          </span>
                          <span className="text-right">
                            <OrderStatusBadge status={mobileOrder.status} />
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500 dark:text-gray-400">
                            Payment Method
                          </span>
                          <span className="text-right font-medium text-gray-900 dark:text-white">
                            {mobileOrder.paymentMethod}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500 dark:text-gray-400">
                            Order Type
                          </span>
                          <span className="text-right font-medium text-gray-900 dark:text-white">
                            Online
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Customer Info */}
                    <div className="block md:hidden mt-6 bg-gray-100 dark:bg-white/5 p-4 rounded-xl">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                        Customer Information
                      </h3>
                      <div className="text-sm space-y-2 text-gray-600 dark:text-gray-300">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500 dark:text-gray-400">
                            Name
                          </span>
                          <span className="text-right font-medium text-gray-900 dark:text-white">
                            {mobileOrder?.customer || "N/A"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500 dark:text-gray-400">
                            Email
                          </span>
                          <span className="text-right font-medium text-gray-900 dark:text-white">
                            {orderDetails.get(mobileOrder.id)?.customer_info
                              ?.email ?? "N/A"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500 dark:text-gray-400">
                            Phone
                          </span>
                          <span className="text-right font-medium text-gray-900 dark:text-white">
                            {cleanAndFormatPhoneNumber(
                              orderDetails.get(mobileOrder.id)?.customer_info
                                ?.phone ?? ""
                            ) || "N/A"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500 dark:text-gray-400">
                            Address
                          </span>
                          <span className="text-right font-medium text-gray-900 dark:text-white">
                            {orderDetails.get(mobileOrder.id)?.customer_info
                              ?.address ?? "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Products */}
                    <div className="mt-6 bg-gray-100 dark:bg-white/5 p-4 rounded-xl">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                        Products
                      </h3>
                      <div className="space-y-4 text-sm text-gray-600 dark:text-gray-300">
                        {mobileOrder.products.map((product, i) => (
                          <div
                            key={i}
                            className="flex justify-between border-b border-gray-200 dark:border-white/10 pb-4 last:border-none last:pb-0"
                          >
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white">
                                {product.name}
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                {product.specs}
                              </div>
                              <div className="text-xs mt-1 text-gray-500 dark:text-gray-400">
                                Qty: {product.qty}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                Unit Price: ${product.price.toFixed(2)}
                              </div>
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
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                        Payment Summary
                      </h3>
                      <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">
                            Subtotal
                          </span>
                          <span className="text-gray-900 dark:text-white">
                            $
                            {mobileOrder.products
                              .reduce((acc, p) => acc + p.qty * p.price, 0)
                              .toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">
                            Shipping
                          </span>
                          <span className="text-gray-900 dark:text-white">
                            $0.00
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">
                            Tax
                          </span>
                          <span className="text-gray-900 dark:text-white">
                            $104.91
                          </span>
                        </div>
                        <div className="flex justify-between font-semibold text-base pt-3">
                          <span className="text-gray-900 dark:text-white">
                            Total
                          </span>
                          <span className="text-gray-900 dark:text-white">
                            $
                            {(
                              mobileOrder.products.reduce(
                                (acc, p) => acc + p.qty * p.price,
                                0
                              ) + 104.91
                            ).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Shipping Info */}
                    <div className="mt-6 bg-gray-100 dark:bg-white/5 p-4 rounded-xl">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                        Shipping Information
                      </h3>
                      <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500 dark:text-gray-400">
                            Carrier
                          </span>
                          <span className="text-right font-medium text-gray-900 dark:text-white">
                            UPS
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500 dark:text-gray-400">
                            Tracking #
                          </span>
                          <span className="text-right font-medium text-gray-900 dark:text-white">
                            UP39285917364
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500 dark:text-gray-400">
                            Method
                          </span>
                          <span className="text-right font-medium text-gray-900 dark:text-white">
                            Express
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500 dark:text-gray-400">
                            ETA
                          </span>
                          <span className="text-right font-medium text-gray-900 dark:text-white">
                            Apr 05, 2025
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500 dark:text-gray-400">
                            Delivered
                          </span>
                          <span className="text-right font-medium text-gray-900 dark:text-white">
                            Apr 04, 2025
                          </span>
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
                          const status = mobileOrder?.status;
                          const orderDate = mobileOrder?.date || "N/A";

                          let steps: {
                            label: string;
                            date: string;
                            complete: boolean;
                            Delayed?: boolean;
                          }[] = [];

                          if (status === "Delivered") {
                            steps = [
                              {
                                label: "Order Placed",
                                date: orderDate,
                                complete: true,
                              },
                              {
                                label: "Payment Confirmed",
                                date: orderDate,
                                complete: true,
                              },
                              {
                                label: "Delivered",
                                date: "Apr 04, 2025",
                                complete: true,
                              },
                            ];
                          } else if (status === "In Transit") {
                            steps = [
                              {
                                label: "Order Placed",
                                date: orderDate,
                                complete: true,
                              },
                              {
                                label: "Payment Confirmed",
                                date: "",
                                complete: false,
                              },
                              { label: "Delivered", date: "", complete: false },
                            ];
                          } else if (status === "Delayed") {
                            steps = [
                              {
                                label: "Order Placed",
                                date: orderDate,
                                complete: true,
                              },
                              {
                                label: "Payment Confirmed",
                                date: orderDate,
                                complete: true,
                              },
                              {
                                label: "Delayed",
                                date: "Apr 04, 2025",
                                complete: false,
                                Delayed: true,
                              },
                            ];
                          }

                          return steps.map((step, idx) => (
                            <div key={idx} className="relative pb-8">
                              {idx !== steps.length - 1 && (
                                <span className="absolute left-2.5 top-0 h-full w-px bg-gray-300 dark:bg-white/10" />
                              )}
                              <span
                                className={`absolute left-0 top-0 w-3 h-3 rounded-full border-2 ${
                                  step.Delayed
                                    ? "bg-red-500 border-red-500"
                                    : step.complete
                                    ? "bg-green-500 border-green-500"
                                    : "bg-gray-400 border-gray-400"
                                }`}
                              />
                              <div className="ml-4">
                                <p
                                  className={`text-sm font-medium ${
                                    step.Delayed
                                      ? "text-red-600 dark:text-red-400"
                                      : "text-gray-800 dark:text-white"
                                  }`}
                                >
                                  {step.label}
                                </p>
                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                  {step.date ||
                                    (step.Delayed ? "Delayed" : "In Progress")}
                                </p>
                              </div>
                            </div>
                          ));
                        })()}
                      </div>
                    </div>

                    {/* 6. Actions */}
                    <div className="mt-6 bg-gray-100 dark:bg-white/5 p-4 rounded-xl">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Actions
                      </h3>
                      <div className="flex flex-col gap-2">
                        <button className="w-full rounded-xl px-4 py-2 bg-white text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 transition-colors">
                          View Invoice
                        </button>
                        <button className="w-full rounded-xl px-4 py-2 bg-white text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 transition-colors">
                          Print Order
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {/* Optional Close Button at bottom */}
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setMobileOrder(null)}
                    className="rounded-xl px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 text-sm font-medium text-gray-800 dark:text-white transition"
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </div>
          </Dialog>
        </div>
      </div>
    </>
  );
};

export default OrderList;
