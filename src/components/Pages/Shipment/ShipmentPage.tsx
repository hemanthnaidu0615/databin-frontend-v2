import { useEffect, useState } from 'react';
import ShipmentStats from './ShipmentStats';
import ShipmentCharts from './ShipmentCharts';
import RecentShipmentsTable from './RecentShipmentsTable';
import { Dropdown } from 'primereact/dropdown';
import { axiosInstance } from "../../../axios";

const ShipmentPage = () => {
  const [selectedCarrier, setSelectedCarrier] = useState<string | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [carriers, setCarriers] = useState<string[]>([]);
  const [shippingMethods, setShippingMethods] = useState<string[]>([]);
  const [loadingFilters, setLoadingFilters] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const clearFilters = () => {
    setSelectedCarrier(null);
    setSelectedMethod(null);
  };

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        setLoadingFilters(true);
        const res = await axiosInstance.get<{ carriers: string[]; shipping_methods: string[] }>(
          'shipment-filters/filter-values'
        );

        setCarriers(res.data.carriers || []);
        setShippingMethods(res.data.shipping_methods || []);
      } catch (err) {
        console.error('Failed to fetch filters:', err);
        setError('Failed to load shipment filters.');
      } finally {
        setLoadingFilters(false);
      }
    };

    fetchFilters();
  }, []);

  return (
    <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 overflow-x-hidden">
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
            disabled={loadingFilters}
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
            disabled={loadingFilters}
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

      {/* Optional error display */}
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {/* KPIs */}
      <div className="overflow-x-auto">
        <ShipmentStats selectedCarrier={selectedCarrier} selectedMethod={selectedMethod} />
      </div>

      {/* Charts */}
      <div className="overflow-x-auto">
        <ShipmentCharts selectedCarrier={selectedCarrier} selectedMethod={selectedMethod} />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <RecentShipmentsTable selectedCarrier={selectedCarrier} selectedMethod={selectedMethod} />
      </div>
    </div>
  );
};

export default ShipmentPage;
