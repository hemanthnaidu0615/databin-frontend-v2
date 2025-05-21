import { geoCentroid } from "d3-geo";
import {
  Annotation,
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";
import React, { useState } from 'react';
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
  colorScale: (idValue: string) => string;
  revenueData?: { [key: string]: string };
}


interface Statess {
  [key: string]: string;
}

const statess: Statess = {
  AL: 'Alabama',
  AK: 'Alaska',
  AS: 'American Samoa',
  AZ: 'Arizona',
  AR: 'Arkansas',
  CA: 'California',
  CO: 'Colorado',
  CT: 'Connecticut',
  DE: 'Delaware',
  DC: 'District of Columbia',
  FL: 'Florida',
  GA: 'Georgia',
  HI: 'Hawaii',
  ID: 'Idaho',
  IL: 'Illinois',
  IN: 'Indiana',
  IA: 'Iowa',
  KS: 'Kansas',
  KY: 'Kentucky',
  LA: 'Louisiana',
  ME: 'Maine',
  MD: 'Maryland',
  MA: 'Massachusetts',
  MI: 'Michigan',
  MN: 'Minnesota',
  MS: 'Mississippi',
  MO: 'Missouri',
  MT: 'Montana',
  NE: 'Nebraska',
  NV: 'Nevada',
  NH: 'New Hampshire',
  NJ: 'New Jersey',
  NM: 'New Mexico',
  NY: 'New York',
  NC: 'North Carolina',
  ND: 'North Dakota',
  MP: 'Northern Mariana Islands',
  OH: 'Ohio',
  OK: 'Oklahoma',
  OR: 'Oregon',
  PA: 'Pennsylvania',
  PR: 'Puerto Rico',
  RI: 'Rhode Island',
  SC: 'South Carolina',
  SD: 'South Dakota',
  TN: 'Tennessee',
  TX: 'Texas',
  UT: 'Utah',
  VT: 'Vermont',
  VA: 'Virginia',
  WA: 'Washington',
  WV: 'West Virginia',
  WI: 'Wisconsin',
  WY: 'Wyoming',
};


const MapChart: React.FC<MapChartProps> = ({
  markers,
  markers2,
  markers3,
  markers4,
  markers5,
  colorScale,
  revenueData,
}) => {
  const [tooltip, setTooltip] = useState<{ display: boolean, content: string, x: number, y: number }>({ display: false, content: '', x: 0, y: 0 });
  const handleMouseEnter = (e: React.MouseEvent<SVGGeometryElement, MouseEvent>, stateName: string) => {
    const { clientX, clientY } = e;

    const dataString = revenueData?.[stateName] || 'No data';


    const [revenuePart, quantityPart] = dataString.split(' + ');

    const content = `${stateName}\n----------------------- \n${revenuePart || 'No data'}\n${quantityPart || 'No data'}`;

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
                    stroke="#ffffff"
                    strokeWidth={2}
                    geography={geo}
                    fill={color}
                    onMouseEnter={(e) => handleMouseEnter(e, stateName)}
                    onMouseLeave={handleMouseLeave}
                    style={{
                      hover: {
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
                          <text y="2" fontSize={14} textAnchor="middle">
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
                          <text x={4} y={0} textAnchor="middle" fontSize={14} alignmentBaseline="middle">
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
        {markers.map(({ coordinates, name }: any) => (
          <Marker key={name} coordinates={coordinates}>
            <circle
              r={10}
              fill="#ff000070"
              stroke="#ff000070"
              strokeWidth={2}
            />
            <text
              textAnchor="middle"
              alignmentBaseline="middle"
              style={{ fontFamily: "system-ui", fill: "#5D5A6D" }}
            ></text>
          </Marker>
        ))}
        {markers2.map(({ coordinates, name }: any) => (
          <Marker key={name} coordinates={coordinates}>
            <circle
              r={10}
              fill="#00ff0047"
              stroke="#00ff0047"
              strokeWidth={2}
            />
            <text
              textAnchor="middle"
              style={{ fontFamily: "system-ui", fill: "#5D5A6D" }}
            ></text>
          </Marker>
        ))}
        {markers3.map(({ coordinates, name }: any) => (
          <Marker key={name} coordinates={coordinates}>
            <circle
              r={10}
              fill="#b064d6cc"
              stroke="#b064d6cc"
              strokeWidth={2}
            />
            <text
              textAnchor="middle"
              style={{ fontFamily: "system-ui", fill: "#5D5A6D" }}
            ></text>
          </Marker>
        ))}
        {markers4.map(({ coordinates, name }: any) => (
          <Marker key={name} coordinates={coordinates}>
            <circle
              r={10}
              fill="#92fdfeb8"
              stroke="#92fdfeb8"
              strokeWidth={2}
            />
            <text
              textAnchor="middle"
              style={{ fontFamily: "system-ui", fill: "#5D5A6D" }}
            ></text>
          </Marker>
        ))}
        {markers5.map(({ coordinates, name }: any) => (
          <Marker key={name} coordinates={coordinates}>
            <circle
              r={10}
              fill="#eeff3394"
              stroke="#eeff3394"
              strokeWidth={2}
            />
            <text
              textAnchor="middle"
              style={{ fontFamily: "system-ui", fill: "#5D5A6D" }}
            ></text>
          </Marker>
        ))}
      </ComposableMap>
      {tooltip.display && (
        <div
          className="tooltip"
          style={{
            position: 'fixed',
            top: `${tooltip.y + 15}px`,
            left: `${tooltip.x + 15}px`,
            transform: `translate(${tooltip.x + 200 > window.innerWidth ? '-100%' : '0'}, ${tooltip.y + 100 > window.innerHeight ? '-100%' : '0'})`,
            background: 'white',
            padding: '5px',
            border: '1px solid #ccc',
            zIndex: 1000,
            whiteSpace: 'pre-line',
            pointerEvents: 'none',
          }}
        >
          {tooltip.content}
        </div>
      )}

    </div>
  );
};

export default MapChart;
