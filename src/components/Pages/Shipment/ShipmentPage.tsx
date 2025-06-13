import { useEffect, useState } from "react";
import ShipmentStats from "./ShipmentKPI";
import ShipmentCharts from "./ShipmentCharts";
import RecentShipmentsTable from "./RecentShipmentsTable";
import { axiosInstance } from "../../../axios";
import SelectFilter from "../../modularity/dropdowns/Dropdown";

const ShipmentPage = () => {
  const [selectedCarrier, setSelectedCarrier] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("");
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

  return (
    <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 overflow-x-hidden">
      <h1 className="app-section-title">Shipment Analytics</h1>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-start">
        {/* Carrier Dropdown */}
        <div>
          <label className="app-dropdown-label">Carrier</label>
          <SelectFilter
            label="All carriers"
            value={selectedCarrier}
            options={carriers}
            onChange={setSelectedCarrier}
            className="app-dropdown"
            disabled={loadingFilters}
          />
        </div>

        {/* Method Dropdown */}
        <div>
          <label className="app-dropdown-label">Shipping Method</label>
          <SelectFilter
            label="All methods"
            value={selectedMethod}
            options={shippingMethods}
            onChange={setSelectedMethod}
            className="app-dropdown"
            disabled={loadingFilters}
          />
        </div>



      </div>

      {/* Error message if filters fail */}
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
        <RecentShipmentsTable
          selectedCarrier={selectedCarrier || null}
          selectedMethod={selectedMethod || null}
        />
      </div>
    </div>
  );
};

export default ShipmentPage;
