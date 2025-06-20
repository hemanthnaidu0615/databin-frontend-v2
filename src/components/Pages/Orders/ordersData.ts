import { axiosInstance } from "../../../axios";

export interface Product {
  name: string;
  specs: string;
  status: "Delivered" | "Pending" | "Cancelled" | "In Transit";
  qty: number;
  price: number;
  estimatedDelivery?: string;
  discount?: number; 
}

export interface Order {
  id: string;
  date: string;
  customer: string;
  product: string;
  total: number;
  discount?: number;
  status: "Delivered" | "Delayed" | "In Transit";
  orderType?: string;
  paymentMethod: "Credit Card" | "PayPal" | "Google Pay";
  products: Product[];
  shippingInfo?: {
    carrier: string | null;
    trackingId: string | null;
    method: string | null;
  };
  fulfillmentTimeline?: {
    orderPlaced: string | null;
    paymentConfirmed: string | null;
    delivered: string | null;
  };
  customerDetails?: {
    email?: string | null;
    phone?: string | null;
    address?: string | null;
  };
}

// 🟡 Helpers
const safeString = (value: any, fallback: string = "N/A") =>
  value ?? fallback;

const safeNumber = (value: any, fallback: number = 0) => {
  if (typeof value === "number") return value;
  if (typeof value === "string" && !isNaN(Number(value))) return Number(value);
  return fallback;
};


const formatDate = (date: any): string =>
  new Date(date).toISOString().split("T")[0];

const mapProduct = (
  p: any,
  orderStatus: Order["status"],
  eta: string | null
): Product => ({
  name: safeString(p.name),
  specs: safeString(p.category, ""),
  status: orderStatus === "Delayed" ? "Pending" : orderStatus,
  qty: safeNumber(p.quantity ?? p.qty),
  price: safeNumber(p.unit_price ?? p.price),
  estimatedDelivery: eta ?? undefined,
  discount: safeNumber(p.discount ?? 0), 
});


const mapShippingInfo = (shipping: any) => ({
  carrier: shipping.carrier ?? null,
  trackingId: shipping.tracking_id ?? null,
  method: shipping.method ?? null,
});

const mapCustomerDetails = (info: any) => ({
  email: info.email ?? null,
  phone: info.phone ?? null,
  address: info.address ?? null,
});

const mapFulfillmentTimeline = (timeline: any) => ({
  orderPlaced: timeline.order_placed ?? null,
  paymentConfirmed: timeline.payment_confirmed ?? null,
  delivered: timeline.delivered ?? null,
});

// 🟡 Main fetch function
export const fetchOrders = async (
  startDate: string,
  endDate: string,
  status?: string,
  orderType?: string,
  paymentMethod?: string,
  carrier?: string,
  searchCustomer?: string,
  searchOrderId?: string,
  enterpriseKey?: string
): Promise<Order[]> => {
  if (
    !startDate ||
    !endDate ||
    isNaN(Date.parse(startDate)) ||
    isNaN(Date.parse(endDate))
  ) {
    throw new Error("Invalid date range");
  }

  try {
    const response = await axiosInstance.get("/orders/filtered", {
      params: {
        startDate,
        endDate,
        status,
        orderType,
        paymentMethod,
        carrier,
        searchCustomer,
        searchOrderId,
        enterpriseKey,
      },
    });

    const { data: rawOrders } = response.data; 
    if (!Array.isArray(rawOrders)) return [];

    return rawOrders.map((order: any): Order => {
      const summary = order.order_summary ?? {};
      const products = order.products ?? [];
      const customerInfo = order.customer_info ?? {};
      const shipping = order.shipping_info ?? {};
      const timeline = order.fulfillment_timeline ?? {};

      const statusFinal: Order["status"] =
        summary.status ?? order.shipment_status ?? "Pending";

      const eta = summary.eta ?? null;
      return {
  id: String(summary.order_id ?? order.order_id),
  date: formatDate(summary.order_date ?? order.order_date),
  customer: safeString(customerInfo.name ?? order.customer_name, "Unknown"),
  product: order.product_name ?? products[0]?.name ?? "N/A",
  total: products[0]?.total ?? order.total ?? 0,
  discount: safeNumber(summary.discount ?? 0), 
  status: statusFinal,
  paymentMethod: summary.payment_method ?? order.payment_method ?? "PayPal",
  orderType: summary.order_type ?? "Online",
  products: products.map((p: any) => mapProduct(p, statusFinal, eta)),
  shippingInfo: mapShippingInfo(shipping),
  fulfillmentTimeline: mapFulfillmentTimeline(timeline),
  customerDetails: mapCustomerDetails(customerInfo),
};

    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
};
