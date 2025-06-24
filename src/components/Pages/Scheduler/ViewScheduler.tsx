"use client";

import React, { useEffect, useState } from "react";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";
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
  const [globalFilter] = useState("");
  const [expandedStates, setExpandedStates] = useState<string[]>([]);

  const [filters, setFilters] = useState<any>({
    global: { value: null, matchMode: "contains" },
    title: { value: null, matchMode: "contains" },
    description: { value: null, matchMode: "contains" },
    email: { value: null, matchMode: "contains" },
    recurrence_pattern: { value: null, matchMode: "contains" },
    date_range_type: { value: null, matchMode: "contains" },
    start_date: { value: null, matchMode: "contains" },
  });
  const arrowExpand = (title: string) => {
    setExpandedStates((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };
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
      const resp = response.data as { data: Scheduler[]; count: number };
      setData(resp.data);
      setTotalRecords(resp.count);
    } catch (error) {
      console.error("Error fetching schedulers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, rows, sortField, sortOrder, filters, globalFilter]);

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

  const renderFilterInput = (placeholder: string = "Search") => {
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
      <h2 className="text-xl mb-3">View Scheduled Reports</h2>

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
            <Column field="title" header="Title" sortable filter filterElement={renderFilterInput()} />
            <Column field="description" header="Description" sortable filter filterElement={renderFilterInput()} />
            <Column field="email" header="Email" sortable filter filterElement={renderFilterInput()} />
            <Column field="recurrence_pattern" header="Recurrence" sortable filter filterElement={renderFilterInput()} />
            <Column
              field="start_date"
              header="Start Date"
              sortable
              body={(rowData: Scheduler) => moment(rowData.start_date).format("YYYY-MM-DD HH:mm")}
              filterElement={renderFilterInput()}
            />
            <Column field="date_range_type" header="Time Frame" sortable filter filterElement={renderFilterInput()} />
          </DataTable>
        )}
      </div>

      {/* Mobile View */}
      {/* Mobile View */}
      <div className="block lg:hidden">
        <table className="min-w-full border-separate border-spacing-0">
          <thead className="sticky top-0 z-20 bg-gray-200 dark:bg-gray-900 text-xs">
            <tr>
              <th className=""></th>
              <th className="text-left px-4 py-2 app-table-heading text-gray-300 dark:text-gray-100">
                Title
              </th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-800 dark:text-gray-200 app-table-content">
            {data.map((row) => (
              <React.Fragment key={`${row.email}-${row.title}`}>
                <tr
                  className="hover:bg-gray-50 hover:dark:bg-white/[0.05] cursor-pointer transition-colors"
                  onClick={() => arrowExpand(row.title)}
                >
                  <td className="py-3 px-4">
                    {expandedStates.includes(row.title) ? (
                      <FaChevronUp className="text-gray-500 dark:text-gray-400" />
                    ) : (
                      <FaChevronDown className="text-gray-500 dark:text-gray-400" />
                    )}
                  </td>
                  <td className="py-3 px-4">{row.title}</td>
                </tr>

                {expandedStates.includes(row.title) && (
                  <tr>
                    <td colSpan={2} className="px-4 pb-4">
                      <div className="rounded-xl bg-gray-100 dark:bg-white/5 p-4 text-sm text-gray-800 dark:text-gray-300 shadow-sm space-y-3 w-full">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Description</span>
                          <span className="text-right font-medium text-gray-900 dark:text-white break-words max-w-[60%]">
                            {row.description}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Email</span>
                          <span className="text-right font-medium text-gray-900 dark:text-white break-all max-w-[60%]">
                            {row.email}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Recurrence</span>
                          <span className="font-medium text-gray-900 dark:text-white">{row.recurrence_pattern}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Start Date</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {moment(row.start_date).format("YYYY-MM-DD HH:mm")}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Time Frame</span>
                          <span className="font-medium text-gray-900 dark:text-white">{row.date_range_type}</span>
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
  );

};

export default ViewScheduler;
