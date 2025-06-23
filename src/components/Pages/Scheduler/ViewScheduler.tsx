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
import { axiosInstance } from "../../../axios";
import moment from "moment";

interface Scheduler {
  title: string;
  description: string;
  email: string;
  start_date: string;
  recurrence_pattern: string;
  date_range_type: string | null;
}

const ViewScheduler: React.FC = () => {
  const [data, setData] = useState<Scheduler[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState(15);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState("start_date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [globalFilter, setGlobalFilter] = useState("");

  const [filters, setFilters] = useState<any>({
    global: { value: null, matchMode: "contains" },
    title: { value: null, matchMode: "contains" },
    description: { value: null, matchMode: "contains" },
    email: { value: null, matchMode: "contains" },
    recurrence_pattern: { value: null, matchMode: "contains" },
    date_range_type: { value: null, matchMode: "contains" },
    start_date: { value: null, matchMode: "contains" },
  });

  const fetchData = async () => {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      size: rows.toString(),
      sortField,
      sortOrder,
    });

    if (globalFilter.trim()) {
      queryParams.append("title.value", globalFilter);
      queryParams.append("title.matchMode", "contains");
    }

    for (const key in filters) {
      const value = filters[key]?.value;
      const matchMode = filters[key]?.matchMode;
      if (value && key !== "global") {
        queryParams.append(`${key}.value`, value);
        queryParams.append(`${key}.matchMode`, matchMode);
      }
    }

    const url = `/schedulers/view?${queryParams.toString()}`;
    setLoading(true);

    try {
      const response = await axiosInstance.get(url);
      setData(response.data.data);
      setTotalRecords(response.data.count);
    } catch (error) {
      console.error("Error fetching schedulers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, rows, sortField, sortOrder, filters, globalFilter]);

  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setGlobalFilter(value);
    setFilters((prev: any) => ({
      ...prev,
      global: { value, matchMode: "contains" },
    }));
  };

  const onPageChange = (e: DataTablePageEvent) => {
    setPage(e.page ?? 0);
    setRows(e.rows ?? 15);
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
    <h2 className="text-xl mb-3">View Scheduled Reports ({totalRecords} records)</h2>

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

    {/* Desktop Table */}
    <div className="hidden lg:block">
      {loading ? (
        <div className="flex justify-center mt-5">
          <ProgressSpinner />
        </div>
      ) : (
        <DataTable
          value={data}
          paginator
          lazy
          rows={rows}
          first={page * rows}
          totalRecords={totalRecords}
          onPage={onPageChange}
          rowsPerPageOptions={[10, 15, 20, 50]}
          sortMode="single"
          sortField={sortField}
          sortOrder={sortOrder === "asc" ? 1 : -1}
          onSort={onSort}
          onFilter={onFilter}
          filters={filters}
          globalFilterFields={[
            "title",
            "description",
            "email",
            "recurrence_pattern",
            "start_date",
            "date_range_type",
          ]}
          responsiveLayout="scroll"
          emptyMessage="No scheduled reports found"
        >
          <Column field="title" header="Title" sortable filter filterElement={renderFilterInput("title")} />
          <Column field="description" header="Description" sortable filter filterElement={renderFilterInput("description")} />
          <Column field="email" header="Email" sortable filter filterElement={renderFilterInput("email")} />
          <Column field="recurrence_pattern" header="Recurrence" sortable filter filterElement={renderFilterInput("recurrence_pattern")} />
          <Column
            field="start_date"
            header="Start Date"
            sortable
            body={(rowData: Scheduler) => moment(rowData.start_date).format("YYYY-MM-DD HH:mm")}
            filterElement={renderFilterInput("start_date")}
          />
          <Column field="date_range_type" header="Time Frame" sortable filter filterElement={renderFilterInput("date_range_type")} />
        </DataTable>
      )}
    </div>

    {/* Mobile View */}
    <div className="block lg:hidden space-y-4 mt-4">
      {loading ? (
        <div className="flex justify-center mt-5">
          <ProgressSpinner />
        </div>
      ) : (
        data.map((item, idx) => (
          <div
            key={`${item.title}-${idx}`}
            className="rounded-lg border border-gray-200 dark:border-white/10 p-4 shadow-sm bg-white dark:bg-gray-900 space-y-3 text-sm"
          >
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Title</span>
              <span className="font-medium text-gray-900 dark:text-white">{item.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Description</span>
              <span className="font-medium text-gray-900 dark:text-white break-words max-w-[60%] text-right">
                {item.description}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Email</span>
              <span className="font-medium text-gray-900 dark:text-white break-all text-right">{item.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Recurrence</span>
              <span className="font-medium text-gray-900 dark:text-white">{item.recurrence_pattern}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Start Date</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {moment(item.start_date).format("YYYY-MM-DD HH:mm")}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Time Frame</span>
              <span className="font-medium text-gray-900 dark:text-white">{item.date_range_type}</span>
            </div>
          </div>
        ))
      )}
    </div>
  </div>
);

};

export default ViewScheduler;
