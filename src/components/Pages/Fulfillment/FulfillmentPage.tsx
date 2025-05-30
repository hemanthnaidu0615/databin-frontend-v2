import { useEffect } from "react";
import FulfillmentStats from "./FulfillmentStats";
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
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10">

        {/* ✅ Fulfillment Page Title */}
        <h1 className="app-section-title mb-4">Fulfillment</h1>

        {/* Section 1: Stats Cards */}
        <div className="w-full">
          <FulfillmentStats />
        </div>

        {/* Section 2: Fulfillment Pipeline */}
        <div className="w-full bg-white dark:bg-gray-900 p-4 rounded-xl shadow-sm">
          <FulfillmentPipeline />
        </div>

        {/* Section 3: Fulfillment Centers */}
        <div className="w-full bg-white dark:bg-gray-900 p-4 rounded-xl shadow-sm">
          <FulfillmentCenters />
        </div>

        {/* Section 4: Bottleneck Chart */}
        <div className="w-full bg-white dark:bg-gray-900 p-4 rounded-xl shadow-sm">
          <BottleneckChart />
        </div>

        {/* Section 5: Orders Table */}
        <div className="w-full bg-white dark:bg-gray-900 p-4 rounded-xl shadow-sm">
          <OrdersInProcess />
        </div>

      </div>
    </div>


  );
};

export default FulfillmentPage;
