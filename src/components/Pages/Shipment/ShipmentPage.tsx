import { useEffect, useState } from "react";
import ShipmentStats from "./ShipmentKPI";
import ShipmentCharts from "./ShipmentCharts";
import RecentShipmentsTable from "./RecentShipmentsTable";
import { axiosInstance } from "../../../axios";
import { PrimeSelectFilter } from "../../modularity/dropdowns/Dropdown";

const ShipmentPage = () => {
  const [selectedCarrier, setSelectedCarrier] = useState<string>("");
  const [selectedMethod, setSelectedMethod] = useState<string>("");
  const [carriers, setCarriers] = useState<string[]>([]);
  const [shippingMethods, setShippingMethods] = useState<string[]>([]);
  const [loadingFilters, setLoadingFilters] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        setLoadingFilters(true);
        const res = await axiosInstance.get<{
          carriers: string[];
          shipping_methods: string[];
        }>("shipment-filters/filter-values");

        setCarriers(res.data.carriers || []);
        setShippingMethods(res.data.shipping_methods || []);
      } catch (err) {
        console.error("Failed to fetch filters:", err);
        setError("Failed to load shipment filters.");
      } finally {
        setLoadingFilters(false);
      }
    };

    fetchFilters();
  }, []);

  const handleClearFilters = () => {
    setSelectedCarrier("");
    setSelectedMethod("");
  };

  return (
    <div className="w-full max-w-screen-2xl mx-auto space-y-8 overflow-x-hidden">
      <h1 className="app-section-title">Shipment Analytics</h1>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-end">
        {/* Carrier Dropdown */}
        <div>
          <label className="app-dropdown-label">Carrier</label>
          <PrimeSelectFilter<string>
            placeholder="Select Carrier"
            value={selectedCarrier}
            options={carriers.map((c) => ({ label: c, value: c }))}
            onChange={setSelectedCarrier}
            className="app-dropdown px-2 py-1 text-[0.85rem] leading-[0.95rem] h-8 flex items-center"
            disabled={loadingFilters}
          />
        </div>

        {/* Method Dropdown */}
        <div>
          <label className="app-dropdown-label">Shipping Method</label>
          <PrimeSelectFilter<string>
            placeholder="Select Shipping Method"
            value={selectedMethod}
            options={shippingMethods.map((m) => ({ label: m, value: m }))}
            onChange={setSelectedMethod}
            className="app-dropdown px-2 py-1 text-[0.85rem] leading-[0.95rem] h-8 flex items-center"
            disabled={loadingFilters}
          />
        </div>

        {/* Clear Filters Button */}
        <div className="flex items-center pt-6">
          <button
            className="
              text-sm font-semibold
              text-white bg-purple-700 hover:bg-purple-500
              rounded-md px-2 py-2.5
              transition-colors duration-200
              disabled:opacity-50 disabled:cursor-not-allowed
            "
            onClick={handleClearFilters}
            disabled={loadingFilters || (selectedCarrier === "" && selectedMethod === "")}
            title="Clear all filters"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Error message */}
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {/* KPI Cards */}
      <ShipmentStats
        selectedCarrier={selectedCarrier || null}
        selectedMethod={selectedMethod || null}
      />

      {/* Shipment Charts */}
      <div className="overflow-x-auto">
        <ShipmentCharts
          selectedCarrier={selectedCarrier || null}
          selectedMethod={selectedMethod || null}
        />
      </div>

      {/* Shipment Table */}
      <div className="overflow-x-auto">
        <RecentShipmentsTable />
      </div>
    </div>
  );
};

export default ShipmentPage;
