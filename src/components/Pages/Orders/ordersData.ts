import axios from "axios";

export interface Product {
  name: string;
  specs: string;
  status: "Delivered" | "Pending" | "Cancelled" | "In Transit";
  qty: number;
  price: number;
  estimatedDelivery?: string;
}

export interface Order {
  id: string;
  date: string;
  customer: string;
  product: string;
  total: number;
  status: "Delivered" | "Delayed" | "In Transit";
  orderType?: string;
  paymentMethod: "Credit Card" | "PayPal" | "Google Pay";
  products: Product[];
  shippingInfo?: {
    carrier: string | null;
    trackingId: string | null;
    eta: string | null;
    delivered: string | null;
  };
  fulfillmentTimeline?: {
    orderPlaced: string;
    paymentConfirmed: string;
    delivered: string | null;
  };
  customerDetails?: {
    email?: string;
    phone?: string;
    address?: string;
  };
}

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
    const response = await axios.get(
      "http://localhost:8080/api/orders/filtered",
      {
        params: {
          startDate,
          endDate,
          status,
          orderType,
          paymentMethod,
          carrier,
          searchCustomer,
          searchOrderId,
          enterpriseKey, // ✅ sent as a query param here
        },
      });

    const filteredOrders = response.data;
    if (!Array.isArray(filteredOrders)) return [];

    return filteredOrders.map((order: any): Order => {
      const summary = order.order_summary ?? {};
      const products = order.products ?? [];
      const customerInfo = order.customer_info ?? {};
      const shipping = order.shipping_info ?? {};
      const timeline = order.fulfillment_timeline ?? {};

      return {
        id: String(summary.order_id ?? order.order_id),
        date: new Date(summary.order_date ?? order.order_date)
          .toISOString()
          .split("T")[0],
        customer: customerInfo.name ?? order.customer_name ?? "Unknown",
        product: order.product_name ?? products[0]?.name ?? "N/A",
        total: products[0]?.total ?? order.total ?? 0,
        status: summary.status ?? order.shipment_status ?? "Pending",
        paymentMethod:
          summary.payment_method ?? order.payment_method ?? "PayPal",
        orderType: summary.order_type ?? "Online",
        products: products.map((p: any) => ({
          name: p.name,
          specs: p.category ?? "",
          status: summary.status ?? "Pending",
          qty: p.quantity ?? 0,
          price: p.unit_price ?? 0,
          estimatedDelivery: shipping.eta ?? null,
        })),
        shippingInfo: {
          carrier: shipping.carrier ?? null,
          trackingId: shipping.tracking_id ?? null,
          eta: shipping.eta ?? null,
          delivered: shipping.delivered ?? null,
        },
        fulfillmentTimeline: {
          orderPlaced: timeline.order_placed ?? null,
          paymentConfirmed: timeline.payment_confirmed ?? null,
          delivered: timeline.delivered ?? null,
        },
        customerDetails: {
          email: customerInfo.email ?? null,
          phone: customerInfo.phone ?? null,
          address: customerInfo.address ?? null,
        },
      };
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
};
