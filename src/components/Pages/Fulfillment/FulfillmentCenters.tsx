import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { ProgressBar } from "primereact/progressbar";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { axiosInstance } from "../../../axios";

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


        const res = await axiosInstance.get("/fulfillment/fulfillment-performance", {
          params: {
            startDate,
            endDate,
            ...(enterpriseKey ? { enterpriseKey } : {}),
          },
        });
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
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">
        Fulfillment Center Performance
      </h2>

      <div className="rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-900 p-4 w-full">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">Error: {error}</p>
        ) : (
          <div className="max-h-[600px] overflow-y-auto">
            <DataTable
              value={centerData}
              paginator={false}
              responsiveLayout="scroll"
              className="p-datatable-sm w-full"
            >
              <Column
                field="center"
                header="Center"
                className="whitespace-nowrap"
              />
              <Column
                field="orders"
                header="Orders"
                className="whitespace-nowrap text-right"
              />
              <Column
                field="avg_time_days"
                header="Avg Time"
                body={(rowData) => `${rowData.avg_time_days} days`}
                className="whitespace-nowrap text-right"
              />
              <Column
                header="On-Time Rate"
                body={(rowData) => {
                  const rate = (rowData.on_time_rate);
                  return (
                    <Tag value={`${rate}%`} severity={getRateSeverity(rate)} />
                  );
                }}
                className="whitespace-nowrap text-center"
              />
              {!isMobile && (
                <Column
                  header="Capacity"
                  body={() => (
                    <ProgressBar
                      value={Math.floor(Math.random() * 40 + 60)}
                      showValue={true}
                      className="h-2 rounded-md"
                    />
                  )}
                  className="whitespace-nowrap"
                />
              )}
            </DataTable>
          </div>
        )}
      </div>
    </div>
  );
};

export default FulfillmentCenters;
