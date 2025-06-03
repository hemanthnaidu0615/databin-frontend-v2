import { Tag } from "primereact/tag";
import { ProgressBar } from "primereact/progressbar";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { axiosInstance } from "../../../axios";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import React from "react";

const getRateSeverity = (rate: number) => {
  if (rate >= 95) return "success";
  if (rate >= 90) return "info";
  if (rate >= 85) return "warning";
  return "danger";
};

const FulfillmentCenters = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [centerData, setCenterData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const dateRange = useSelector((state: any) => state.dateRange.dates);
  const [startDate, endDate] = dateRange;
  const enterpriseKey = useSelector((state: any) => state.enterpriseKey.key);
  const [expandedCenter, setExpandedCenter] = useState<string | null>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const fetchPerformanceData = async () => {
      if (!startDate || !endDate) return;

      try {
        setLoading(true);

        const res = await axiosInstance.get(
          "/fulfillment/fulfillment-performance",
          {
            params: {
              startDate,
              endDate,
              ...(enterpriseKey ? { enterpriseKey } : {}),
            },
          }
        );
        setCenterData(res.data as any[]);
      } catch (err: any) {
        setError(err.message || "Error loading data");
      } finally {
        setLoading(false);
      }
    };

    fetchPerformanceData();
  }, [startDate, endDate, enterpriseKey]);

  return (
    <div className="mt-6">
      <h2 className="app-subheading">
        Fulfillment Center Performance
      </h2>

      <div className="rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-900 p-4 w-full">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">Error: {error}</p>
        ) : (
          <div className="max-h-[400px] overflow-y-auto">
            <table className="min-w-full border-separate border-spacing-0 w-full">
              <thead className="sticky top-0 z-20 bg-purple-100 dark:bg-gray-800 text-xs">
                <tr>
                  {isMobile && <th className="w-8"></th>}
                  <th className="text-left px-4 py-2 app-table-heading">Center</th>
                  {!isMobile && <th className="text-left px-4 py-2 app-table-heading">Orders</th>}
                  {!isMobile && <th className="text-left px-4 py-2 app-table-heading">Avg Time</th>}
                  <th className="text-left px-4 py-2 app-table-heading">On-Time Rate</th>
                  {!isMobile && <th className="text-left px-4 py-2 app-table-heading">Capacity</th>}
                </tr>
              </thead>
              <tbody className="text-sm text-gray-800 dark:text-gray-200 app-table-content">
                {centerData.map((row) => (
                  <React.Fragment key={row.center}>
                    <tr
                      onClick={() => isMobile && setExpandedCenter(expandedCenter === row.center ? null : row.center)}
                      className={`transition-colors ${isMobile ? "hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer" : ""
                        }`}
                    >
                      {isMobile && (
                        <td className="py-3 px-4">
                          {expandedCenter === row.center ? (
                            <FaChevronUp className="text-gray-500 dark:text-gray-400" />
                          ) : (
                            <FaChevronDown className="text-gray-500 dark:text-gray-400" />
                          )}
                        </td>
                      )}
                      <td className={`py-3 px-4 ${!isMobile ? "md:border-b md:border-gray-200 dark:md:border-gray-700" : ""}`}>
                        {row.center}
                      </td>
                      {!isMobile && (
                        <td className="py-3 px-4 md:border-b md:border-gray-200 dark:md:border-gray-700">
                          {row.orders}
                        </td>
                      )}
                      {!isMobile && (
                        <td className="py-3 px-4 md:border-b md:border-gray-200 dark:md:border-gray-700">
                          {row.avg_time_days} days
                        </td>
                      )}
                      <td className={`py-3 px-4  ${!isMobile ? "md:border-b md:border-gray-200 dark:md:border-gray-700" : ""}`}>
                        <Tag
                          value={`${row.on_time_rate}%`}
                          severity={getRateSeverity(row.on_time_rate)}
                        />
                      </td>
                      {!isMobile && (
                        <td className="py-3 px-4 md:border-b md:border-gray-200 dark:md:border-gray-700">
                          <ProgressBar
                            value={Math.floor(Math.random() * 40 + 60)}
                            showValue
                            className="h-2 rounded-md"
                          />
                        </td>
                      )}
                    </tr>

                    {/* Mobile expanded content */}
                    {isMobile && expandedCenter === row.center && (
                      <tr className="lg:hidden">
                        <td></td>
                        <td colSpan={4} className="px-4 pb-4">
                          <div className="rounded-xl bg-gray-100 dark:bg-white/5 p-3 text-xs text-gray-600 dark:text-gray-300 space-y-2 shadow-sm">
                            <div className="flex justify-between items-center">
                              <span className="text-gray-500 dark:text-gray-400">Orders</span>
                              <span className="font-medium text-gray-900 dark:text-white">
                                {row.orders}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-500 dark:text-gray-400">Avg Time</span>
                              <span className="font-medium text-gray-900 dark:text-white">
                                {row.avg_time_days} days
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-500 dark:text-gray-400">Capacity</span>
                              <span className="font-medium text-gray-900 dark:text-white w-1/2">
                                <ProgressBar
                                  value={Math.floor(Math.random() * 40 + 60)}
                                  showValue
                                  className="h-2 rounded-md"
                                />
                              </span>
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
        )}
      </div>
    </div>
  );
};

export default FulfillmentCenters;
