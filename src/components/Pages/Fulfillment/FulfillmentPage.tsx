import { useEffect } from "react";
import FulfillmentKPI from "./FulfillmentKPI";
import FulfillmentPipeline from "./FulfillmentPipeline";
import FulfillmentCenters from "./FulfillmentCenters";
import BottleneckChart from "./BottleneckChart";
import OrdersInProcess from "./OrdersInProcess";

const FulfillmentPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full bg-gray-50 dark:bg-black overflow-x-hidden">
      <div className="max-w-screen-2xl mx-auto space-y-10">
        <h1 className="app-section-title mb-4">Fulfillment</h1>
        <div className="w-full">
          <FulfillmentKPI />
        </div>
        <div className="w-full bg-white dark:bg-gray-900 p-4 rounded-xl shadow-sm">
          <FulfillmentPipeline />
        </div>
        <div className="w-full bg-white dark:bg-gray-900 p-4 rounded-xl shadow-sm">
          <FulfillmentCenters />
        </div>
        <div className="w-full bg-white dark:bg-gray-900 p-4 rounded-xl shadow-sm">
          <BottleneckChart />
        </div>
        <div className="w-full bg-white dark:bg-gray-900 p-4 rounded-xl shadow-sm">
          <OrdersInProcess />
        </div>

      </div>
    </div>


  );
};

export default FulfillmentPage;
