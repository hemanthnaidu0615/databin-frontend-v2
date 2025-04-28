import { useTheme } from "next-themes";
import { useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

const US_TOPO_JSON = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

// Dummy data for tooltip
const dummyStateData: Record<string, { orders: number; revenue: number }> = {
  California: { orders: 1200, revenue: 24000 },
  Texas: { orders: 1000, revenue: 18000 },
  Florida: { orders: 800, revenue: 12000 },
  "New York": { orders: 650, revenue: 9500 },
  Illinois: { orders: 600, revenue: 8000 },
  Georgia: { orders: 580, revenue: 7500 },
  Arizona: { orders: 560, revenue: 7200 },
  Washington: { orders: 550, revenue: 7000 },
  Colorado: { orders: 530, revenue: 6800 },
  Michigan: { orders: 500, revenue: 6500 },
};

const DemographicCard = () => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const [tooltip, setTooltip] = useState<{
    name: string;
    orders: number;
    revenue: number;
    x: number;
    y: number;
  } | null>(null);

  return (
    <div className="w-full p-4 bg-white dark:bg-gray-900 rounded-xl shadow">
      <div className="text-gray-900 dark:text-white  dark:bg-gray-900  font-semibold text-lg mb-2">
        Customers Demographic

      </div>
      <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Orders and revenue per state
      </div>

      <div className="relative w-full aspect-[3/1.5]  bg-white dark:bg-gray-900  ">
        <ComposableMap projection="geoAlbersUsa" width={1050} height={551}>
          <Geographies geography={US_TOPO_JSON}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const stateName = geo.properties.name;
                const data = dummyStateData[stateName] || {
                  orders: 0,
                  revenue: 0,
                };

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={isDark ? "#ffffff" : "#e0e0e0"} // White for dark theme, gray for light theme
                    stroke="#473838" // Black stroke for both light and dark theme
                    strokeWidth={0.5}
                    onMouseEnter={(e) =>
                      setTooltip({
                        name: stateName,
                        orders: data.orders,
                        revenue: data.revenue,
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
            {`\nOrders: ${
              tooltip.orders
            }\nRevenue: $${tooltip.revenue.toLocaleString()}`}
          </div>
        )}
      </div>

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


