import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import USMap from "./us-map/USMap";
import { Skeleton } from "primereact/skeleton";
import dayjs from "dayjs";
import { axiosInstance } from "../../../../axios";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import React from "react";


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

export const SalesByRegion = () => {
  const [theme, setTheme] = useState<"dark" | "light">("light");
  const [stateData, setStateData] = useState<StateData[]>([]);
  const [topStates, setTopStates] = useState<{ state_name: string, state_revenue: number }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dateRange = useSelector((state: any) => state.dateRange.dates);
  const enterpriseKey = useSelector((state: any) => state.enterpriseKey.key);
  const [startDate, endDate] = dateRange || [];
  const [expandedStates, setExpandedStates] = useState<string[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);
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
        params.append('enterpriseKey', enterpriseKey);
      }

      try {
        const [statesResponse, , topStatesResponse] = await Promise.all([
          axiosInstance.get<StateData[]>(`sales-by-region?${params.toString()}`),
          axiosInstance.get(`sales-by-region/countrywide?${params.toString()}`),
          axiosInstance.get<{ state_name: string, state_revenue: number }[]>(`sales-by-region/top5?${params.toString()}`),
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
    maximumFractionDigits: 0
  });

  const arrowExpand = (stateName: string) => {
    setExpandedStates((prev) =>
      prev[0] === stateName ? [] : [stateName]
    );
  };


  const convertToTableData = (data: StateData[]): TableData[] => {
    return data.map((state) => ({
      state: state.state_name,
      totalDollar: `$ ${formatValue(convertToUSD(state.state_revenue))}`,
      percentage: `${state.revenue_percentage?.toFixed(2) || 0}%`,
      quantity: formatValue(state.state_quantity),
      avgRevenue: formatterUSD.format(convertToUSD(state.average_revenue_per_unit || 0))
    }));
  };

  const tableData = convertToTableData(stateData);

  const colorScale = (stateCode: string) => {
    const topStateCodes = topStates.map(state => state.state_name);
    const colors = ["#58ddf5", "#65f785", "#f5901d", "#f7656c", "#8518b8"];

    const index = topStateCodes.indexOf(stateCode);
    return index >= 0 ? colors[index] : theme === "dark" ? "#444" : "#d6d4d0";
  };

  const markersList = topStates.slice(0, 5).map((state) => ({
    legend: state.state_name,
    color: colorScale(state.state_name),
    value: formatValue(convertToUSD(state.state_revenue))
  }));

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
        <div className="p-4 text-red-500 dark:text-red-400">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col m-2 rounded-lg bg-white dark:bg-gray-900 border-2 border-slate-200 dark:border-slate-700">
      <div className="flex justify-between px-3 py-2">
        <h1 className="text-2xl app-section-title">Sales by Region</h1>
      </div>
      <div className="flex flex-col flex-1 shadow-lg rounded-lg border-2 border-slate-200 dark:border-slate-700 divide-y-2 divide-slate-200 dark:divide-slate-700 divide-dashed px-2 bg-white dark:bg-gray-900">
        <div className="flex justify-between p-2">
          <h3 className="app-subheading">
            Countrywide Sales
          </h3>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 py-4 items-center lg:items-start">
          <div className="w-full lg:w-1/2 flex flex-col lg:flex-row items-center lg:items-start gap-4">
            {/* Map */}
            <div className="relative w-full h-full min-h-[250px] sm:min-h-[300px] md:min-h-[335px] flex-1 aspect-[4/3] overflow-hidden">
              <USMap />
            </div>

            {/* Legend */}
            <div className="flex flex-col p-2 gap-4 max-w-xs w-full lg:w-auto">
              <div className="text-xs p-2 font-bold rounded-sm text-violet-900 dark:text-violet-100 bg-red-100 dark:bg-red-900 ">
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
            <h3 className="app-subheading">
              Revenues by State
            </h3>
            <div className="lg:max-h-[400px] lg:overflow-y-auto">
              <table className="min-w-full border-separate border-spacing-0 lg:table lg:border lg:border-slate-300 dark:lg:border-slate-700">
                <thead className="sticky top-0 z-20 bg-purple-100 dark:bg-gray-800 text-xs">
                  <tr>
                    <th className="w-8 lg:hidden"></th>
                    <th className="text-left px-4 py-2 app-table-heading lg:border lg:border-slate-300 dark:lg:border-slate-700">
                      State
                    </th>
                    <th className="hidden lg:table-cell text-left px-4 py-2 app-table-heading lg:border lg:border-slate-300 dark:lg:border-slate-700">
                      Total $ Value
                    </th>
                    <th className="hidden lg:table-cell text-left px-4 py-2 app-table-heading lg:border lg:border-slate-300 dark:lg:border-slate-700">
                      Percentage
                    </th>
                    <th className="hidden lg:table-cell text-left px-4 py-2 app-table-heading lg:border lg:border-slate-300 dark:lg:border-slate-700">
                      Quantity
                    </th>
                  </tr>
                </thead>
                <tbody className="text-sm text-gray-800 dark:text-gray-200 app-table-content">
                  {tableData.map((row) => (
                    <React.Fragment key={row.state}>
                      <tr
                        className="hover:bg-gray-50 hover:dark:bg-white/[0.05] cursor-pointer transition-colors"
                        onClick={() => arrowExpand(row.state)}
                      >
                        <td className="py-3 px-4 lg:hidden">
                          {expandedStates.includes(row.state) ? (
                            <FaChevronUp className="text-gray-500 dark:text-gray-400" />
                          ) : (
                            <FaChevronDown className="text-gray-500 dark:text-gray-400" />
                          )}
                        </td>
                        <td className="py-3 px-4 lg:border lg:border-slate-300 dark:lg:border-slate-700">
                          {row.state}
                        </td>
                        <td className="hidden lg:table-cell py-3 px-4 lg:border lg:border-slate-300 dark:lg:border-slate-700">
                          {row.totalDollar}
                        </td>
                        <td className="hidden lg:table-cell py-3 px-4 lg:border lg:border-slate-300 dark:lg:border-slate-700">
                          {row.percentage}
                        </td>
                        <td className="hidden lg:table-cell py-3 px-4 lg:border lg:border-slate-300 dark:lg:border-slate-700">
                          {row.quantity}
                        </td>
                      </tr>

                      {/* Mobile-only expanded row */}
                      {expandedStates.includes(row.state) && (
                        <tr className="lg:hidden">
                          <td></td>
                          <td colSpan={4} className="px-4 pb-4">
                            <div className="rounded-xl bg-gray-100 dark:bg-white/5 p-3 text-xs text-gray-600 dark:text-gray-300 space-y-2 shadow-sm">
                              <div className="flex justify-between items-center">
                                <span className="text-gray-500 dark:text-gray-400">Total $ Value</span>
                                <span className="font-medium text-gray-900 dark:text-white">{row.totalDollar}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-gray-500 dark:text-gray-400">Percentage</span>
                                <span className="font-medium text-gray-900 dark:text-white">{row.percentage}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-gray-500 dark:text-gray-400">Quantity</span>
                                <span className="font-medium text-gray-900 dark:text-white">{row.quantity}</span>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        </div>
      </div>
    </div>
    // </div>
  );
};