import { Card } from "primereact/card";
import { Timeline } from "primereact/timeline";

const dummyFulfillmentEvents = [
  {
    orderId: "ORD001",
    events: [
      {
        status: "Picked",
        description: "Order picked from warehouse",
        time: "2024-05-01 10:00 AM",
      },
      {
        status: "Packed",
        description: "Order packed and labeled",
        time: "2024-05-01 11:00 AM",
      },
      {
        status: "Shipped",
        description: "Shipped via FedEx",
        time: "2024-05-01 2:00 PM",
      },
      {
        status: "Delivered",
        description: "Delivered to customer",
        time: "2024-05-02 3:00 PM",
      },
    ],
  },
  {
    orderId: "ORD002",
    events: [
      {
        status: "Picked",
        description: "Order picked",
        time: "2024-05-02 9:00 AM",
      },
      {
        status: "Packed",
        description: "Packaging completed",
        time: "2024-05-02 10:30 AM",
      },
      {
        status: "Shipped",
        description: "Sent through DHL",
        time: "2024-05-02 12:00 PM",
      },
    ],
  },
];

const FulfillmentTimeline = () => {
  return (
    <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md">
      <div className="px-4 pt-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          Fulfillment Timeline
        </h2>
      </div>

      <div className="px-4 pb-6 space-y-8">
        {dummyFulfillmentEvents.map((order, index) => (
          <div key={index}>
            <h3 className="text-md font-medium mb-2 text-blue-700 dark:text-blue-300">
              Order ID: {order.orderId}
            </h3>
            <Timeline
              value={order.events}
              align="left"
              content={(item) => (
                <div>
                  <p className="text-sm font-semibold">{item.status}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{item.description}</p>
                  <p className="text-xs text-gray-400">{item.time}</p>
                </div>
              )}
            />
          </div>
        ))}
      </div>
    </Card>
  );
};

export default FulfillmentTimeline;