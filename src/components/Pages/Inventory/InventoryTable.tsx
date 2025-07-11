"use client";

import React from "react";
import { BaseDataTable, TableColumn } from "../../modularity/tables/BaseDataTable";
import { axiosInstance } from "../../../axios";
import { formatDateTime } from "../../utils/kpiUtils";
import { useDateRangeEnterprise } from "../../utils/useGlobalFilters";

interface Filters {
  selectedRegion: string;
  selectedSource: string;
  selectedLocation: string;
}

interface InventoryItem {
  name: string;
  category: string;
  warehouse: string;
  source: string;
  states: string;
  status: string;
}

interface InventoryTableProps {
  filters: Filters;
}

const statusColors: Record<string, string> = {
  Available: "text-green-500",
  "Out of Stock": "text-red-500",
  "Low Stock": "text-yellow-500",
};

const InventoryTable: React.FC<InventoryTableProps> = ({ filters }) => {
  const { dateRange } = useDateRangeEnterprise();
  const [startDate, endDate] = dateRange || [];

  const fetchData = async (params: any) => {
    if (!startDate || !endDate) return { data: [], count: 0 };

    const queryParams = new URLSearchParams({
      startDate: formatDateTime(startDate),
      endDate: formatDateTime(endDate),
      ...params,
    });

    if (filters.selectedRegion) queryParams.append("regionFilter", filters.selectedRegion);
    if (filters.selectedSource) queryParams.append("sourceFilter", filters.selectedSource);
    if (filters.selectedLocation) queryParams.append("locationFilter", filters.selectedLocation);

    const response = await axiosInstance.get(`/inventory/widget-data?${queryParams}`);
    const resData = response.data as { data: any[]; count: number };

    return {
      data: (resData.data || []).map((item: any) => ({
        name: item.product_name,
        category: item.category_name,
        warehouse: item.warehouse_name,
        source: item.warehouse_function,
        states: item.warehouse_state,
        status: item.inventory_status,
      })),
      count: resData.count || 0,
    };
  };

  const renderStatus = (status: string) => (
    <span className={statusColors[status] ?? ""}>{status}</span>
  );

  const renderMobileCard = (item: InventoryItem, index: number) => (
    <div
      key={index}
      className="bg-white dark:bg-gray-900 border rounded-lg shadow p-4 mb-3"
    >
      <div className="font-semibold text-lg mb-2">{item.name}</div>
      <div className="text-sm text-gray-600 dark:text-gray-300">
        <p><strong>Category:</strong> {item.category}</p>
        <p><strong>Warehouse:</strong> {item.warehouse}</p>
        <p><strong>Source:</strong> {item.source}</p>
        <p><strong>State:</strong> {item.states}</p>
        <p><strong>Status:</strong> {renderStatus(item.status)}</p>
      </div>
    </div>
  );

  const columns: TableColumn<InventoryItem>[] = [
    { field: "name", header: "Product Name", sortable: true, filter: true },
    { field: "category", header: "Category", sortable: true, filter: true },
    { field: "warehouse", header: "Warehouse", sortable: true, filter: true },
    { field: "source", header: "Source", sortable: true, filter: true },
    { field: "states", header: "State", sortable: true, filter: true },
    {
      field: "status",
      header: "Status",
      sortable: true,
      filter: true,
      body: (rowData: InventoryItem) => renderStatus(rowData.status)
    },
  ];

  return (
    <BaseDataTable<InventoryItem>
      columns={columns}
      fetchData={fetchData}
      title="Inventory List"
      mobileCardRender={renderMobileCard}
      globalFilterFields={["name", "category", "warehouse", "source", "states", "status"]} field={"name"} header={""} />
  );
};

export default InventoryTable;