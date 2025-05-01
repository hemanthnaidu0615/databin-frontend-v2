import { geoCentroid } from "d3-geo";
import {
  Annotation,
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";
import React, { useState } from "react";
import allStates from "./data.json";
import states from "./states.json";

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

const offsets = {
  VT: [50, -8],
  NH: [34, 2],
  MA: [30, -1],
  RI: [28, 2],
  CT: [35, 10],
  NJ: [34, 1],
  DE: [33, 0],
  MD: [47, 10],
  DC: [49, 21],
};

interface MapChartProps {
  markers: any[];
  markers2: any[];
  markers3: any[];
  markers4: any[];
  markers5: any[];
  colorScale: (id: string) => string;
  revenueData: { [key: string]: string };
  theme: "light" | "dark";
  isDarkMode?: boolean;
}

interface Statess {
  [key: string]: string;
}

const statess: Statess = {
  AL: "Alabama",
  AK: "Alaska",
  AS: "American Samoa",
  AZ: "Arizona",
  AR: "Arkansas",
  CA: "California",
  CO: "Colorado",
  CT: "Connecticut",
  DE: "Delaware",
  DC: "District of Columbia",
  FL: "Florida",
  GA: "Georgia",
  HI: "Hawaii",
  ID: "Idaho",
  IL: "Illinois",
  IN: "Indiana",
  IA: "Iowa",
  KS: "Kansas",
  KY: "Kentucky",
  LA: "Louisiana",
  ME: "Maine",
  MD: "Maryland",
  MA: "Massachusetts",
  MI: "Michigan",
  MN: "Minnesota",
  MS: "Mississippi",
  MO: "Missouri",
  MT: "Montana",
  NE: "Nebraska",
  NV: "Nevada",
  NH: "New Hampshire",
  NJ: "New Jersey",
  NM: "New Mexico",
  NY: "New York",
  NC: "North Carolina",
  ND: "North Dakota",
  MP: "Northern Mariana Islands",
  OH: "Ohio",
  OK: "Oklahoma",
  OR: "Oregon",
  PA: "Pennsylvania",
  PR: "Puerto Rico",
  RI: "Rhode Island",
  SC: "South Carolina",
  SD: "South Dakota",
  TN: "Tennessee",
  TX: "Texas",
  UT: "Utah",
  VT: "Vermont",
  VA: "Virginia",
  WA: "Washington",
  WV: "West Virginia",
  WI: "Wisconsin",
  WY: "Wyoming",
};

const MapChart: React.FC<MapChartProps> = ({
  markers,
  markers2,
  markers3,
  markers4,
  markers5,
  colorScale,
  revenueData,
  isDarkMode = false,
}) => {
  const [tooltip, setTooltip] = useState<{
    display: boolean;
    content: string;
    x: number;
    y: number;
  }>({ display: false, content: "", x: 0, y: 0 });

  const handleMouseEnter = (
    e: React.MouseEvent<SVGGeometryElement, MouseEvent>,
    stateName: string
  ) => {
    const { clientX, clientY } = e;

    const dataString = revenueData?.[stateName] || "No data";
    const [revenuePart, quantityPart] = dataString.split(" + ");
    const content = `${stateName}\n----------------------- \n${revenuePart || "No data"}\n${quantityPart || "No data"}`;

    setTooltip({
      display: true,
      content,
      x: clientX,
      y: clientY,
    });
  };

  const handleMouseLeave = () => {
    setTooltip({ ...tooltip, display: false });
  };

  const textColor = isDarkMode ? "#ffffff" : "#000000"; // text color for contrast

  const mapBackground = isDarkMode ? "#1f2937" : "#F9FAFB"; // map background color based on theme

  return (
    <div className="h-full flex items-center justify-center relative">
      <ComposableMap projection="geoAlbersUsa" className="h-full">
        <Geographies geography={geoUrl}>
          {({ geographies }) => (
            <>
              {geographies.map((geo: any) => {
                const stateId =
                  Object?.entries(states)?.find(
                    (s) => s[1] === geo.properties.name
                  ) || [];
                const idValue: any =
                  allStates?.find((s) => s.id === stateId[0])?.id || 0;

                const color = colorScale(idValue as any);
                const stateName = statess[idValue] || geo.properties.name;

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onMouseEnter={(e) => handleMouseEnter(e, stateName)}
                    onMouseLeave={handleMouseLeave}
                    fill={color}
                    stroke={isDarkMode ? "#4B5563" : "#ffffff"}
                    strokeWidth={2}
                    style={{
                      default: {
                        fill: mapBackground,  // Map background color set to match the theme
                        stroke: isDarkMode ? "#6B7280" : "#9CA3AF", // lighter stroke for dark mode
                        strokeWidth: 0.5,
                      },
                      hover: {
                        fill: "#F53",
                        stroke: "#fff",
                        strokeWidth: 1,
                      },
                      pressed: {
                        fill: "#F53",
                      },
                    }}
                  />
                );
              })}
              {geographies.map((geo) => {
                const centroid = geoCentroid(geo);
                const cur = allStates.find((s) => s.val === geo.id);
                return (
                  <g key={geo.rsmKey + "-name"}>
                    {cur &&
                      centroid[0] > -160 &&
                      centroid[0] < -67 &&
                      (Object.keys(offsets).indexOf(cur.id) === -1 ? (
                        <Marker coordinates={centroid}>
                          <text
                            y="2"
                            fontSize={14}
                            textAnchor="middle"
                            fill={textColor} // Apply theme-based text color
                          >
                            {cur.id}
                          </text>
                        </Marker>
                      ) : (
                        <Annotation
                          subject={centroid}
                          dx={offsets[cur.id as keyof typeof offsets][0]}
                          dy={offsets[cur.id as keyof typeof offsets][1]}
                          connectorProps={{
                            stroke: "#7d6968",
                            strokeWidth: 1,
                            strokeLinecap: "round",
                          }}
                        >
                          <text
                            x={4}
                            y={0}
                            textAnchor="middle"
                            fontSize={14}
                            alignmentBaseline="middle"
                            fill={textColor} // Apply theme-based text color
                          >
                            {cur.id}
                          </text>
                        </Annotation>
                      ))}
                  </g>
                );
              })}
            </>
          )}
        </Geographies>

        {[markers, markers2, markers3, markers4, markers5].map(
          (markerSet, index) =>
            markerSet.map(({ coordinates, name }: any) => (
              <Marker key={`${name}-${index}`} coordinates={coordinates}>
                <circle
                  r={10}
                  fill={
                    index === 0
                      ? "#ff000070"
                      : index === 1
                      ? "#00ff0047"
                      : index === 2
                      ? "#b064d6cc"
                      : index === 3
                      ? "#92fdfeb8"
                      : "#eeff3394"
                  }
                  stroke={
                    index === 0
                      ? "#ff000070"
                      : index === 1
                      ? "#00ff0047"
                      : index === 2
                      ? "#b064d6cc"
                      : index === 3
                      ? "#92fdfeb8"
                      : "#eeff3394"
                  }
                  strokeWidth={2}
                />
                <text
                  textAnchor="middle"
                  style={{
                    fontFamily: "system-ui",
                    fill: textColor, // Apply theme-based text color here as well
                  }}
                ></text>
              </Marker>
            ))
        )}
      </ComposableMap>

      {tooltip.display && (
        <div
          className="tooltip"
          style={{
            position: "fixed",
            top: `${tooltip.y + 15}px`,
            left: `${tooltip.x + 15}px`,
            transform: `translate(${
              tooltip.x + 200 > window.innerWidth ? "-100%" : "0"
            }, ${tooltip.y + 100 > window.innerHeight ? "-100%" : "0"})`,
            background: isDarkMode ? "#1f2937" : "white",
            color: isDarkMode ? "#f9fafb" : "black", // Tooltip text color
            padding: "5px",
            border: `1px solid ${isDarkMode ? "#4B5563" : "#ccc"}`,
            zIndex: 1000,
            whiteSpace: "pre-line",
            pointerEvents: "none",
            borderRadius: "4px",
          }}
        >
          {tooltip.content}
        </div>
      )}
    </div>
  );
};

export default MapChart;
