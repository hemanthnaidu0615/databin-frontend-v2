export type Order = {
    id: string;
    orderId: string;
    customerName: string;
    status: "Pending" | "Shipped" | "Delivered" | "Delayed" | "Cancelled";
    deliveryEta: string;
    actualDelivery: string;
    fulfillmentStage: string;
    totalValue: string;
    origin: string;
    escalated?: boolean;
    flagged?: boolean;
  };
  
  export const dummyOrders: Order[] = [
    {
      id: "1",
      orderId: "ORD-1001",
      customerName: "John Doe",
      status: "Shipped",
      deliveryEta: "2025-04-10",
      actualDelivery: "2025-04-09",
      fulfillmentStage: "Packed",
      totalValue: "$120.00",
      origin: "USA - NY",
    },
    {
      id: "2",
      orderId: "ORD-1002",
      customerName: "Jane Smith",
      status: "Delayed",
      deliveryEta: "2025-04-08",
      actualDelivery: "2025-04-11",
      fulfillmentStage: "Out for Delivery",
      totalValue: "$85.00",
      origin: "Germany - Berlin",
      escalated: true,
    },
    {
      id: "3",
      orderId: "ORD-1003",
      customerName: "Ali Khan",
      status: "Delivered",
      deliveryEta: "2025-04-07",
      actualDelivery: "2025-04-07",
      fulfillmentStage: "Delivered",
      totalValue: "$190.00",
      origin: "UAE - Dubai",
    },
    {
      id: "4",
      orderId: "ORD-1004",
      customerName: "Emily Zhang",
      status: "Pending",
      deliveryEta: "2025-04-12",
      actualDelivery: "",
      fulfillmentStage: "Processing",
      totalValue: "$75.00",
      origin: "China - Shenzhen",
      flagged: true,
    },
    {
      id: "5",
      orderId: "ORD-1005",
      customerName: "Carlos Rivera",
      status: "Cancelled",
      deliveryEta: "2025-04-09",
      actualDelivery: "",
      fulfillmentStage: "Cancelled",
      totalValue: "$0.00",
      origin: "Mexico - CDMX",
    },
    {
      id: "6",
      orderId: "ORD-1006",
      customerName: "Nina Patel",
      status: "Shipped",
      deliveryEta: "2025-04-11",
      actualDelivery: "",
      fulfillmentStage: "Shipped",
      totalValue: "$210.00",
      origin: "India - Mumbai",
    },
    {
      id: "7",
      orderId: "ORD-1007",
      customerName: "Lucas Ferreira",
      status: "Delayed",
      deliveryEta: "2025-04-06",
      actualDelivery: "2025-04-09",
      fulfillmentStage: "Shipped",
      totalValue: "$60.00",
      origin: "Brazil - São Paulo",
      escalated: true,
      flagged: true,
    },
  ];
  