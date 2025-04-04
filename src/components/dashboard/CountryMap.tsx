import { VectorMap } from "@react-jvectormap/core";
import { usMill } from "@react-jvectormap/unitedstates";

interface USMapProps {
  mapColor?: string;
}

// Dummy customer data per state
const stateData: Record<
  string,
  { orders: number; revenue: string; customers: number }
> = {
  NY: { orders: 1234, revenue: "$45,678", customers: 500 },
  CA: { orders: 2345, revenue: "$78,910", customers: 750 },
  IL: { orders: 3456, revenue: "$56,789", customers: 620 },
  TX: { orders: 2890, revenue: "$67,890", customers: 830 },
  FL: { orders: 2100, revenue: "$48,550", customers: 410 },
};

const USMap: React.FC<USMapProps> = ({ mapColor }) => {
  return (
    <VectorMap
      map={usMill}
      backgroundColor="transparent"
      regionStyle={{
        initial: { fill: mapColor || "#D0D5DD", stroke: "none" },
        hover: { fill: "#465FFF", cursor: "pointer" },
        selected: { fill: "#465FFF" },
      }}
      series={{
        regions: [
          {
            values: Object.fromEntries(
              Object.keys(stateData).map((key) => [
                key,
                parseFloat(stateData[key].revenue.replace(/[^0-9.-]+/g, "")),
              ])
            ),
            attribute: "fill",
          },
        ],
      }}
      onRegionTipShow={(e, el, code) => {
        console.log("Tooltip triggered for:", code); // Debugging log
        if (stateData[code]) {
          console.log("State Data:", stateData[code]); // Debugging log

          (el as unknown as HTMLElement).innerHTML = `
            <strong>${code}</strong><br/>
            Orders: ${stateData[code].orders}<br/>
            Revenue: ${stateData[code].revenue}<br/>
            Customers: ${stateData[code].customers}
          `;
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
