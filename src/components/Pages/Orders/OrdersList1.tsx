import React, { useState, useCallback } from "react";
import { Order } from "./ordersData";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { axiosInstance } from "../../../axios";

// 🟢 Reusable Key-Value Display Component
const KeyValueDisplay: React.FC<{ data: Record<string, any>; title: string }> = ({
  data,
  title,
}) => (
  <div className="bg-gray-100 dark:bg-white/5 p-4 rounded-xl">
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
      {title}
    </h3>
    <div className="text-sm space-y-2 text-gray-600 dark:text-gray-300">
      {Object.entries(data).map(([key, value]) => (
        <div key={key} className="flex justify-between items-center">
          <span className="text-gray-500 dark:text-gray-400">{key}</span>
          <span className="text-right text-gray-900 dark:text-white font-medium">
            {value}
          </span>
        </div>
      ))}
    </div>
  </div>
);

export const fetchOrderDetails = async (
  orderId: string
): Promise<any | null> => {
  try {
    const response = await axiosInstance.get(`/orders/${orderId}/details`);
    const data = response.data as { value?: any };
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

const statusColors: Record<string, string> = {
  Delivered: "bg-green-600",
  "In Transit": "bg-yellow-500",
  Delayed: "bg-red-600",
};

const OrderStatusBadge: React.FC<{ status: Order["status"] }> = ({ status }) => (
  <span
    className={`inline-block px-2 py-1 text-xs rounded-full text-white ${statusColors[status]}`}
  >
    {status}
  </span>
);

const OrderList1: React.FC<{ orders?: Order[] }> = ({ orders = [] }) => {
  const [expandedOrderIds, setExpandedOrderIds] = useState<string[]>([]);
  const [orderDetails, setOrderDetails] = useState<Map<string, any>>(new Map());
  const [loadingOrderDetails, setLoadingOrderDetails] = useState<
    Map<string, boolean>
  >(new Map());

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
    setExpandedOrderIds((prev) =>
      prev.includes(order.id)
        ? prev.filter((i) => i !== order.id)
        : [...prev, order.id]
    );
    if (!expandedOrderIds.includes(order.id) && !orderDetails.has(order.id)) {
      fetchAndSetDetails(order.id);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800 text-left app-table-heading">
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
          {orders.map((order) => (
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
                <td className="py-3 px-4 hidden md:table-cell">{order.date}</td>
                <td className="py-3 px-4 hidden md:table-cell">{order.customer}</td>
                <td className="py-3 px-4 hidden md:table-cell">{order.product}</td>
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
                      {[
                        {
                          title: "Order Summary",
                          data: {
                            "Order ID": order.id,
                            "Order Date": order.date,
                            Status: <OrderStatusBadge status={order.status} />,
                            "Payment Method": order.paymentMethod,
                            "Order Type":
                              orderDetails.get(order.id)?.order_summary
                                ?.order_type ?? "N/A",
                          },
                        },
                        {
                          title: "Customer Information",
                          data: {
                            Name: order.customer,
                            Email:
                              orderDetails.get(order.id)?.customer_info?.email ??
                              "N/A",
                            Phone:
                              cleanAndFormatPhoneNumber(
                                orderDetails.get(order.id)?.customer_info?.phone ??
                                  ""
                              ) || "N/A",
                            Address:
                              orderDetails.get(order.id)?.customer_info?.address ??
                              "N/A",
                          },
                        },
                      ].map((section, idx) => (
                        <KeyValueDisplay
                          key={idx}
                          title={section.title}
                          data={section.data}
                        />
                      ))}
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

export default OrderList1;
