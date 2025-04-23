import FulfillmentStats from './FulfillmentStats';
import FulfillmentPipeline from './FulfillmentPipeline';
import FulfillmentCenters from './FulfillmentCenters';
import BottleneckChart from './BottleneckChart';
import OrdersInProcess from './OrdersInProcess';

const FulfillmentPage = () => {
  return (
    <div className="p-4 md:p-6 space-y-6 bg-gray-50 dark:bg-black min-h-screen">
      {/* Section 1: Stats Cards */}
      <FulfillmentStats />

      {/* Section 2: Fulfillment Flow */}
      <FulfillmentPipeline />

      {/* Section 3: Performance Table */}
      <FulfillmentCenters />

      {/* Section 4: Bottleneck Chart */}
      <BottleneckChart />

      {/* Section 5: Orders Table */}
      <OrdersInProcess />
    </div>
  );
};

export default FulfillmentPage;
