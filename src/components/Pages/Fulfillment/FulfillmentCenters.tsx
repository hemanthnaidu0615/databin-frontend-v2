"use client";

import React, { useState } from "react";
import { Tag } from "primereact/tag";
import { BaseDataTable, TableColumn } from "../../modularity/tables/BaseDataTable";
import { axiosInstance } from "../../../axios";
import { formatDateTime } from "../../utils/kpiUtils";
import { useTheme } from "next-themes";
import { useDateRangeEnterprise } from "../../utils/useGlobalFilters";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

interface CenterData {
  center: string;
  orders: number;
  avg_time_days: number;
  on_time_rate: number;
}

const FulfillmentCenters: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [expandedCenter, setExpandedCenter] = useState<string | null>(null);
  const { dateRange, enterpriseKey } = useDateRangeEnterprise();
  const [startDate, endDate] = dateRange || [];

  const getRateSeverity = (rate: number): "success" | "info" | "warning" | "danger" => {
    if (rate >= 95) return "success";
    if (rate >= 90) return "info";
    if (rate >= 85) return "warning";
    return "danger";
  };

  const fetchData = async (params: any) => {
    if (!startDate || !endDate) return { data: [], count: 0 };

    const queryParams = new URLSearchParams({
      startDate: formatDateTime(startDate),
      endDate: formatDateTime(endDate),
      ...params,
    });

    if (enterpriseKey) queryParams.append("enterpriseKey", enterpriseKey);

    try {
      const response = await axiosInstance.get(
        `/fulfillment/fulfillment-performance?${queryParams.toString()}`
      );
      const responseData = response.data as { data: CenterData[]; count: number };
      return {
        data: responseData.data || [],
        count: responseData.count || 0,
      };
    } catch (error) {
      console.error("Error fetching data:", error);
      return { data: [], count: 0 };
    }
  };

  const renderMobileCard = (item: CenterData, index: number) => (
    <div
      key={index}
      className={`p-4 rounded-md border cursor-pointer ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}
      onClick={() => setExpandedCenter(expandedCenter === item.center ? null : item.center)}
    >
      <div className="flex justify-between items-center">
        <span className="font-semibold">{item.center}</span>
        <div className="flex items-center gap-2">
          <Tag value={`${item.on_time_rate}%`} severity={getRateSeverity(item.on_time_rate)} />
          {expandedCenter === item.center ? <FaChevronUp /> : <FaChevronDown />}
        </div>
      </div>
      {expandedCenter === item.center && (
        <div className="mt-2 text-sm space-y-1">
          <div>Orders: {item.orders}</div>
          <div>Avg Time: {item.avg_time_days} days</div>
        </div>
      )}
    </div>
  );

  const columns: TableColumn<CenterData>[] = [
    {
      field: "center",
      header: "Center",
      sortable: true,
      filter: true,
    },
    {
      field: "orders",
      header: "Orders",
      sortable: true,
      filter: true,
    },
    {
      field: "avg_time_days",
      header: "Avg Time (days)",
      sortable: true,
      filter: true,
    },
    {
      field: "on_time_rate",
      header: "On-Time Rate (%)",
      sortable: true,
      filter: true,
      body: (rowData: CenterData) => (
        <Tag value={`${rowData.on_time_rate}%`} severity={getRateSeverity(rowData.on_time_rate)} />
      ),
    },
  ];

  return (
    <div className="card p-4">
      <BaseDataTable<CenterData>
        columns={columns}
        fetchData={fetchData}
        title="Fulfillment Center Performance"
        mobileCardRender={renderMobileCard}
        initialSortField="center"
        initialRows={10}
        globalFilterFields={["center"]}
        rowsPerPageOptions={[10, 20, 50, 100]} field={"center"} header={""} />
    </div>
  );
};

export default FulfillmentCenters;