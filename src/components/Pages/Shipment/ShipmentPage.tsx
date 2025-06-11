import { useEffect, useState } from "react";
import ShipmentStats from "./ShipmentStats";
import ShipmentCharts from "./ShipmentCharts";
import RecentShipmentsTable from "./RecentShipmentsTable";
import { axiosInstance } from "../../../axios";

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
    <div className="w-full max-w-screen-2xl mx-auto space-y-8 overflow-x-hidden">
      <h1 className="app-section-title">Shipment Analytics</h1>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-start">
        {/* Carrier Dropdown */}
        <div>
          <label className="app-dropdown-label">Carrier</label>
          <select
            className="app-dropdown"
            value={selectedCarrier}
            onChange={(e) => setSelectedCarrier(e.target.value)}
            disabled={loadingFilters}
          >
            <option value="">All carriers</option>
            {carriers.map((carrier) => (
              <option key={carrier} value={carrier}>
                {carrier}
              </option>
            ))}
          </select>
        </div>

        {/* Method Dropdown */}
        <div>
          <label className="app-dropdown-label">Shipping Method</label>
          <select
            className="app-dropdown"
            value={selectedMethod}
            onChange={(e) => setSelectedMethod(e.target.value)}
            disabled={loadingFilters}
          >
            <option value="">All methods</option>
            {shippingMethods.map((method) => (
              <option key={method} value={method}>
                {method}
              </option>
            ))}
          </select>
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
