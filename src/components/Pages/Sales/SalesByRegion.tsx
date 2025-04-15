import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import moment from "moment";
import MapChart from "./us-map/USMap";
import states from "./us-map/states.json";
import {authFetch} from "../../../axios";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ProgressSpinner } from "primereact/progressspinner";
import { setCache,getCache } from "../../utils/cacheByRegion";

interface Marker {
  color: string;
  value: string;
  legend:string;
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
export const SalesByRegion = () => {
  const [mapData, setMapData] = useState<any>();
  const { dates } = useSelector((store: any) => store.dateRange);
  const enterpriseKey = useSelector((store: any) => store.enterprise.key);
  const [tooltipData, setTooltipData] = useState<{ [key: string]: string }>({});
  const cacheKey = `${moment(dates[0]).format("YYYY-MM-DD")}_${moment(dates[1]).format("YYYY-MM-DD")}_${enterpriseKey}`;

  const formatter = new Intl.NumberFormat("en-US", {
    notation: "compact",
    compactDisplay: "short",
  });

  const formatterUSD = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  useEffect(() => {
    const fetchData = async () => {
      const cachedItem = getCache(cacheKey);

      if (cachedItem) {
        setMapData(cachedItem.data);
        setTooltipData(cachedItem.tooltipData);
        return;
      }

      const formattedStartDate = moment(dates[0]).format("YYYY-MM-DD 00:00:00");
      const formattedEndDate = moment(dates[1]).format("YYYY-MM-DD 00:00:00");
      try {
        const response = await authFetch(
          `/tables/map?start_date=${formattedStartDate}&end_date=${formattedEndDate}&enterprise_key=${enterpriseKey}`,{
            headers: {
              'Cache-Control': 'no-cache',
              'Pragma': 'no-cache',
            }
          }
        );
        const data = response.data;
        setMapData(data);

        const tooltipMap: { [key: string]: string } = data.reduce((acc: any, item: any) => {
          const stateAbbreviation = item[0].split("-")[1].toUpperCase();
          const stateName = statess[stateAbbreviation];
          const revenue = formatterUSD.format(item[1]);
          const quantity = new Intl.NumberFormat('en-US').format(item[3]);
          acc[stateName] = `Revenue: ${revenue} + Quantity: ${quantity}`;
          return acc;
        }, {});
       
        setTooltipData(tooltipMap);
        setCache(cacheKey, data, tooltipMap);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [dates, enterpriseKey]);

  // console.log("Dates from Redux:", dates); 
  // console.log("Enterprise Key from Redux:", enterpriseKey); 
  
  if (!mapData) {
    return (
      <div className="flex justify-center items-center my-auto mx-auto">
        <ProgressSpinner />
      </div>
    );
  }
  
  const stateAbbreviations: { [key: string]: string } = states;

  const result: string[][] = mapData.map((subArray: string[]) => {
    const stateAbbreviation: string = subArray[0].split("-")[1].toUpperCase();
    const stateName: string = stateAbbreviations[stateAbbreviation];
    return [stateName, ...subArray.slice(1)];
  });

 
  function convertArrayToObject(arr: any) {
    return arr.map((innerArr: any) => ({
      state: innerArr[0],
      totalDollar: `${formatterUSD.format(innerArr[1])}`,
      percentage: `${innerArr[2]} %`,
      quantity: new Intl.NumberFormat('en-US').format(innerArr[3]),
    }));

  }

  const tableData = convertArrayToObject(result);

  const topStates = mapData.slice(0, 5);
  const colorScale = (idValue: string) => {
    switch (idValue) {
      case topStates[0][0].toUpperCase().substring(3):
        return "#58ddf5";
      case topStates[1][0].toUpperCase().substring(3):
        return "#65f785";
      case topStates[2][0].toUpperCase().substring(3):
        return "#f5901d";
      case topStates[3][0].toUpperCase().substring(3):
        return "#f7656c";
      case topStates[4][0].toUpperCase().substring(3):
        return "#8518b8";
      default:
        return "#d6d4d0";
    }
  };
  // console.log(topStates)
  const markersList = topStates.map((state: any) => ({
    legend: state[0].split('-')[1].toUpperCase(),
    color: colorScale(state[0].toUpperCase().substring(3)),
    value: formatter.format(state[1]),
  }));

  return (
    <div className="h-full w-full flex flex-col m-2 rounded-lg bg-white border-2">
      <div className="w-full h-2 bg-purple-300 rounded-t-lg"></div>
      <div className="flex justify-between px-3 py-2">
        <h1 className="text-2xl font-semibold text-md text-violet-800">
          Sales by Region
        </h1>
      </div>
      <div className="flex flex-col flex-1 shadow-lg rounded-lg border-slate-200 border-2 divide-y-2 divide-slate-200 divide-dashed px-2">
        <div className="flex justify-between p-2">
          <h3 className="text-xl flex items-center font-bold">
            Countrywide Sales
          </h3>
        </div>

        <div className="flex gap-24 py-2 items-center justify-center">
          <div className="w-[500px] flex flex-col">
          <div className="relative h-[335px]"> 
           <MapChart
             markers={[]}
             markers2={[]}
             markers3={[]}
             markers4={[]}
             markers5={[]}
             colorScale={colorScale}
             revenueData={tooltipData}
           />
          </div>
            <div className="flex flex-col p-2 gap-4 max-w-xs">
            <div className="text-xs p-2 text-violet-900 bg-red-100 font-bold rounded-sm">
              Top 5 revenues
            </div>
            <div className="flex flex-col gap-1">
             
             {markersList.map((item: Marker) => (
              <span key={item.color} className="flex items-center gap-2">
              
            <div
              className="rounded-full h-[9px] w-[9px]"
              style={{ backgroundColor: `${item.color}` }}
            ></div>
              <p className="text-xs text-violet-900">
               {item.legend} - ${item.value}
              </p>
          </span>
            ))}
        </div>
       </div>
          </div>
          <div className="w-[480px]">
            <h3 className="font-bold text-lg mb-2 text-violet-800">
              Top 10 Revenues
            </h3>
            <DataTable
              value={tableData.slice(0, 10)}
              size="small"
              className="text-sm"
              showGridlines
            >
              <Column
                field="state"
                header="State"
                pt={{ bodyCell: { className: "h-5 text-center" } }}
                headerClassName="bg-purple-100"
              />
              <Column
                field="totalDollar"
                header="Total $ Value"
                pt={{ bodyCell: { className: "h-5 text-center" } }}
                headerClassName="bg-purple-100"
              />
              <Column
                field="percentage"
                header="Percentage"
                pt={{ bodyCell: { className: "h-5 text-center" } }}
                headerClassName="bg-purple-100"
              />
              <Column
                field="quantity"
                header="Quantity"
                pt={{ bodyCell: { className: "h-5 text-center" } }}
                headerClassName="bg-purple-100"
                />
            </DataTable>
          </div>
        </div>
      </div>
      
    </div>
  );
};
