"use client";

import React, { useEffect, useState } from "react";
import {
  DataTable,
  DataTablePageEvent,
  DataTableSortEvent,
  DataTableFilterEvent,
} from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { ProgressSpinner } from "primereact/progressspinner";
import { useDateRangeEnterprise } from "../../utils/useGlobalFilters";

import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

interface FulfillmentDetail {
  category: string;
  order_id: number;
  event_type: string;
  event_description: string;
  event_time: string;
  fulfillment_channel: string;
  fulfillment_city: string;
  fulfillment_state: string;
  fulfillment_country: string;
  handler_name: string;
}

const NewTable: React.FC = () => {
  const [data, setData] = useState<FulfillmentDetail[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [globalFilter, setGlobalFilter] = useState<string>("");

  const [filters, setFilters] = useState<any>({
    global: { value: null, matchMode: "contains" },
    category: { value: null, matchMode: "contains" },
    order_id: { value: null, matchMode: "contains" },
    event_type: { value: null, matchMode: "contains" },
    event_description: { value: null, matchMode: "contains" },
    event_time: { value: null, matchMode: "contains" },
    fulfillment_channel: { value: null, matchMode: "contains" },
    fulfillment_city: { value: null, matchMode: "contains" },
    fulfillment_state: { value: null, matchMode: "contains" },
    fulfillment_country: { value: null, matchMode: "contains" },
    handler_name: { value: null, matchMode: "contains" },
  });

  const [page, setPage] = useState<number>(0);
  const [rows, setRows] = useState<number>(10);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [sortField, setSortField] = useState<string>("event_time");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const { dateRange, enterpriseKey } = useDateRangeEnterprise();
  const isReady = dateRange && dateRange[0] && dateRange[1];

  const fetchData = () => {
    if (!isReady) {
      console.warn("Waiting for valid date range...", { dateRange });
      return;
    }

    const [startDate, endDate] = dateRange;
    const queryParams = new URLSearchParams({
      startDate,
      endDate,
      page: page.toString(),
      size: rows.toString(),
    });

    if (enterpriseKey?.trim()) {
      queryParams.append("enterpriseKey", enterpriseKey);
    }

    if (sortField) {
      queryParams.append("sortField", sortField);
      queryParams.append("sortOrder", sortOrder);
    }

    // Add filters to query params (only non-null ones)
    for (const key in filters) {
      const value = filters[key]?.value;
      const matchMode = filters[key]?.matchMode;
      if (value && matchMode && key !== "global") {
        queryParams.append(`${key}.value`, value);
        queryParams.append(`${key}.matchMode`, matchMode);
      }
    }

    const url = `http://localhost:8080/api/fulfillment-efficiency/details?${queryParams.toString()}`;

    setLoading(true);
    console.log("➡ Fetching data:", url);

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((json) => {
        setData(json.fulfillment_details || []);
        setTotalRecords(json.count || 0);
        console.log("✅ Data fetched:", json);
      })
      .catch((err) => {
        console.error("❌ Fetch error:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, [dateRange, enterpriseKey, page, rows, sortField, sortOrder, filters]);

  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const _filters = { ...filters, global: { value, matchMode: "contains" } };
    setFilters(_filters);
    setGlobalFilter(value);
  };

  const onPageChange = (e: DataTablePageEvent) => {
    setPage(e.page ?? 0);
    setRows(e.rows ?? 10);
  };

  const onSort = (e: DataTableSortEvent) => {
    const newSortField = e.sortField ?? "";
    const isSameField = newSortField === sortField;
    const newSortOrder = isSameField
      ? sortOrder === "asc"
        ? "desc"
        : "asc"
      : "asc";

    setSortField(newSortField);
    setSortOrder(newSortOrder);
  };

  const onFilter = (e: DataTableFilterEvent) => {
    setFilters(e.filters);
  };

  const renderFilterInput = (field: string, placeholder: string = "Search") => {
    return (options: any) => (
      <InputText
        value={options.value || ""}
        onChange={(e) => options.filterCallback(e.target.value)}
        placeholder={placeholder}
        className="p-column-filter"
      />
    );
  };

  return (
    <div className="card p-4">
      <h2 className="text-xl mb-3">
        Fulfillment Efficiency Details ({totalRecords} records)
      </h2>

      <div className="flex justify-end mb-3">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            value={globalFilter}
            onChange={onGlobalFilterChange}
            placeholder="Global Search"
          />
        </span>
      </div>

      {loading ? (
        <div className="flex justify-center mt-5">
          <ProgressSpinner />
        </div>
      ) : (
        <DataTable
          value={data}
          paginator
          rows={rows}
          first={page * rows}
          totalRecords={totalRecords}
          onPage={onPageChange}
          rowsPerPageOptions={[10, 20, 50, 100]}
          sortMode="single"
          sortField={sortField}
          sortOrder={sortOrder === "asc" ? 1 : -1}
          onSort={onSort}
          onFilter={onFilter}
          lazy
          filters={filters}
          globalFilterFields={[
            "category",
            "order_id",
            "event_type",
            "event_description",
            "fulfilment_channel",
            "fulfillment_city",
            "fulfillment_state",
            "fulfillment_country",
            "handler_name",
          ]}
          responsiveLayout="scroll"
          emptyMessage="No records found"
        >
          {[
            ["order_id", "Order ID"],
            ["category", "Category"],
            ["event_type", "Event Type"],
            ["event_description", "Event Description"],
            ["event_time", "Event Time"],
            ["fulfilment_channel", "Channel"],
            ["fulfillment_city", "City"],
            ["fulfillment_state", "State"],
            ["fulfillment_country", "Country"],
            ["handler_name", "Handler"],
          ].map(([field, header]) => (
            <Column
              key={field}
              field={field}
              header={header}
              sortable
              filter
              filterField={field}
              filterElement={renderFilterInput(field)}
            />
          ))}
        </DataTable>
      )}
    </div>
  );
};

export default NewTable;
