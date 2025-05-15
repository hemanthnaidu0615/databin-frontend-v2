import { useEffect, useState } from "react";

import states from "./us-map/states.json";
import { DataTable } from "primereact/datatable"; // Ensure this is the correct library for DataTable
import { Column } from "primereact/column"; // Import Column from the correct module
import USMap from "./us-map/USMap";

interface Marker {
  color: string;
  value: string;
  legend: string;
}





export const SalesByRegion = () => {
  const [theme, setTheme] = useState<"dark" | "light">("light");

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const isDark = document.documentElement.classList.contains("dark");
      setTheme(isDark ? "dark" : "light");
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
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
    ["USA-DE", 120000, 4.5, 1000],
    ["USA-FL", 340000, 12.0, 2300],
    ["USA-GA", 280000, 9.8, 1900],
    ["USA-HI", 95000, 3.2, 800],
    ["USA-ID", 110000, 4.1, 900],
    ["USA-IL", 300000, 10.7, 2000],
    ["USA-IN", 190000, 7.2, 1600],
    ["USA-IA", 160000, 6.0, 1300],
    ["USA-KS", 140000, 5.3, 1100],
    ["USA-KY", 170000, 6.5, 1400],
    ["USA-LA", 180000, 6.7, 1450],
    ["USA-ME", 100000, 3.8, 850],
    ["USA-MD", 210000, 8.1, 1750],
    ["USA-MA", 230000, 9.0, 1850],
    ["USA-MI", 240000, 9.4, 1900],
    ["USA-MN", 220000, 8.6, 1800],
    ["USA-MS", 130000, 4.9, 1000],
    ["USA-MO", 200000, 7.7, 1650],
    ["USA-MT", 90000, 3.5, 700],
    ["USA-NE", 95000, 3.9, 750],
    ["USA-NV", 185000, 7.0, 1500],
    ["USA-NH", 105000, 4.0, 850],
    ["USA-NJ", 260000, 9.8, 1950],
    ["USA-NM", 125000, 4.6, 950],
    ["USA-NY", 330000, 11.8, 2250],
    ["USA-NC", 290000, 10.3, 2000],
    ["USA-ND", 80000, 2.8, 650],
    ["USA-OH", 310000, 11.1, 2150],
    ["USA-OK", 150000, 5.5, 1200],
    ["USA-OR", 195000, 7.5, 1550],
    ["USA-PA", 320000, 11.4, 2200],
    ["USA-RI", 90000, 3.3, 700],
    ["USA-SC", 175000, 6.8, 1450],
    ["USA-SD", 85000, 3.1, 675],
    ["USA-TN", 240000, 9.0, 1800],
    ["USA-TX", 360000, 12.9, 2500],
    ["USA-UT", 165000, 6.1, 1350],
    ["USA-VT", 75000, 2.7, 600],
    ["USA-VA", 250000, 9.2, 1900],
    ["USA-WA", 270000, 10.0, 2000],
    ["USA-WV", 95000, 3.6, 800],
    ["USA-WI", 200000, 7.8, 1650],
    ["USA-WY", 70000, 2.0, 600],
    ["USA-DC", 85000, 3.0, 700],
    ["USA-PR", 65000, 1.9, 550],
  ];

  

  const stateAbbreviations: { [key: string]: string } = states;

  const result: (string | number)[][] = dummyMapData.map(
    (subArray: (string | number)[]) => {
      const stateAbbreviation: string = String(subArray[0])
        .split("-")[1]
        .toUpperCase();
      const stateName: string = stateAbbreviations[stateAbbreviation];
      return [stateName, ...subArray.slice(1)];
    }
  );

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
      <div className="flex justify-between px-3 py-2">
        <h1 className="text-2xl font-semibold">Sales by Region</h1>
      </div>
      <div className="flex flex-col flex-1 shadow-lg rounded-lg border-2 border-slate-200 dark:border-slate-700 divide-y-2 divide-slate-200 dark:divide-slate-700 divide-dashed px-2 bg-white dark:bg-gray-900">
        <div className="flex justify-between p-2">
          <h3 className="text-xl flex items-center font-bold">
            Countrywide Sales
          </h3>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 py-4 items-center lg:items-start">
          <div className="w-full lg:w-1/2 flex flex-col lg:flex-row items-center lg:items-start gap-4">
            {/* Map */}
            <div className="relative w-full h-full min-h-[250px] sm:min-h-[300px] md:min-h-[335px] flex-1">
              {/* <MapChart
                markers={[]}
                markers2={[]}
                markers3={[]}
                markers4={[]}
                markers5={[]}
                colorScale={colorScale}
                revenueData={dummyTooltipData}
                theme={theme}
              /> */}
              <USMap />
            </div>

            {/* Legend */}
            <div className="flex flex-col p-2 gap-4 max-w-xs w-full lg:w-auto">
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
            <h3 className=" text-lg mb-2 font-semibold">
              Revenues by State
            </h3>

            <div className="overflow-y-auto" style={{ maxHeight: "400px" }}>
              <DataTable
                value={tableData}
                size="small"
                className="text-sm"
                showGridlines
              >
                <Column
                  field="state"
                  header="State"
                  pt={{
                    bodyCell: { className: "h-5 text-center dark:text-white" },
                  }}
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
    </div>
  );
};
