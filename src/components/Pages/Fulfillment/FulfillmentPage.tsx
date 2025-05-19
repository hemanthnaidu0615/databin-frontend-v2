import FulfillmentStats from './FulfillmentStats';
import FulfillmentPipeline from './FulfillmentPipeline';
import FulfillmentCenters from './FulfillmentCenters';
import BottleneckChart from './BottleneckChart';
import OrdersInProcess from './OrdersInProcess';

const FulfillmentPage = () => {
  return (
    <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 bg-gray-50 dark:bg-black min-h-screen overflow-x-hidden">
      {/* Section 1: Stats Cards */}
      <div className="overflow-x-auto">
        <FulfillmentStats />
      </div>

      {/* Section 2: Fulfillment Pipeline */}
      <div className="overflow-x-auto">
        <FulfillmentPipeline />
      </div>

      {/* Section 3: Performance Table + Bottleneck Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 overflow-x-auto">
          <FulfillmentCenters />
        </div>
        <div className="lg:col-span-5 overflow-x-auto">
          <BottleneckChart />
        </div>
      </div>

      {/* Section 4: Orders Table */}
      <div className="overflow-x-auto">
        <OrdersInProcess />
      </div>
    </div>
  );
};

export default FulfillmentPage;
