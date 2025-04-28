import React from "react";
import { VectorMap } from "@react-jvectormap/core";
import { usMill } from "@react-jvectormap/unitedstates";

type USMapProps = {
  mapColor?: string;
};

const stateData: Record<
  string,
  { orders: number; revenue: string; customers: number }
> = {
  CA: { orders: 1200, revenue: "$150K", customers: 900 },
  TX: { orders: 950, revenue: "$110K", customers: 750 },
  NY: { orders: 850, revenue: "$100K", customers: 680 },
  FL: { orders: 800, revenue: "$95K", customers: 620 },
  IL: { orders: 720, revenue: "$85K", customers: 590 },
  // Add more state data here
};

const CountryMap: React.FC<USMapProps> = ({ mapColor }) => {
  return (
    <div className="w-full h-full relative">
      <VectorMap
        map={usMill}
        backgroundColor="transparent"
        regionStyle={{
          initial: {
            fill: mapColor || "#D0D5DD",
            stroke: "none",
          },
          hover: {
            fill: "#465FFF",
            cursor: "pointer",
          },
          selected: {
            fill: "#465FFF",
          },
        }}
        series={{
          regions: [
            {
              values: Object.fromEntries(
                Object.entries(stateData).map(([key, value]) => [
                  key,
                  parseFloat(value.revenue.replace(/[^0-9.-]+/g, "")),
                ])
              ),
              attribute: "fill",
            },
          ],
        }}
        onRegionTipShow={(_, el, code) => {
          const state = stateData[code];
          if (state) {
            (el as HTMLElement).innerHTML = `
              <strong>${code}</strong><br/>
              Orders: ${state.orders}<br/>
              Revenue: ${state.revenue}<br/>
              Customers: ${state.customers}
            `;
          }
        }}
      />
    </div>
  );
};

export default CountryMap;
