import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import MapChart from "./us-map/USMap";
import states from "./us-map/states.json";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

interface Marker {
  color: string;
  value: string;
  legend: string;
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

  // const { dates } = useSelector((store: any) => store.dateRange);
  // const enterpriseKey = useSelector((store: any) => store.enterprise.key);
  export const SalesByRegion = () => {
    const [theme, setTheme] = useState<"dark" | "light">("light");
  
    // Optional: update theme dynamically
    useEffect(() => {
      const observer = new MutationObserver(() => {
        const isDark = document.documentElement.classList.contains("dark");
        setTheme(isDark ? "dark" : "light");
      });
  
      observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
      return () => observer.disconnect();
    }, []);
  
    const formatter = new Intl.NumberFormat("en-US", {
      notation: "compact",
      compactDisplay: "short",
    });
  
    const formatterUSD = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    });
  
    const dummyMapData = [
      ["USA-AL", 150000, 5.1, 1300],
      ["USA-AK", 180000, 6.2, 1500],
      ["USA-AZ", 250000, 8.4, 1700],
      ["USA-AR", 200000, 7.5, 1400],
      ["USA-CA", 350000, 12.5, 2400],
      ["USA-CO", 275000, 10.2, 2100],
      ["USA-CT", 225000, 9.3, 1800],
      ["USA-DE", 100000, 4.2, 1300],
      ["USA-FL", 225000, 8.3, 1800],
      ["USA-GA", 300000, 10.8, 2000],
      ["USA-HI", 120000, 5.8, 1100],
      ["USA-ID", 130000, 6.0, 1000],
      ["USA-IL", 320000, 11.0, 2200],
      ["USA-IN", 250000, 9.5, 1800],
      ["USA-IA", 200000, 7.2, 1600],
      ["USA-KS", 180000, 6.8, 1400],
      ["USA-KY", 210000, 8.0, 1500],
      ["USA-LA", 270000, 9.0, 1900],
      ["USA-ME", 120000, 5.0, 1100],
      ["USA-MD", 220000, 8.7, 1800],
      ["USA-MA", 275000, 10.3, 2000],
      ["USA-MI", 300000, 10.5, 2100],
      ["USA-MN", 250000, 8.2, 1900],
      ["USA-MS", 150000, 6.5, 1300],
      ["USA-MO", 270000, 9.1, 2000],
      ["USA-MT", 130000, 6.3, 1200],
      ["USA-NE", 160000, 7.0, 1400],
      ["USA-NV", 200000, 8.5, 1600],
      ["USA-NH", 120000, 5.6, 1100],
      ["USA-NJ", 320000, 11.3, 2200],
      ["USA-NM", 180000, 7.3, 1500],
      ["USA-NY", 275000, 10.0, 2000],
      ["USA-NC", 310000, 11.0, 2200],
      ["USA-ND", 110000, 4.5, 1000],
      ["USA-OH", 330000, 12.0, 2300],
      ["USA-OK", 240000, 8.1, 1800],
      ["USA-OR", 230000, 8.9, 1700],
      ["USA-PA", 320000, 11.5, 2200],
      ["USA-RI", 100000, 4.1, 1300],
      ["USA-SC", 280000, 9.8, 2000],
      ["USA-SD", 120000, 5.3, 1100],
      ["USA-TN", 290000, 10.7, 2100],
      ["USA-TX", 300000, 11.2, 2100],
      ["USA-UT", 200000, 8.0, 1600],
      ["USA-VT", 90000, 3.5, 1000],
      ["USA-VA", 320000, 11.8, 2300],
      ["USA-WA", 190000, 6.5, 1600],
      ["USA-WV", 140000, 5.8, 1200],
      ["USA-WI", 280000, 9.5, 2000],
      ["USA-WY", 70000, 2.0, 800],
    ];
    
  
    const dummyTooltipData: { [key: string]: string } = dummyMapData.reduce((acc: any, item: any) => {
      const stateAbbreviation = item[0].split("-")[1].toUpperCase();
      const stateName = statess[stateAbbreviation];
      const revenue = formatterUSD.format(item[1]);
      const quantity = new Intl.NumberFormat("en-US").format(item[3]);
      acc[stateName] = `Revenue: ${revenue} + Quantity: ${quantity}`;
      return acc;
    }, {});
  
    const stateAbbreviations: { [key: string]: string } = states;
  
    const result: (string | number)[][] = dummyMapData.map((subArray: (string | number)[]) => {
      const stateAbbreviation: string = String(subArray[0]).split("-")[1].toUpperCase();
      const stateName: string = stateAbbreviations[stateAbbreviation];
      return [stateName, ...subArray.slice(1)];
    });
  
    const convertArrayToObject = (arr: any) =>
      arr.map((innerArr: any) => ({
        state: innerArr[0],
        totalDollar: `${formatterUSD.format(innerArr[1])}`,
        percentage: `${innerArr[2]} %`,
        quantity: new Intl.NumberFormat("en-US").format(innerArr[3]),
      }));
  
    const tableData = convertArrayToObject(result);
  
    const topStates = dummyMapData.slice(0, 5);
    const colorScale = (idValue: string) => {
      switch (idValue) {
        case String(topStates[0][0]).toUpperCase().substring(3):
          return "#58ddf5";
        case String(topStates[1][0]).toUpperCase().substring(3):
          return "#65f785";
        case String(topStates[2][0]).toUpperCase().substring(3):
          return "#f5901d";
        case String(topStates[3][0]).toUpperCase().substring(3):
          return "#f7656c";
        case String(topStates[4][0]).toUpperCase().substring(3):
          return "#8518b8";
        default:
          return theme === "dark" ? "#444" : "#d6d4d0";
      }
    };
  
    const markersList = topStates.map((state: any) => ({
      legend: state[0].split("-")[1].toUpperCase(),
      color: colorScale(state[0].toUpperCase().substring(3)),
      value: formatter.format(state[1]),
    }));
  
    return (
      <div className="h-full w-full flex flex-col m-2 rounded-lg bg-white dark:bg-gray-900 border-2 border-slate-200 dark:border-slate-700">
        <div className="w-full h-2 bg-purple-300 dark:bg-purple-800 rounded-t-lg" />
        <div className="flex justify-between px-3 py-2">
          <h1 className="text-2xl font-semibold text-md text-violet-800">Sales by Region</h1>
        </div>
        <div className="flex flex-col flex-1 shadow-lg rounded-lg border-2 border-slate-200 dark:border-slate-700 divide-y-2 divide-slate-200 dark:divide-slate-700 divide-dashed px-2 bg-white dark:bg-gray-900">
          <div className="flex justify-between p-2">
            <h3 className="text-xl flex items-center font-bold">Countrywide Sales</h3>
          </div>
  
          <div className="flex flex-col lg:flex-row gap-6 py-4 items-center lg:items-start">


          <div className="w-full lg:w-1/2 flex flex-col items-center">


          <div className="relative w-full h-[250px] sm:h-[300px] md:h-[335px]">

                <MapChart
                  markers={[]}
                  markers2={[]}
                  markers3={[]}
                  markers4={[]}
                  markers5={[]}
                  colorScale={colorScale}
                  revenueData={dummyTooltipData}
                  theme={theme} // 🔥 Pass current theme
                />
              </div>
              <div className="flex flex-col p-2 gap-4 max-w-xs">
                <div className="text-xs p-2 font-bold rounded-sm text-violet-900 dark:text-violet-100 bg-red-100 dark:bg-red-900">
                  Top 5 revenues
                </div>
                <div className="flex flex-col gap-1">
                  {markersList.map((item: Marker) => (
                    <span key={item.color} className="flex items-center gap-2">
                      <div
                        className="rounded-full h-[9px] w-[9px]"
                        style={{ backgroundColor: `${item.color}` }}
                      ></div>
                      <p className="text-xs text-violet-900 dark:text-violet-100">
                        {item.legend} - ${item.value}
                      </p>
                    </span>
                  ))}
                </div>
              </div>
            </div>
  
            <div className="w-full lg:w-1/2 mt-6 lg:mt-0">


              <h3 className="font-bold text-lg mb-2 text-violet-800">Top 10 Revenues</h3>
              <DataTable value={tableData.slice(0, 10)} size="small" className="text-sm" showGridlines>
                <Column
                  field="state"
                  header="State"
                  pt={{ bodyCell: { className: "h-5 text-center dark:text-white" } }}
                  headerClassName="bg-purple-100 dark:bg-gray-800 dark:text-white"
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