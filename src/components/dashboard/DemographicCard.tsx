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

// import { useState, useEffect } from "react";
// import { ComposableMap, Geographies, Geography } from "react-simple-maps";
// import { Card } from "primereact/card"; // Import Card from PrimeReact
// import { HiMenu } from "react-icons/hi"; // Import Menu icon from react-icons

// const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

// const dummyRevenueData: Record<string, number> = {
//   California: 24000,
//   Texas: 18000,
//   Florida: 12000,
//   Illinois: 8000,
//   Georgia: 7000,
//   Washington: 6500,
//   Arizona: 5000,
//   Colorado: 4800,
//   Michigan: 4700,
// };

// const DemographicCard = () => {
//   const [hoveredState, setHoveredState] = useState<string | null>(null);
//   const [isDarkTheme, setIsDarkTheme] = useState(false);

//   // Detect the current theme
//   useEffect(() => {
//     // Check if dark theme is applied (adjust this according to your theme logic)
//     const theme = document.documentElement.classList.contains("dark");
//     setIsDarkTheme(theme);
//   }, []);

//   const handleMouseEnter = (stateName: string) => {
//     setHoveredState(stateName);
//   };

//   const handleMouseLeave = () => {
//     setHoveredState(null);
//   };

//   return (
//     <Card className="h-full w-full p-4">
//       <div className="flex justify-between items-center mb-2">
//         <div>
//           <h2 className="text-lg font-semibold text-foreground">Customers Demographic</h2>
//           <p className="text-muted-foreground text-sm">Orders and revenue per state</p>
//         </div>
//         <HiMenu className="text-muted-foreground h-5 w-5" /> {/* Using HiMenu from react-icons */}
//       </div>

//       <div className="w-full overflow-x-auto">
//         <div className="min-w-[300px] w-full h-[250px] sm:h-[300px] relative">
//           <ComposableMap projection="geoAlbersUsa" width={800} height={400} style={{ width: "100%", height: "100%" }}>
//             <Geographies geography={geoUrl}>
//               {({ geographies }) =>
//                 geographies.map((geo) => {
//                   const stateName = geo.properties.name;
//                   return (
//                     <Geography
//                       key={geo.rsmKey}
//                       geography={geo}
//                       fill={isDarkTheme ? "#4B5563" : "#F3F4F6"} // Lighter fill in dark mode, white in light mode
//                       stroke={isDarkTheme ? "#6B7280" : "#E5E7EB"} // Slightly darker stroke in dark mode, light in light mode
//                       onMouseEnter={() => handleMouseEnter(stateName)}
//                       onMouseLeave={handleMouseLeave}
//                       style={{
//                         default: { outline: "none" },
//                         hover: {
//                           fill: isDarkTheme ? "#60A5FA" : "#2563EB", // Brighter hover color for both themes
//                           outline: "none",
//                         },
//                         pressed: { outline: "none" },
//                       }}
//                     />
//                   );
//                 })
//               }
//             </Geographies>
//           </ComposableMap>

//           {hoveredState && (
//             <div
//               className="absolute top-0 left-0 bg-white p-4 shadow-lg rounded-md"
//               style={{ transform: "translate(50px, 50px)" }}
//             >
//               <h3 className="text-xl font-semibold">{hoveredState}</h3>
//               <p className="text-sm text-muted-foreground">
//                 Revenue: ${dummyRevenueData[hoveredState]}
//               </p>
//               <p className="text-sm text-muted-foreground">Orders: {Math.floor(Math.random() * 5000)}</p>
//             </div>
//           )}
//         </div>
//       </div>

//       <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
//         <div>
//           <p className="text-sm text-muted-foreground">Returning vs New</p>
//           <p className="font-semibold text-lg text-foreground">0 / 17816</p>
//         </div>
//         <div>
//           <p className="text-sm text-muted-foreground">Avg Order Value</p>
//           <p className="font-semibold text-lg text-foreground">$15528.00</p>
//         </div>
//         <div>
//           <p className="text-sm text-muted-foreground">High Spenders</p>
//           <p className="font-semibold text-lg text-foreground">10</p>
//         </div>
//       </div>
//     </Card>
//   );
// };

// export default DemographicCard;
