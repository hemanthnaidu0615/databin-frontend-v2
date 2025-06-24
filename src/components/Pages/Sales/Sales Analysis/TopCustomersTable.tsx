"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  DataTable,
  DataTablePageEvent,
  DataTableSortEvent,
  DataTableFilterEvent,
} from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { ProgressSpinner } from "primereact/progressspinner";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useTheme } from "next-themes";

import { useDateRangeEnterprise } from "../../../utils/useGlobalFilters";
import { formatDateTime, formatValue } from "../../../utils/kpiUtils";
import { axiosInstance } from "../../../../axios";
import { getBaseTooltip, revenueTooltip } from "../../../modularity/graphs/graphWidget";

import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

interface Customer {
  customer_name: string;
  total_spent: number;
  total_orders: number;
}

const convertToUSD = (rupees: number) => rupees * 0.012;

const TopCustomersTable: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [data, setData] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState<any>({
    global: { value: null, matchMode: "contains" },
    customer_name: { value: null, matchMode: "contains" },
    total_orders: { value: null, matchMode: "equals" },
    total_spent: { value: null, matchMode: "equals" },
  });

  const [page, setPage] = useState<number>(0);
  const [rows, setRows] = useState<number>(10);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [sortField, setSortField] = useState<string>("total_spent");
  const [sortOrder, setSortOrder] = useState<1 | -1>(-1);

  const { dateRange, enterpriseKey } = useDateRangeEnterprise();
  const isReady = dateRange && dateRange[0] && dateRange[1];

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 768);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const fetchData = () => {
    if (!isReady) return;

    const [startDate, endDate] = dateRange!;
    const params = new URLSearchParams({
      startDate: formatDateTime(startDate),
      endDate: formatDateTime(endDate),
      page: page.toString(),
      size: rows.toString(),
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

    setLoading(true);
    axiosInstance
      .get(`/analysis/customer-order-summary?${params}`)
      .then((res) => {
        setData(res.data.customers || []);
        setTotalRecords(res.data.count || 0);
      })
      .catch(() => {
        setData([]);
        setTotalRecords(0);
      })
      .finally(() => setLoading(false));
  };

  useEffect(fetchData, [dateRange, enterpriseKey, page, rows, sortField, sortOrder, JSON.stringify(filters)]);
  const onPageChange = (e: DataTablePageEvent) => { setPage(e.page!); setRows(e.rows!); };
  const onSort = (e: DataTableSortEvent) => {
    const field = e.sortField || "";
    const same = field === sortField;
    setSortField(field);
    setSortOrder(same ? (sortOrder * -1) as 1 | -1 : 1);
  };
  const onFilter = (e: DataTableFilterEvent) => { setFilters(e.filters); setPage(0); };

  const renderFilterInput = (placeholder = "Search") => (opts: any) => (
    <InputText
      value={opts.value || ""}
      onChange={(e) => opts.filterCallback(e.target.value)}
      placeholder={placeholder}
      className="p-column-filter"
    />
  );

  const top10 = useMemo(() =>
    [...data]
      .sort((a, b) => b.total_spent - a.total_spent)
      .slice(0, 10),
    [data]
  );

  const chartOptions: ApexOptions = useMemo(() => ({
    chart: { type: "bar", toolbar: { show: false }, foreColor: isDark ? "#CBD5E1" : "#334155" },
    xaxis: {
      categories: top10.map(c => c.customer_name),
      labels: { style: { fontSize: "12px", colors: isDark ? "#CBD5E1" : "#334155" } }
    },
    yaxis: {
      title: { text: "Total Spent ($)", style: { fontSize: "14px", color: isDark ? "#CBD5E1" : "#64748B" } },
      labels: { formatter: (v) => `$${formatValue(v)}` }
    },
    dataLabels: { enabled: false },
    plotOptions: { bar: { borderRadius: 4, columnWidth: "50%" } },
    grid: { borderColor: isDark ? "#334155" : "#E5E7EB" },
    colors: ["#a855f7"],
    tooltip: getBaseTooltip(isDark, revenueTooltip),
  }), [isDark, top10]);

  const chartSeries = [{ name: "Total Spent", data: top10.map(c => convertToUSD(c.total_spent)) }];


  return (
    <div className="card p-4">
      <h2 className="app-subheading">Top Customers</h2>

      {loading ? (
        <div className="flex justify-center"><ProgressSpinner /></div>
      ) : isMobile ? (
        <>
          {data.length === 0 && <p className="text-center text-gray-500">No customers found</p>}

          {/* 🟣 Mobile card layout with proper slicing */}
          <div className="space-y-4 mt-2">
            {data.slice(page * rows, page * rows + rows).map((customer, index) => (
              <div
                key={index}
                className={`bg-gray-100 dark:bg-gray-800 rounded-lg p-4 flex flex-col gap-2 shadow-sm border ${isDark ? "border-gray-700" : "border-gray-200"}`}
              >
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                    Customer:
                  </span>
                  <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 break-words">
                    {customer.customer_name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Orders:</span>
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    {formatValue(customer.total_orders)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Total Spent:</span>
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    ${formatValue(convertToUSD(customer.total_spent))}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* 🟣 Mobile Rows per Page and Pagination */}
          {totalRecords > rows && (
            <div className="mt-4 text-sm text-gray-800 dark:text-gray-100 sm:hidden">
              <div className="flex flex-col gap-2 mb-2">
                <div>
                  <label htmlFor="mobileRows">Rows per page:</label>
                  <select
                    id="mobileRows"
                    value={rows}
                    onChange={(e) => {
                      setRows(Number(e.target.value));
                      setPage(0);
                    }}
                    className="px-2 py-1 rounded w-full border dark:bg-gray-800 bg-gray-100"
                  >
                    {[5, 10, 20, 50, 100].map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  Page {page + 1} of {Math.ceil(totalRecords / rows)}
                </div>
              </div>

              <div className="flex flex-wrap justify-between gap-2">
                <button onClick={() => setPage(0)} disabled={page === 0}>⏮ First</button>
                <button onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0}>Prev</button>
                <button onClick={() => setPage(Math.min(Math.ceil(totalRecords / rows) - 1, page + 1))} disabled={(page + 1) * rows >= totalRecords}>Next</button>
                <button onClick={() => setPage(Math.ceil(totalRecords / rows) - 1)} disabled={(page + 1) * rows >= totalRecords}>⏭ Last</button>
              </div>
            </div>
          )}
        </>

      ) : (
        <DataTable
          value={data}
          paginator rows={rows} first={page * rows}
          totalRecords={totalRecords}
          onPage={onPageChange}
          rowsPerPageOptions={[10, 20, 50, 100]}
          sortMode="single"
          sortField={sortField}
          sortOrder={sortOrder}
          onSort={onSort}
          onFilter={onFilter}
          filters={filters}
          globalFilterFields={["customer_name"]}
          responsiveLayout="scroll"
          emptyMessage="No customers found"
        >
          <Column
            field="customer_name" header="Customer Name"
            sortable filter filterField="customer_name"
            filterElement={renderFilterInput()}
          />
          <Column
            field="total_orders" header="Orders"
            sortable filter filterField="total_orders"
            filterElement={renderFilterInput("Orders")}
            style={{ textAlign: "left" }}
            body={(row: Customer) => formatValue(row.total_orders)}
          />
          <Column
            field="total_spent" header="Total Spent ($)"
            sortable filter filterField="total_spent"
            filterElement={renderFilterInput("Spent")}
            style={{ textAlign: "left" }}
            body={(row: Customer) => `$${formatValue(convertToUSD(row.total_spent))}`}
          />
        </DataTable>
      )}

      <h3 className="app-subheading">Top 10 Customers by Spending</h3>
      {top10.length > 0 ? (
        <Chart options={chartOptions} series={chartSeries} type="bar" height={350} />
      ) : (
        <p className="text-center text-gray-500">No customer data available for visualization.</p>
      )}
    </div>
  );
};

export default TopCustomersTable;
