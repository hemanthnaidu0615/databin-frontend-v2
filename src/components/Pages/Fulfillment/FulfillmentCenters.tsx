import { useEffect, useState } from "react";
import { ProgressBar } from "primereact/progressbar";
import { axiosInstance } from "../../../axios";
import { useDateRangeEnterprise } from "../../utils/useGlobalFilters";
import { TableView, usePagination, TableColumn } from "../../modularity/tables/Table";

const FulfillmentCenters = () => {
  const { page, rows, onPageChange } = usePagination();
  const [centerData, setCenterData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalRecords, setTotalRecords] = useState(0);

  const { dateRange, enterpriseKey } = useDateRangeEnterprise();
  const [startDate, endDate] = dateRange;

  const getRateSeverity = (rate: number) => {
    if (rate >= 95) return "success";
    if (rate >= 90) return "info";
    if (rate >= 85) return "warning";
    return "danger";
  };

  const columns: TableColumn[] = [
    { field: "center", header: "Center", mobilePriority: true },
    { field: "orders", header: "Orders" },
    {
      field: "avg_time_days",
      header: "Avg Time",
      customBody: (row: any) => `${row.avg_time_days} days`
    },
    {
      field: "on_time_rate",
      header: "On-Time Rate",
      type: "tag",
      tagSeverity: (value: number) => getRateSeverity(value),
      mobilePriority: true
    },
    {
      field: "capacity",
      header: "Capacity",
      customBody: () => <ProgressBar value={Math.floor(Math.random() * 40 + 60)} showValue />
    },
  ];

  const config = {
    columns,
    expandable: true,
  };

  useEffect(() => {
    const fetchPerformanceData = async () => {
      if (!startDate || !endDate) return;

      try {
        setLoading(true);
        setError(null);

        type FulfillmentPerformanceResponse = {
          data: any[];
          count: number;
        };

        const res = await axiosInstance.get<FulfillmentPerformanceResponse>(
          "/fulfillment/fulfillment-performance",
          {
            params: {
              startDate,
              endDate,
              page: Math.floor(page / rows),
              size: rows,
              ...(enterpriseKey ? { enterpriseKey } : {}),
            },
          }
        );

        const { data, count } = res.data;
        setCenterData(data);
        setTotalRecords(count);
      } catch (err: any) {
        console.error("Failed to fetch fulfillment data:", err);
        setError(err.message || "Error loading data");
      } finally {
        setLoading(false);
      }
    };

    fetchPerformanceData();
  }, [startDate, endDate, enterpriseKey, page, rows]);

  return (
    <div className="mt-6">
      <h2 className="app-subheading">Fulfillment Center Performance</h2>

      <TableView
        data={centerData}
        config={config}
        pagination={{
          page,
          rows,
          totalRecords,
          onPageChange,
        }}
        loading={loading}
        error={error}
      />
    </div>
  );
};

export default FulfillmentCenters;