import axios from "axios";

export interface Product {
  name: string;
  specs: string;
  status: 'Delivered' | 'Pending' | 'Cancelled' | 'In Transit';
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
  status: 'Delivered' | 'Pending' | 'Cancelled' | 'In Transit';
  orderType?: string;
  paymentMethod: 'Credit Card' | 'PayPal' | 'Google Pay';
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
  searchOrderId?: string
): Promise<Order[]> => {
  try {
    if (!startDate || !endDate || isNaN(Date.parse(startDate)) || isNaN(Date.parse(endDate))) {
      throw new Error("Invalid date range");
    }

    const response = await axios.get("http://localhost:8080/api/orders/filtered", {
      params: {
        startDate,
        endDate,
        status,
        orderType,
        paymentMethod,
        carrier,
        searchCustomer,
        searchOrderId,
      },
    });

    const filteredOrders = response.data;

    if (!Array.isArray(filteredOrders)) {
      console.error("Expected an array but received:", filteredOrders);
      return [];
    }

    return filteredOrders.map((order: any): Order => {
      const summary = order.order_summary ?? {};
      const products = Array.isArray(order.products) ? order.products : [];

      return {
        id: summary.order_id ?? order.order_id,
        date: new Date(summary.order_date ?? order.order_date).toISOString().split("T")[0],
        customer: order.customer_info?.name ?? order.customer_name ?? "Unknown",
        product: order.product_name ?? products[0]?.name ?? "N/A",
        total: products[0]?.total ?? order.total ?? 0,
        status: summary.status ?? order.shipment_status ?? "Pending",
        paymentMethod: summary.payment_method ?? order.payment_method ?? "PayPal",
        orderType: summary.order_type ?? "Online",
        products: products.map((p: any) => ({
          name: p.name,
          specs: p.category ?? "",
          status: summary.status ?? "Pending",
          qty: p.quantity,
          price: p.unit_price,
          estimatedDelivery: order.shipping_info?.eta,
        })),
        shippingInfo: order.shipping_info
          ? {
              carrier: order.shipping_info.carrier,
              trackingId: order.shipping_info.tracking_id,
              eta: order.shipping_info.eta,
              delivered: order.shipping_info.delivered,
            }
          : undefined,
        fulfillmentTimeline: order.fulfillment_timeline
          ? {
              orderPlaced: order.fulfillment_timeline.order_placed,
              paymentConfirmed: order.fulfillment_timeline.payment_confirmed,
              delivered: order.fulfillment_timeline.delivered,
            }
          : undefined,
        customerDetails: order.customer_info
          ? {
              email: order.customer_info.email,
              phone: order.customer_info.phone,
              address: order.customer_info.address,
            }
          : undefined,
      };
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
};
