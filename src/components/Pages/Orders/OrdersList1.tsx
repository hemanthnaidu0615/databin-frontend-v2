import React, { useState, useEffect, useCallback } from "react";
import { Order } from "./ordersData";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { axiosInstance } from "../../../axios";
import { Paginator } from "primereact/paginator";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

(jsPDF as any).API.autoTable = autoTable;

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

const OrderStatusBadge: React.FC<{ status: Order["status"] }> = ({
  status,
}) => (
  <span
    className={`inline-block px-2 py-1 text-xs rounded-full text-white ${statusColors[status]}`}
  >
    {status}
  </span>
);

// 🟡 Reusable Key-Value Display
const KeyValueDisplay: React.FC<{
  data: Record<string, any>;
  title: string;
}> = ({ data, title }) => (
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

// 🟡 Section Types
type ExpandedSection =
  | { title: string; data: Record<string, any> }
  | { title: "Products"; products: any[] }
  | { title: "Fulfillment Timeline"; timeline: any[] }
  | { title: "Actions" };

// 🟡 Main Component
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
        if (details)
          setOrderDetails((prev) => new Map(prev).set(orderId, details));
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
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(() =>
    typeof window !== "undefined" && window.innerWidth < 640 ? 10 : 20
  );
  const [isManualRowsChange, setIsManualRowsChange] = useState(false);
  const options = [10, 20, 50, 100];

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 640;
      if (!isManualRowsChange) {
        setRows(isMobile ? 10 : 20);
        setFirst(0);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isManualRowsChange]);

  const onPageChange = (e: { first: number; rows: number }) => {
    setFirst(e.first);
    setRows(e.rows);
    setExpandedOrderIds([]);
    setIsManualRowsChange(true);
  };

  const handleDownloadInvoice = (order: Order, details: any) => {
    const doc = new jsPDF();
    const marginLeft = 14;
    let y = 20;

    // Header
    doc.setFontSize(18);
    doc.text("INVOICE", marginLeft, y);

    y += 10;
    doc.setFontSize(12);
    doc.text(`Order ID: ${order.id}`, marginLeft, y);
    y += 6;
    doc.text(`Date: ${order.date}`, marginLeft, y);
    y += 6;
    doc.text(`Customer: ${order.customer}`, marginLeft, y);
    y += 6;
    doc.text(`Status: ${order.status}`, marginLeft, y);

    y += 10;
    doc.setFont("helvetica", "bold");
    doc.text("Customer Information", marginLeft, y);
    doc.setFont("helvetica", "normal");

    const customerInfo = details.customer_info ?? {};
    y += 6;
    doc.text(`Name: ${order.customer}`, marginLeft, y);
    y += 6;
    doc.text(`Email: ${customerInfo.email ?? "N/A"}`, marginLeft, y);
    y += 6;
    doc.text(`Phone: ${customerInfo.phone ?? "N/A"}`, marginLeft, y);
    y += 6;
    doc.text(`Address: ${customerInfo.address ?? "N/A"}`, marginLeft, y);

    y += 10;
    doc.setFont("helvetica", "bold");
    doc.text("Order Summary", marginLeft, y);
    doc.setFont("helvetica", "normal");

    y += 6;
    doc.text(`Payment Method: ${order.paymentMethod}`, marginLeft, y);
    y += 6;
    doc.text(
      `Order Type: ${details.order_summary?.order_type ?? "N/A"}`,
      marginLeft,
      y
    );
    y += 6;
    doc.text(
      `ETA: ${details.order_summary?.eta
        ? new Date(details.order_summary.eta).toLocaleString()
        : "N/A"
      }`,
      marginLeft,
      y
    );
    y += 6;
    doc.text(
      `Delivered: ${details.order_summary?.delivered
        ? new Date(details.order_summary.delivered).toLocaleString()
        : "N/A"
      }`,
      marginLeft,
      y
    );

    // Products Table
    y += 10;
    const products = details.products ?? order.products ?? [];
    const productRows = products.map((p: any) => [
      p.name,
      p.category || p.specs || "",
      p.quantity ?? p.qty,
      formatUSD(p.unit_price ?? p.price),
      formatUSD((p.quantity ?? p.qty) * (p.unit_price ?? p.price)),
    ]);

    autoTable(doc, {
      startY: y,
      head: [["Product", "Category", "Qty", "Unit Price", "Total"]],
      body: productRows,
      theme: "grid",
      headStyles: { fillColor: [22, 160, 133], textColor: 255 },
      styles: { fontSize: 10 },
    });

    // Totals
    const subtotal = products.reduce(
      (acc: number, p: any) =>
        acc + (p.quantity ?? p.qty) * (p.unit_price ?? p.price),
      0
    );
    const shipping = products.reduce(
      (acc: number, p: any) => acc + (p.shipping ?? 0),
      0
    );
    const tax = products.reduce((acc: number, p: any) => acc + (p.tax ?? 0), 0);
    const discount = products.reduce(
      (acc: number, p: any) => acc + (p.discount ?? 0),
      0
    );
    const total = subtotal + shipping + tax - discount;

    let finalY = (doc as any).lastAutoTable.finalY + 10;

    doc.setFontSize(12);
    doc.text(`Subtotal: ${formatUSD(subtotal)}`, marginLeft, finalY);
    finalY += 6;
    doc.text(`Shipping: ${formatUSD(shipping)}`, marginLeft, finalY);
    finalY += 6;
    doc.text(`Tax: ${formatUSD(tax)}`, marginLeft, finalY);
    finalY += 6;
    doc.text(`Discount: ${formatUSD(discount)}`, marginLeft, finalY);
    finalY += 8;
    doc.setFont("helvetica", "bold");
    doc.text(`Total: ${formatUSD(total)}`, marginLeft, finalY);
    doc.setFont("helvetica", "normal");

    // Fulfillment Timeline
    finalY += 10;
    doc.setFont("helvetica", "bold");
    doc.text("Fulfillment Timeline", marginLeft, finalY);
    doc.setFont("helvetica", "normal");

    const timeline = details.fulfillment_timeline ?? {};
    finalY += 6;
    doc.text(
      `Order Placed: ${timeline.order_placed
        ? new Date(timeline.order_placed).toLocaleString()
        : "N/A"
      }`,
      marginLeft,
      finalY
    );
    finalY += 6;
    doc.text(
      `Payment Confirmed: ${timeline.payment_confirmed
        ? new Date(timeline.payment_confirmed).toLocaleString()
        : "N/A"
      }`,
      marginLeft,
      finalY
    );
    finalY += 6;
    doc.text(
      `Delivered: ${timeline.delivered
        ? new Date(timeline.delivered).toLocaleString()
        : "N/A"
      }`,
      marginLeft,
      finalY
    );

    // Save file
    doc.save(`invoice_${order.id}.pdf`);
  };
  // 🟡 Helper: Generate expanded sections
  const getExpandedSections = (order: Order): ExpandedSection[] => {
    const details = orderDetails.get(order.id) || {};
    const products = details.products || order.products || [];

    const maskPhoneNumber = (phone: string): string => {
      const cleaned = phone.replace(/\D/g, ""); // Remove non-digit characters
      const last4 = cleaned.slice(-4);
      return last4 ? `**** **** ${last4}` : "N/A";
    };

    // 🌟 Adjust Delivered to be after ETA only if it's incorrect
    if (
      order.status === "Delayed" &&
      details.order_summary?.eta &&
      details.order_summary?.delivered
    ) {
      const etaDate = new Date(details.order_summary.eta);
      const deliveredDate = new Date(details.order_summary.delivered);

      if (deliveredDate < etaDate) {
        // Adjust delivered to be 5 minutes after ETA
        const adjustedDelivered = new Date(etaDate.getTime() + 5 * 60 * 1000);
        details.order_summary.delivered = adjustedDelivered.toISOString();
      }
    }

    const sections: ExpandedSection[] = [
      {
        title: "Order Summary",
        data: {
          "Order ID": order.id,
          "Order Date": order.date,
          Status: <OrderStatusBadge status={order.status} />,
          "Payment Method": order.paymentMethod,
          "Order Type": details.order_summary?.order_type ?? "N/A",
          ETA: details.order_summary?.eta
            ? new Date(details.order_summary.eta).toLocaleString()
            : "N/A",
          Delivered: details.order_summary?.delivered
            ? new Date(details.order_summary.delivered).toLocaleString()
            : "N/A",
        },
      },
      {
        title: "Customer Information",
        data: {
          Name: order.customer,
          Email: details.customer_info?.email ?? "N/A",
          Phone: maskPhoneNumber(details.customer_info?.phone ?? "") || "N/A",
          Address: details.customer_info?.address ?? "N/A",
        },
      },
      {
        title: "Products",
        products,
      },
      {
        title: "Shipping Information",
        data: {
          Carrier: details.shipping_info?.carrier ?? "N/A",
          Tracking: details.shipping_info?.tracking_id ?? "N/A",
          Method: details.shipping_info?.method ?? "N/A",
        },
      },
      {
        title: "Fulfillment Timeline",
        timeline: [
          {
            label: "Order Placed",
            date: details.fulfillment_timeline?.order_placed
              ? new Date(
                details.fulfillment_timeline.order_placed
              ).toLocaleString()
              : "N/A",
            complete: true,
          },
          {
            label: "Payment Confirmed",
            date: details.fulfillment_timeline?.payment_confirmed
              ? new Date(
                details.fulfillment_timeline.payment_confirmed
              ).toLocaleString()
              : "N/A",
            complete: true,
          },
          order.status === "Delivered"
            ? {
              label: "Delivered",
              date: details.order_summary?.delivered
                ? new Date(details.order_summary.delivered).toLocaleString()
                : "N/A",
              complete: true,
            }
            : order.status === "Delayed"
              ? {
                label: "Delayed",
                date: details.order_summary?.eta
                  ? new Date(details.order_summary.eta).toLocaleString()
                  : "N/A",
                complete: false,
                Delayed: true,
              }
              : {
                label: "Delivered",
                date: details.order_summary?.eta
                  ? new Date(details.order_summary.eta).toLocaleString()
                  : "N/A",
                complete: false,
              },
        ],
      },
      { title: "Actions" },
    ];

    return sections;
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800 text-left app-table-heading">
        <thead className="bg-gray-100 dark:bg-gray-900">
          <tr className="text-left text-sm text-gray-600 dark:text-gray-300">
            <th className="py-3 px-4"></th>
            <th className="py-3 px-4">Order ID</th>
            <th className="py-3 px-4 hidden md:table-cell">Date</th>
            <th className="py-3 px-4 hidden md:table-cell">Customer Name</th>
            <th className="py-3 px-4 hidden md:table-cell">Product</th>
            <th className="py-3 px-4 hidden md:table-cell">Total Amount</th>
            <th className="py-3 px-4 hidden md:table-cell">Status</th>
            <th className="py-3 px-4 hidden md:table-cell">Payment Method</th>
          </tr>
        </thead>
        <tbody className="text-sm text-gray-800 dark:text-gray-200">
          {orders.slice(first, first + rows).map((order) => (
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
                      {getExpandedSections(order).map((section, idx) => {
                        if ("data" in section) {
                          return (
                            <KeyValueDisplay
                              key={idx}
                              title={section.title}
                              data={section.data}
                            />
                          );
                        }
                        if ("products" in section) {
                          const products = section.products;
                          const subtotal = products.reduce(
                            (acc, p) =>
                              acc +
                              (p.quantity ?? p.qty) * (p.unit_price ?? p.price),
                            0
                          );

                          const shipping = products.reduce(
                            (acc, p) => acc + (p.shipping ?? 0),
                            0
                          );

                          const tax = products.reduce(
                            (acc, p) => acc + (p.tax ?? 0),
                            0
                          );

                          const discount = products.reduce(
                            (acc, p) => acc + (p.discount ?? 0),
                            0
                          );

                          const total =
                            products.reduce(
                              (acc, p) => acc + (p.total ?? 0),
                              0
                            ) || subtotal + shipping + tax;

                          return (
                            <div
                              key={idx}
                              className="bg-gray-100 dark:bg-white/5 text-gray-800 dark:text-gray-300 p-6 rounded-xl col-span-1"
                            >
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                                Products
                              </h3>

                              <div className="space-y-6">
                                {products.map((product: any, i: number) => {
                                  const quantity =
                                    product.quantity ?? product.qty;
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

                              <div className="space-y-2 text-sm">
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
                                <div className="flex justify-between">
                                  <span className="text-gray-600 dark:text-gray-400">
                                    Discount
                                  </span>
                                  <span className="text-gray-900 dark:text-white">
                                    {formatUSD(discount)}
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
                              </div>
                            </div>
                          );
                        } else if ("timeline" in section) {
                          return (
                            <div
                              key={idx}
                              className="bg-gray-100 dark:bg-white/5 p-4 rounded-xl"
                            >
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Fulfillment Timeline
                              </h3>
                              <div className="relative pl-6">
                                {section.timeline.map((step, i, arr) => (
                                  <div key={i} className="relative pb-8">
                                    {i !== arr.length - 1 && (
                                      <span className="absolute left-2.5 top-0 h-full w-px bg-gray-300 dark:bg-white/10" />
                                    )}
                                    <span
                                      className={`absolute left-0 top-0 w-3 h-3 rounded-full border-2 ${step.Delayed
                                          ? "bg-red-500 border-red-500"
                                          : step.complete
                                            ? "bg-green-500 border-green-500"
                                            : "bg-gray-400 border-gray-400"
                                        }`}
                                    />
                                    <div className="ml-4">
                                      <p
                                        className={`text-sm font-medium ${step.Delayed
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
                            </div>
                          );
                        } else if (section.title === "Actions") {
                          return (
                            <div
                              key={idx}
                              className="bg-gray-100 dark:bg-white/5 p-4 rounded-xl flex flex-col"
                            >
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                                Actions
                              </h3>
                              <div className="space-y-2">
                                <button
                                  onClick={() =>
                                    handleDownloadInvoice(
                                      order,
                                      orderDetails.get(order.id)
                                    )
                                  }
                                  className="w-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-white py-2 px-4 rounded-xl"
                                >
                                  Download Invoice
                                </button>
                              </div>
                            </div>
                          );
                        }
                      })}
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
            rowsPerPageOptions={options}
            template="RowsPerPageDropdown CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} orders"
            className="dark:text-gray-100 dark:bg-gray-900"
          />
        </div>

        {/* Mobile paginator for screens < sm */}
        <div className="mt-4 text-sm text-gray-800 dark:text-gray-100 sm:hidden">
          <div className="flex flex-col gap-2 mb-2">
            <div className="flex flex-col gap-1">
              <label htmlFor="mobileRows" className="whitespace-nowrap">
                Rows per page:
              </label>
              <select
                id="mobileRows"
                value={rows}
                onChange={(e) => {
                  setRows(Number(e.target.value));
                  setFirst(0);
                }}
                className="px-2 py-1 rounded dark:bg-gray-800 bg-gray-100 dark:text-white text-gray-800 w-full border"
              >
                {options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div>
              Page {Math.floor(first / rows) + 1} of{" "}
              {Math.ceil(orders.length / rows)}
            </div>
          </div>

          <div className="flex flex-wrap justify-between gap-2">
            <button
              onClick={() => onPageChange({ first: 0, rows })}
              disabled={first === 0}
              className="flex-1 px-2 py-1 text-xs rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50"
            >
              ⏮ First
            </button>
            <button
              onClick={() =>
                onPageChange({ first: Math.max(0, first - rows), rows })
              }
              disabled={first === 0}
              className="flex-1 px-2 py-1 text-xs rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50"
            >
              Prev
            </button>
            <button
              onClick={() =>
                onPageChange({
                  first: first + rows < orders.length ? first + rows : first,
                  rows,
                })
              }
              disabled={first + rows >= orders.length}
              className="flex-1 px-2 py-1 text-xs rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50"
            >
              Next
            </button>
            <button
              onClick={() =>
                onPageChange({
                  first: (Math.ceil(orders.length / rows) - 1) * rows,
                  rows,
                })
              }
              disabled={first + rows >= orders.length}
              className="flex-1 px-2 py-1 text-xs rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50"
            >
              Last ⏭
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderList1;
