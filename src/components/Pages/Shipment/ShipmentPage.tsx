import  { useState } from 'react';
import ShipmentStats from './ShipmentStats';
import ShipmentCharts from './ShipmentCharts';
import RecentShipmentsTable from './RecentShipmentsTable';
import { Dropdown } from 'primereact/dropdown';

const carriers = ['FedEx', 'UPS', 'DHL', 'USPS'];
const shippingMethods = ['Standard', 'Expedited', 'Same-Day'];


const ShipmentPage = () => {
  const [selectedCarrier, setSelectedCarrier] = useState<string | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  const clearFilters = () => {
    setSelectedCarrier(null);
    setSelectedMethod(null);
  };

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Shipment Analytics</h1>
        <p className="text-sm text-zinc-400">
          Get insights into your shipping performance and activity.
        </p>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Carrier</label>
          <Dropdown
            value={selectedCarrier}
            options={carriers}
            onChange={(e) => setSelectedCarrier(e.value)}
            placeholder="Select Carrier"
            className="w-full"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Shipping Method</label>
          <Dropdown
            value={selectedMethod}
            options={shippingMethods}
            onChange={(e) => setSelectedMethod(e.value)}
            placeholder="Select Method"
            className="w-full"
          />
        </div>
        <div className="flex justify-end">
          <button
            onClick={clearFilters}
            className="text-sm px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* KPIs */}
      <ShipmentStats />

      {/* Charts */}
      <ShipmentCharts
        selectedCarrier={selectedCarrier}
        selectedMethod={selectedMethod}
      />

      {/* Table */}
      <RecentShipmentsTable
        selectedCarrier={selectedCarrier}
        selectedMethod={selectedMethod}
      />

      {/* Timeline */}
      {/* <ShipmentTimelineChart /> */}
    </div>
  );
};

export default ShipmentPage;
