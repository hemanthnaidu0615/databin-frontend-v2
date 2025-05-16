import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Annotation,
} from "react-simple-maps";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import allStates from "./allStates.json"; // <-- Ensure this file exists

const US_TOPO_JSON = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";
const INR_TO_USD = 1 / 83.3;

const CANONICAL_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado",
  "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho",
  "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine",
  "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi",
  "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey",
  "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio",
  "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina",
  "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia",
  "Washington", "West Virginia", "Wisconsin", "Wyoming",
];

const STATE_NAME_MAP = CANONICAL_STATES.reduce((acc, name) => {
  acc[name.toLowerCase()] = name;
  return acc;
}, {} as Record<string, string>);

const formatValue = (value: number) => {
  const usd = value * INR_TO_USD;
  if (usd >= 1_000_000) return `$${(usd / 1_000_000).toFixed(1)}m`;
  if (usd >= 1_000) return `$${(usd / 1_000).toFixed(1)}k`;
  return `$${usd.toFixed(0)}`;
};

const formatDate = (date: string) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}-${d
    .getDate()
    .toString()
    .padStart(2, "0")} ${d.getHours().toString().padStart(2, "0")}:${d
    .getMinutes()
    .toString()
    .padStart(2, "0")}:${d.getSeconds().toString().padStart(2, "0")}`;
};

const DemographicCard = () => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const navigate = useNavigate();

  const dateRange = useSelector((state: any) => state.dateRange.dates);
  const enterpriseKey = useSelector((state: any) => state.enterpriseKey.key);
  const [startDate, endDate] = dateRange;

  const [tooltip, setTooltip] = useState<{
    name: string;
    customers: number;
    revenue: number;
    avgRevenue: number;
    x: number;
    y: number;
  } | null>(null);

  const [stateData, setStateData] = useState<
    Record<string, { customers: number; revenue: number; avgRevenue: number }>
  >({});

  const [metrics, setMetrics] = useState({
    newCustomers: 0,
    returningCustomers: 0,
    avgOrderValue: 0,
    highSpenders: 0,
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const formattedStart = formatDate(startDate);
        const formattedEnd = formatDate(endDate);
        const params = new URLSearchParams({
          startDate: formattedStart,
          endDate: formattedEnd,
        });
        if (enterpriseKey) params.append("enterpriseKey", enterpriseKey);

        const [mapRes, metricRes] = await Promise.all([
          fetch(`http://localhost:8080/api/sales/map-metrics?${params.toString()}`),
          fetch(`http://localhost:8080/api/sales/metrics?${params.toString()}`),
        ]);

        const mapData = await mapRes.json();
        const metricsData = await metricRes.json();

        const formatted: Record<
          string,
          { customers: number; revenue: number; avgRevenue: number }
        > = {};

        if (Array.isArray(mapData)) {
          mapData.forEach((row) => {
            const raw = row.state?.trim().toLowerCase();
            const canonicalName = STATE_NAME_MAP[raw];
            if (!canonicalName) {
              console.warn(`State name mismatch: "${row.state}" not found in map.`);
              return;
            }
            const customers = row.total_customers || 0;
            const avgRevenue = row.average_revenue || 0;
            const revenue = customers * avgRevenue;

            formatted[canonicalName] = {
              customers,
              revenue,
              avgRevenue,
            };
          });

          setStateData(formatted);
        }

        if (metricsData) {
          setMetrics({
            newCustomers: metricsData.new_customers || 0,
            returningCustomers: metricsData.returning_customers || 0,
            avgOrderValue: metricsData.avg_order_value || 0,
            highSpenders: metricsData.high_spenders || 0,
          });
        }
      } catch (err) {
        console.error("Failed to load sales data:", err);
      }
    }

    if (startDate && endDate) fetchData();
  }, [startDate, endDate, enterpriseKey]);

  const handleViewMore = () => {
    navigate("/sales/region");
  };

  return (
    <div className="w-full p-4 sm:p-5 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-md relative">
      <div className="flex justify-between items-start ">
        <div>
          <div className="text-gray-900 dark:text-white font-semibold text-lg mb-2">
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

      <div className="relative w-full h-[min(400px,40vw)] bg-white dark:bg-gray-900">
        <ComposableMap
          projection="geoAlbersUsa"
          width={980}
          height={520}
          style={{ width: "100%", height: "auto" }}
        >
          <Geographies geography={US_TOPO_JSON}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const stateName = geo.properties.name;
                const data = stateData[stateName] || {
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

          {/* State Labels */}
          {allStates.map(({ name, abbreviation, coordinates }) => (
            <Annotation
              key={name}
              subject={coordinates.slice(0, 2) as [number, number]}
              dx={0}
              dy={0}
              connectorProps={{}}
            >
              <text
                x={0}
                y={0}
                textAnchor="middle"
                alignmentBaseline="central"
                fill={isDark ? "#ffffff" : "#000000"}
                fontSize={10}
                fontWeight="bold"
              >
                {abbreviation}
              </text>
            </Annotation>
          ))}
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
            {`\nCustomers: ${tooltip.customers}\nRevenue: ${formatValue(
              tooltip.revenue
            )}\nAvg Revenue: ${formatValue(tooltip.avgRevenue)}`}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
        <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Returning vs New
          </p>
          <p className="text-lg font-semibold text-gray-800 dark:text-white">
            {metrics.returningCustomers} / {metrics.newCustomers}
          </p>
        </div>
        <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Avg Order Value
          </p>
          <p className="text-lg font-semibold text-gray-800 dark:text-white">
            {formatValue(metrics.avgOrderValue)}
          </p>
        </div>
        <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            High Spenders
          </p>
          <p className="text-lg font-semibold text-gray-800 dark:text-white">
            {metrics.highSpenders}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DemographicCard;
 