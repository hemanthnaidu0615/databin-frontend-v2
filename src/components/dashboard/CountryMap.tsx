import { useMemo } from "react";
import { VectorMap } from "@react-jvectormap/core";
import { usMill } from "@react-jvectormap/unitedstates";

interface USMapProps {
  mapColor?: string;
}

const stateData: Record<string, { orders: number; revenue: string }> = {
  NY: { orders: 1234, revenue: "$45,678" },
  CA: { orders: 2345, revenue: "$78,910" },
  IL: { orders: 3456, revenue: "$56,789" },
  TX: { orders: 2890, revenue: "$67,890" },
  FL: { orders: 2100, revenue: "$48,550" },
};

const USMap: React.FC<USMapProps> = ({ mapColor }) => {
  const markers = useMemo(
    () => [
      { latLng: [40.7128, -74.006], name: "NY" },
      { latLng: [34.0522, -118.2437], name: "CA" },
      { latLng: [41.8781, -87.6298], name: "IL" },
    ],
    []
  );

  return (
    <VectorMap
      map={usMill}
      backgroundColor="transparent"
      markers={markers}
      markerStyle={{
        initial: { fill: "#465FFF", r: 3 } as any,
      }}
      regionStyle={{
        initial: { fill: mapColor || "#D0D5DD", stroke: "none" },
        hover: { fill: "#465FFF", cursor: "pointer" },
        selected: { fill: "#465FFF" },
      }}
      series={{
        regions: [
          {
            values: Object.fromEntries(
              Object.keys(stateData).map((key) => [key, parseFloat(stateData[key].revenue.replace(/[^0-9.-]+/g, ""))])
            ),
            attribute: "fill",
          },
        ],
      }}
      onRegionTipShow={(e, el, code) => {
        if (stateData[code]) {
          el.innerHTML = `<strong>${code}</strong><br/>Orders: ${stateData[code].orders}<br/>Revenue: ${stateData[code].revenue}`;
        }
      }}
      style={{
        width: "100%",
        height: "120px",
      }}
    />
  );
};

export default USMap;
