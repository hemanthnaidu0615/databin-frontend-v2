import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import USMap from "./us-map/USMap";
import { Skeleton } from "primereact/skeleton";
import dayjs from "dayjs";
import { axiosInstance } from "../../../../axios";

interface Marker {
  color: string;
  value: string;
  legend: string;
}

interface StateData {
  state_name: string;
  state_revenue: number;
  state_quantity: number;
  revenue_percentage?: number;
  customer_count?: number;
  average_revenue_per_unit?: number;
}

interface TableData {
  state: string;
  totalDollar: string;
  percentage: string;
  quantity: string;
  avgRevenue?: string;
}

const convertToUSD = (rupees: number): number => {
  const exchangeRate = 0.012;
  return rupees * exchangeRate;
};

const formatValue = (value: number): string => {
  if (value >= 1_000_000) return (value / 1_000_000).toFixed(1) + "M";
  if (value >= 1_000) return (value / 1_000).toFixed(1) + "K";
  return value.toFixed(0);
};

const formatDate = (date: Date) => dayjs(date).format("YYYY-MM-DD");

const isMobile = () => window.innerWidth <= 768;

export const SalesByRegion = () => {
  const [theme, setTheme] = useState<"dark" | "light">("light");
  const [stateData, setStateData] = useState<StateData[]>([]);
  const [topStates, setTopStates] = useState<{ state_name: string; state_revenue: number }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dateRange = useSelector((state: any) => state.dateRange.dates);
  const enterpriseKey = useSelector((state: any) => state.enterpriseKey.key);
  const [startDate, endDate] = dateRange || [];
  const [expandedRows, setExpandedRows] = useState<{ [key: string]: boolean }>({});
  const [mobileView, setMobileView] = useState(isMobile());

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const handleResize = () => setMobileView(isMobile());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!startDate || !endDate) return;

      setLoading(true);
      setError(null);

      const formattedStart = formatDate(new Date(startDate));
      const formattedEnd = formatDate(new Date(endDate));

      const params = new URLSearchParams({
        startDate: formattedStart,
        endDate: formattedEnd,
      });

      if (enterpriseKey) {
        params.append("enterpriseKey", enterpriseKey);
      }

      try {
        const [statesResponse, , topStatesResponse] = await Promise.all([
          axiosInstance.get<StateData[]>(`sales-by-region?${params.toString()}`),
          axiosInstance.get(`sales-by-region/countrywide?${params.toString()}`),
          axiosInstance.get<{ state_name: string; state_revenue: number }[]>(`sales-by-region/top5?${params.toString()}`),
        ]);

        setStateData(statesResponse.data);
        setTopStates(topStatesResponse.data);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load sales data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [startDate, endDate, enterpriseKey]);

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

  const formatterUSD = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  const convertToTableData = (data: StateData[]): TableData[] => {
    return data.map((state) => ({
      state: state.state_name,
      totalDollar: `$ ${formatValue(convertToUSD(state.state_revenue))}`,
      percentage: `${state.revenue_percentage?.toFixed(2) || 0}%`,
      quantity: formatValue(state.state_quantity),
      avgRevenue: formatterUSD.format(convertToUSD(state.average_revenue_per_unit || 0)),
    }));
  };

  const tableData = convertToTableData(stateData);

  const colorScale = (stateCode: string) => {
    const topStateCodes = topStates.map((state) => state.state_name);
    const colors = ["#58ddf5", "#65f785", "#f5901d", "#f7656c", "#8518b8"];

    const index = topStateCodes.indexOf(stateCode);
    return index >= 0 ? colors[index] : theme === "dark" ? "#444" : "#d6d4d0";
  };

  const markersList = topStates.slice(0, 5).map((state) => ({
    legend: state.state_name,
    color: colorScale(state.state_name),
    value: formatValue(convertToUSD(state.state_revenue)),
  }));

  const rowExpansionTemplate = (data: TableData) => {
    return (
      <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-b-md text-sm text-gray-800 dark:text-gray-200 space-y-1">
        <div>
          <span className="font-medium">Total $ Value:</span> {data.totalDollar}
        </div>
        <div>
          <span className="font-medium">Percentage:</span> {data.percentage}
        </div>
        <div>
          <span className="font-medium">Quantity:</span> {data.quantity}
        </div>
      </div>
    );
  };


  if (!startDate || !endDate) {
    return (
      <div className="h-full w-full flex flex-col m-2 rounded-lg bg-white dark:bg-gray-900 border-2 border-slate-200 dark:border-slate-700">
        <div className="text-center text-gray-500 dark:text-gray-400 p-4">
          Please select a date range to view sales by region
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="h-full w-full flex flex-col m-2 rounded-lg bg-white dark:bg-gray-900 border-2 border-slate-200 dark:border-slate-700">
        <div className="p-4">
          <Skeleton width="150px" height="30px" className="mb-4" />
          <Skeleton width="100%" height="300px" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full w-full flex flex-col m-2 rounded-lg bg-white dark:bg-gray-900 border-2 border-slate-200 dark:border-slate-700">
        <div className="p-4 text-red-500 dark:text-red-400">{error}</div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          /* Hide all except expander and state columns on mobile */
          .hide-on-mobile {
            display: none;
          }
          .expander-column {
            width: 3em;
          }
        }
        @media (min-width: 769px) {
          /* Hide expander column on desktop */
          .expander-column {
            display: none;
          }
        }
      `}</style>

      <div className="h-full w-full flex flex-col m-2 rounded-lg bg-white dark:bg-gray-900 border-2 border-slate-200 dark:border-slate-700">
        <div className="flex justify-between px-3 py-2">
          <h1 className="text-2xl app-section-title">Sales by Region</h1>
        </div>
        <div className="flex flex-col flex-1 shadow-lg rounded-lg border-2 border-slate-200 dark:border-slate-700 divide-y-2 divide-slate-200 dark:divide-slate-700 divide-dashed px-2 bg-white dark:bg-gray-900">
          <div className="flex justify-between p-2">
            <h3 className="app-subheading">Countrywide Sales</h3>
          </div>

          <div className="flex flex-col lg:flex-row gap-6 py-4 items-center lg:items-start">
            <div className="w-full lg:w-1/2 flex flex-col lg:flex-row items-center lg:items-start gap-4">
              {/* Map */}
              <div className="w-full max-w-full aspect-[4/3] overflow-hidden">
                <div className="w-full h-full">
                  <USMap />
                </div>
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
              <h3 className="app-subheading">Revenues by State</h3>

              <div className="overflow-y-auto" style={{ maxHeight: "400px" }}>
                <DataTable
                  value={tableData}
                  size="small"
                  className="app-table-heading"
                  showGridlines
                  scrollable
                  scrollHeight="400px"
                  expandedRows={mobileView ? expandedRows : undefined}
                  onRowToggle={mobileView ? (e) => setExpandedRows(
                    typeof e.data === "object" && !Array.isArray(e.data) ? e.data : {}
                  ) : undefined}
                  rowExpansionTemplate={mobileView ? rowExpansionTemplate : undefined}
                  dataKey="state"
                  style={{ minWidth: "100%" }}
                >
                  {mobileView && (
                    <Column expander className="expander-column" />
                  )}
                  <Column
                    field="state"
                    header="State"
                    pt={{
                      bodyCell: { className: "app-table-content" },
                    }}
                    headerClassName="sticky bg-purple-100 dark:bg-gray-800 dark:text-white"
                  />
                  <Column
                    field="totalDollar"
                    header="Total $ Value"
                    bodyClassName="hide-on-mobile"
                    headerClassName="sticky bg-purple-100 dark:bg-gray-800 dark:text-white hide-on-mobile"
                    pt={{ bodyCell: { className: "app-table-content" } }}
                  />

                  <Column
                    field="percentage"
                    header="Percentage"
                    bodyClassName="hide-on-mobile"
                    headerClassName="sticky bg-purple-100 dark:bg-gray-800 dark:text-white hide-on-mobile"
                    pt={{ bodyCell: { className: "app-table-content" } }}
                  />

                  <Column
                    field="quantity"
                    header="Quantity"
                    bodyClassName="hide-on-mobile"
                    headerClassName="sticky bg-purple-100 dark:bg-gray-800 dark:text-white hide-on-mobile"
                    pt={{ bodyCell: { className: "app-table-content" } }}
                  />

                </DataTable>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
