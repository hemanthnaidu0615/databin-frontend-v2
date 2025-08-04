"use client";

import React from "react";
import { BaseDataTable, TableColumn } from "../../../modularity/tables/BaseDataTable";
import { axiosInstance } from "../../../../axios";
import { useDateRangeEnterprise } from "../../../utils/useGlobalFilters";
import { formatDateTime } from "../../../utils/kpiUtils";

interface ProductRow {
  productId: string;
  brand: string;
  category: string;
  totalQuantity: number;
  totalAmountUSD: number;
}

const convertToUSD = (rupees: number): number => rupees * 0.012;

const formatValue = (value: number): string => {
  if (value >= 1_000_000) return (value / 1_000_000).toFixed(1) + "M";
  if (value >= 1_000) return (value / 1_000).toFixed(1) + "K";
  return value.toFixed(0);
};

const VolumeValueSection: React.FC<{ company: string }> = ({ company }) => {
  const { dateRange } = useDateRangeEnterprise();
  const [startDate, endDate] = dateRange || [];

  const fieldMap: Record<string, string> = {
    productId: "product_id",
    brand: "product_name",
    category: "category",
    totalQuantity: "total_quantity",
    totalAmountUSD: "total_amount"
  };

  const fetchData = async (params: any) => {
    if (!startDate || !endDate) return { data: [], count: 0 };

    const queryParams = new URLSearchParams({
      startDate: formatDateTime(startDate),
      endDate: formatDateTime(endDate),
      page: params.page,
      size: params.size,
    });

    // Append sort params
    if (params.sortField) {
      queryParams.append("sortField", fieldMap[params.sortField] || params.sortField);
      queryParams.append("sortOrder", params.sortOrder);
    }

    // Append filters
    Object.entries(params).forEach(([key, value]) => {
      if (key.endsWith(".value") || key.endsWith(".matchMode")) {
        const [field, suffix] = key.split(".");
        const backendField = fieldMap[field] || field;
        queryParams.append(`${backendField}.${suffix}`, String(value));
      }
    });

    try {
      const response = await axiosInstance.get(
        `/sales/volume-value/${company.toLowerCase()}?${queryParams.toString()}`
      );
      const apiData = response.data.data || [];
      const count = response.data.count || 0;

      const formattedData: ProductRow[] = apiData.map((item: any) => ({
        productId: item.product_id.toString(),
        brand: item.product_name,
        category: item.category,
        totalQuantity: item.total_quantity,
        totalAmountUSD: convertToUSD(item.total_amount),
      }));

      return { data: formattedData, count };
    } catch (error) {
      console.error("Error fetching volume/value data:", error);
      return { data: [], count: 0 };
    }
  };


  const columns: TableColumn<ProductRow>[] = [
    {
      field: "productId",
      header: "Product ID",
      sortable: true,
      filter: true,
    },
    {
      field: "category",
      header: "Category",
      sortable: true,
      filter: true,
    },
    {
      field: "brand",
      header: "Brand",
      sortable: true,
      filter: true,
    },
    {
      field: "totalQuantity",
      header: "Quantity",
      sortable: true,
      filter: false,
    },
    {
      field: "totalAmountUSD",
      header: "Total (USD)",
      sortable: true,
      filter: false,
      body: (row: ProductRow) => (
        <span className="font-semibold text-gray-800 dark:text-gray-100">${formatValue(row.totalAmountUSD)}</span>
      ),
    },
  ];

  const renderMobileCard = (item: ProductRow, index: number) => (
    <div
      key={index}
      className="p-4 rounded-md border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 mb-2 shadow-sm"
    >
      <div className="font-semibold text-sm mb-1">{item.brand}</div>
      <div className="text-sm text-gray-600 dark:text-gray-300">ID: {item.productId}</div>
      <div className="text-sm text-gray-600 dark:text-gray-300">Category: {item.category}</div>
      <div className="text-sm text-gray-600 dark:text-gray-300">Qty: {item.totalQuantity.toLocaleString()}</div>
      <div className="text-sm font-medium mt-1 text-violet-700 dark:text-violet-400">
        ${formatValue(item.totalAmountUSD)}
      </div>
    </div>
  );

  return (
    <div className="card p-4">
      <BaseDataTable<ProductRow>
        columns={columns}
        fetchData={fetchData}
        title="Volume / Value Summary"
        initialSortField="totalAmountUSD"
        initialSortOrder={-1}
        initialRows={10}
        mobileCardRender={renderMobileCard}
        globalFilterFields={["productId", "brand", "category"]}
        rowsPerPageOptions={[10, 20, 50]}
        field={"brand"}
        header={""}
      />
    </div>
  );
};

export default VolumeValueSection;