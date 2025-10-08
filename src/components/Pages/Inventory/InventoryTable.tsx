"use client";

import React from "react";
import { BaseDataTable, TableColumn } from "../../modularity/tables/BaseDataTable";
import { axiosInstance } from "../../../axios";
import { formatDateTime } from "../../utils/kpiUtils";
import { useDateRangeEnterprise } from "../../utils/useGlobalFilters";
import * as XLSX from "xlsx";
import ExportIcon from '../../../images/export.png';

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

  const exportToXLSX = (data: any[]) => {
    const renamedData = data.map(item => ({
      "Product Name": item.name,
      "Category": item.category,
      "Warehouse": item.warehouse,
      "Source": item.source,
      "State": item.states,
      "Status": item.status,
    }));
    const worksheet = XLSX.utils.json_to_sheet(renamedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory List");
    XLSX.writeFile(workbook, "inventory_list_export.xlsx");
  };

  const exportData = async () => {
    try {
      if (!startDate || !endDate) {
        alert('Date range not available. Please select a date range.');
        return;
      }

      const queryParams = new URLSearchParams({
        startDate: formatDateTime(startDate),
        endDate: formatDateTime(endDate),
        size: '100000',
      });

      const response = await axiosInstance.get(`/inventory/widget-data?${queryParams}`);
      const resData = response.data as { data: any[]; count: number };
      const dataToExport = (resData.data || []).map((item: any) => ({
        name: item.product_name,
        category: item.category_name,
        warehouse: item.warehouse_name,
        source: item.warehouse_function,
        states: item.warehouse_state,
        status: item.inventory_status,
      }));
      exportToXLSX(dataToExport);
    } catch (err) {
      console.error("Export failed:", err);
      alert("Failed to export data.");
    }
  };

  const fetchData = async (params: any) => {
    if (!startDate || !endDate) return { data: [], count: 0 };

    const queryParams = new URLSearchParams({
      startDate: formatDateTime(startDate),
      endDate: formatDateTime(endDate),
    });

    const fieldMap: Record<string, string> = {
      name: "product_name",
      category: "category_name",
      warehouse: "warehouse_name",
      source: "warehouse_function",
      states: "warehouse_state",
      status: "inventory_status",
    };

    Object.keys(params).forEach((key) => {
      const match = key.match(/^(.+)\.(value|matchMode)$/);
      if (match) {
        const [_, frontendField, suffix] = match;
        const backendField = fieldMap[frontendField];
        if (backendField) {
          queryParams.append(`${backendField}.${suffix}`, params[key]);
        }
      } else {
        queryParams.append(key, params[key]);
      }
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
    <div className="card p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="app-subheading">Inventory List</h2>
        <button
          onClick={exportData}
        >
        <img src={ExportIcon} alt="Export" className="w-6" />

        </button>
      </div>
      <BaseDataTable<InventoryItem>
        columns={columns}
        fetchData={fetchData}
        mobileCardRender={renderMobileCard}
        globalFilterFields={["name", "category", "warehouse", "source", "states", "status"]}
        initialSortField="name"
        initialRows={10}
        rowsPerPageOptions={[10, 20, 50, 100]}
      />
    </div>
  );
};

export default InventoryTable;