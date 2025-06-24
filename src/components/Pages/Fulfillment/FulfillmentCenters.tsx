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
import { Tag } from "primereact/tag";
import { useTheme } from "next-themes";
import { useSelector } from "react-redux";
import { axiosInstance } from "../../../axios";
import { formatDateTime } from "../../utils/kpiUtils";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

interface CenterData {
  center: string;
  orders: number;
  avg_time_days: number;
  on_time_rate: number;
}

const FulfillmentCenters: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [data, setData] = useState<CenterData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<any>({
    global: { value: null, matchMode: "contains" },
    center: { value: null, matchMode: "contains" },
    orders: { value: null, matchMode: "equals" },
    avg_time_days: { value: null, matchMode: "equals" },
    on_time_rate: { value: null, matchMode: "equals" },
  });
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [sortField, setSortField] = useState<string>("center");
  const [sortOrder, setSortOrder] = useState<1 | -1>(1);
  const [isMobile, setIsMobile] = useState(false);
  const [expandedCenter, setExpandedCenter] = useState<string | null>(null);

  const dateRange = useSelector((state: any) => state.dateRange.dates);
  const [startDate, endDate] = dateRange || [];
  const enterpriseKey = useSelector((state: any) => state.enterpriseKey.key);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getRateSeverity = (rate: number): "success" | "info" | "warning" | "danger" => {
    if (rate >= 95) return "success";
    if (rate >= 90) return "info";
    if (rate >= 85) return "warning";
    return "danger";
  };

  const fetchData = () => {
    if (!startDate || !endDate) return;
    setLoading(true);
    const params = new URLSearchParams({
      startDate: formatDateTime(startDate),
      endDate: formatDateTime(endDate),
      page: String(page),
      size: String(rows),
    });
    if (enterpriseKey) params.append("enterpriseKey", enterpriseKey);
    if (sortField) {
      params.append("sortField", sortField);
      params.append("sortOrder", sortOrder === 1 ? "asc" : "desc");
    }
    Object.entries(filters).forEach(([k, v]: any) => {
      if (k === "global") return;
      if (v.value != null && v.value !== "") {
        params.append(`${k}.value`, v.value);
        params.append(`${k}.matchMode`, v.matchMode);
      }
    });
    if (filters.global.value) {
      params.append("global.value", filters.global.value);
      params.append("global.matchMode", filters.global.matchMode);
    }

    axiosInstance
      .get(`/fulfillment/fulfillment-performance?${params.toString()}`)
      .then((res) => {
        setData(res.data.data || []);
        setTotalRecords(res.data.count || 0);
      })
      .catch(() => {
        setData([]);
        setTotalRecords(0);
      })
      .finally(() => setLoading(false));
  };

  useEffect(fetchData, [startDate, endDate, enterpriseKey, page, rows, sortField, sortOrder, JSON.stringify(filters)]);

  const onPageChange = (e: DataTablePageEvent) => {
    setPage(e.page!);
    setRows(e.rows!);
  };

  const onSort = (e: DataTableSortEvent) => {
    const f = e.sortField || "";
    const same = f === sortField;
    setSortField(f);
    setSortOrder(same ? (sortOrder * -1 as 1 | -1) : 1);
  };

  const onFilter = (e: DataTableFilterEvent) => {
    setFilters(e.filters);
    setPage(0);
  };

  const renderFilterInput = (placeholder = "Search") => (opts: any) => (
    <InputText
      value={opts.value || ""}
      onChange={(e) => opts.filterCallback(e.target.value)}
      placeholder={placeholder}
      className="p-column-filter"
    />
  );

  const mobileTotalPages = Math.ceil(totalRecords / rows);

  return (
    <div className="card p-4">
      <h2 className="app-subheading">Fulfillment Center Performance</h2>

      {loading && isMobile && (
        <div className="flex justify-center my-4">
          <ProgressSpinner />
        </div>
      )}

      {loading && !isMobile ? (
        <div className="flex justify-center"><ProgressSpinner /></div>
      ) : isMobile ? (
        <>
          <div className="space-y-3">
            {data.map((row) => (
              <div
                key={row.center}
                className={`p-4 rounded-md border cursor-pointer ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
                onClick={() => setExpandedCenter(expandedCenter === row.center ? null : row.center)}
              >
                <div className="flex justify-between items-center">
                  <span className="font-semibold">{row.center}</span>
                  <div className="flex items-center gap-2">
                    <Tag value={`${row.on_time_rate}%`} severity={getRateSeverity(row.on_time_rate)} />
                    {expandedCenter === row.center ? <FaChevronUp /> : <FaChevronDown />}
                  </div>
                </div>
                {expandedCenter === row.center && (
                  <div className="mt-2 text-sm space-y-1">
                    <div>Orders: {row.orders}</div>
                    <div>Avg Time: {row.avg_time_days} days</div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Rows per page dropdown for mobile */}
          <div className="flex flex-col gap-1 mb-3">
            <label
              htmlFor="mobileRows"
              className="whitespace-nowrap text-sm text-gray-800 dark:text-gray-200"
            >
              Rows per page:
            </label>
            <select
              id="mobileRows"
              value={rows}
              onChange={(e) => {
                setRows(Number(e.target.value));
                setPage(0);
              }}
              disabled={loading}
              className="px-2 py-1 border rounded-md dark:bg-gray-700 dark:text-white"
            >
              {[5, 10, 20, 50, 100].map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-center mt-4">
            <div className="inline-flex items-center space-x-2 border rounded-md px-3 py-1 text-xs shadow-sm bg-gray-50 dark:bg-gray-800">
              <button
                onClick={() => setPage(0)}
                disabled={page === 0 || loading}
                className={`px-1 ${page === 0 || loading ? "opacity-50 cursor-not-allowed" : "hover:text-purple-500"}`}
              >
                ⏮ First
              </button>
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 0))}
                disabled={page === 0 || loading}
                className={`px-1 ${page === 0 || loading ? "opacity-50 cursor-not-allowed" : "hover:text-purple-500"}`}
              >
                ◀ Prev
              </button>
              <span className="px-1 text-gray-700 dark:text-gray-200">
                Page <strong>{page + 1}</strong> of <strong>{mobileTotalPages}</strong>
              </span>
              <button
                onClick={() => setPage((p) => Math.min(p + 1, mobileTotalPages - 1))}
                disabled={page + 1 >= mobileTotalPages || loading}
                className={`px-1 ${page + 1 >= mobileTotalPages || loading ? "opacity-50 cursor-not-allowed" : "hover:text-purple-500"}`}
              >
                Next ▶
              </button>
              <button
                onClick={() => setPage(mobileTotalPages - 1)}
                disabled={page + 1 >= mobileTotalPages || loading}
                className={`px-1 ${page + 1 >= mobileTotalPages || loading ? "opacity-50 cursor-not-allowed" : "hover:text-purple-500"}`}
              >
                Last ⏭
              </button>
            </div>
          </div>
        </>
      ) : (
        <DataTable
          value={data}
          lazy
          paginator
          first={page * rows}
          rows={rows}
          totalRecords={totalRecords}
          onPage={onPageChange}
          rowsPerPageOptions={[10, 20, 50, 100]}
          sortMode="single"
          sortField={sortField}
          sortOrder={sortOrder}
          onSort={onSort}
          filters={filters}
          onFilter={onFilter}
          globalFilterFields={["center"]}
          responsiveLayout="scroll"
          emptyMessage="No data found"
        >
          <Column
            field="center"
            header="Center"
            sortable
            filter
            filterField="center"
            filterElement={renderFilterInput()}
          />
          <Column
            field="orders"
            header="Orders"
            sortable
            filter
            filterField="orders"
            filterElement={renderFilterInput("Orders")}
          />
          <Column
            field="avg_time_days"
            header="Avg Time (days)"
            sortable
            filter
            filterField="avg_time_days"
            filterElement={renderFilterInput("Avg Time")}
          />
          <Column
            field="on_time_rate"
            header="On‑Time Rate (%)"
            sortable
            filter
            filterField="on_time_rate"
            filterElement={renderFilterInput("Rate")}
            body={(row: CenterData) => (
              <Tag value={`${row.on_time_rate}%`} severity={getRateSeverity(row.on_time_rate)} />
            )}
          />
        </DataTable>
      )}
    </div>
  );
};

export default FulfillmentCenters;
