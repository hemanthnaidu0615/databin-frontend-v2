import { useTheme } from "next-themes";
import { useState, useRef, useEffect } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const US_TOPO_JSON = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

// Updated dummy data for tooltip with customers, revenue, and avgRevenue
const dummyStateData: Record<
  string,
  { customers: number; revenue: number; avgRevenue: number }
> = {
  California: { customers: 1200, revenue: 24000, avgRevenue: 20 },
  Texas: { customers: 1000, revenue: 18000, avgRevenue: 18 },
  Florida: { customers: 800, revenue: 12000, avgRevenue: 15 },
  "New York": { customers: 650, revenue: 9500, avgRevenue: 14.6 },
  Illinois: { customers: 600, revenue: 8000, avgRevenue: 13.3 },
  Georgia: { customers: 580, revenue: 7500, avgRevenue: 12.9 },
  Arizona: { customers: 560, revenue: 7200, avgRevenue: 12.8 },
  Washington: { customers: 550, revenue: 7000, avgRevenue: 12.7 },
  Colorado: { customers: 530, revenue: 6800, avgRevenue: 12.8 },
  Michigan: { customers: 500, revenue: 6500, avgRevenue: 13 },
};

const DemographicCard = () => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const [tooltip, setTooltip] = useState<{
    name: string;
    customers: number;
    revenue: number;
    avgRevenue: number;
    x: number;
    y: number;
  } | null>(null);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleViewMore = () => {
    setDropdownOpen(false);
    navigate("/sales/region");
  };

  return (
    <div className="w-full p-4 sm:p-5 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-md relative">
      {/* Header with dropdown */}
      <div className="flex justify-between items-start mb-2">
        <div>
          <div className="text-gray-900 dark:text-white font-semibold text-lg">
            Customers Demographic
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Customers and revenue per state
          </div>
        </div>

        <button
          onClick={handleViewMore}
          className="text-xs font-medium hover:underline"
          style={{ color: "#9614d0" }}
        >
          View More
        </button>
      </div>

      {/* Map */}
      <div className="relative w-full aspect-[3/1.5] bg-white dark:bg-gray-900">
        <ComposableMap projection="geoAlbersUsa" width={1050} height={551}>
          <Geographies geography={US_TOPO_JSON}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const stateName = geo.properties.name;
                const data = dummyStateData[stateName] || {
                  customers: 0,
                  revenue: 0,
                  avgRevenue: 0,
                };

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={isDark ? "#ffffff" : "#e0e0e0"}
                    stroke="#473838"
                    strokeWidth={0.5}
                    onMouseEnter={(e) =>
                      setTooltip({
                        name: stateName,
                        customers: data.customers,
                        revenue: data.revenue,
                        avgRevenue: data.avgRevenue,
                        x: e.clientX,
                        y: e.clientY,
                      })
                    }
                    onMouseLeave={() => setTooltip(null)}
                    style={{
                      default: { outline: "none" },
                      hover: { fill: "#4FD1C5", outline: "none" },
                      pressed: { outline: "none" },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>

        {tooltip && (
          <div
            className="fixed z-50 text-xs rounded shadow px-3 py-2 whitespace-pre-line"
            style={{
              top: tooltip.y + 10,
              left: tooltip.x + 10,
              backgroundColor: isDark ? "#2d2d2d" : "#ffffff",
              color: isDark ? "#ffffff" : "#000000",
              border: `1px solid ${isDark ? "#444" : "#ccc"}`,
              pointerEvents: "none",
            }}
          >
            <strong>{tooltip.name}</strong>
            {`\nCustomers: ${tooltip.customers}\nRevenue: $${tooltip.revenue.toLocaleString()}\nAvg Revenue: $${tooltip.avgRevenue.toLocaleString()}`}
          </div>
        )}
      </div>

      {/* Footer Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
        <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Returning vs New
          </p>
          <p className="text-lg font-semibold text-gray-800 dark:text-white">
            0 / 17816
          </p>
        </div>
        <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Avg Order Value
          </p>
          <p className="text-lg font-semibold text-gray-800 dark:text-white">
            $15,528.00
          </p>
        </div>
        <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            High Spenders
          </p>
          <p className="text-lg font-semibold text-gray-800 dark:text-white">
            10
          </p>
        </div>
      </div>
    </div>
  );
};

export default DemographicCard;
