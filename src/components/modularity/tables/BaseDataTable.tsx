"use client";

import React, { useState, useEffect, createContext, useContext } from "react";
import {
  DataTable,
  DataTablePageEvent,
  DataTableSortEvent,
  DataTableFilterEvent,
  DataTableValue,
} from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { ProgressSpinner } from "primereact/progressspinner";
import { useIsMobile } from "./useIsMobile";

interface BaseDataTableProps<T extends DataTableValue> {
  field: keyof T;
  header: string;
  columns: TableColumn<T>[];
  fetchData: (params: any) => Promise<{ data: T[]; count: number }>;
  initialSortField?: string;
  initialSortOrder?: 1 | -1;
  initialRows?: number;
  mobileCardRender?: (item: T, index: number) => React.ReactNode;
  mobilePagination?: boolean;
  title?: string;
  globalFilterFields?: string[];
  emptyMessage?: string;
  rowsPerPageOptions?: number[];
}

export interface TableColumn<T extends DataTableValue> {
  field: keyof T;
  header: string;
  sortable?: boolean;
  filter?: boolean;
  filterPlaceholder?: string;
  body?: (rowData: T) => React.ReactNode;
  className?: string;
}

interface BaseDataTableContextProps<T> {
  data: T[];
  loading: boolean;
  totalRecords: number;
}

const BaseDataTableContext = createContext<BaseDataTableContextProps<any>>({
  data: [],
  loading: false,
  totalRecords: 0,
});

export function BaseDataTable<T extends DataTableValue>({
  columns,
  fetchData,
  initialSortField = "",
  initialRows = 10,
  mobileCardRender,
  mobilePagination = true,
  title,
  globalFilterFields = [],
  emptyMessage = "No records found",
  rowsPerPageOptions = [10, 20, 50],
}: BaseDataTableProps<T>) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState(initialRows);
  const [sortField, setSortField] = useState(initialSortField);
  const [sortOrder, setSortOrder] = useState<1 | -1>(1);
  const [filters, setFilters] = useState<any>({
    global: { value: null, matchMode: "contains" },
    ...columns.reduce((acc, column) => {
      if (column.filter) {
        acc[column.field as string] = { value: null, matchMode: "contains" };
      }
      return acc;
    }, {} as Record<string, any>),
  });

  const isMobile = useIsMobile();

  const loadData = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        size: rows,
        sortField: sortField || undefined,
        sortOrder: sortOrder === 1 ? "asc" : "desc",
        ...Object.entries(filters).reduce((acc, [key, value]) => {
          if (
            key !== "global" &&
            value &&
            typeof value === "object" &&
            "value" in value &&
            value.value
          ) {
            acc[`${key}Filter`] = value.value;
          }
          return acc;
        }, {} as Record<string, any>),
      };

      const response = await fetchData(params);
      setData(response.data || []);
      setTotalRecords(response.count || 0);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [page, rows, sortField, sortOrder, filters]);

  const onPageChange = (e: DataTablePageEvent) => {
    setPage(e.page ?? 0);
    setRows(e.rows ?? initialRows);
  };

  const onSort = (e: DataTableSortEvent) => {
    if (e.sortField === sortField) {
      setSortOrder((prevOrder) => (prevOrder === 1 ? -1 : 1));
    } else {
      setSortField(e.sortField ?? initialSortField);
      setSortOrder(1);
    }
  };
  const onFilter = (e: DataTableFilterEvent) => {
    setFilters(e.filters);
    setPage(0);
  };

  const renderFilterInput = (placeholder = "Search") => {
    return (options: any) => (
      <InputText
        value={options.value || ""}
        onChange={(e) => options.filterCallback(e.target.value)}
        placeholder={placeholder}
        className="p-column-filter"
      />
    );
  };

  const renderMobilePagination = () => {
    if (!mobilePagination) return null;

    const totalPages = Math.ceil(totalRecords / rows);
    return (
      <div className="flex flex-col text-sm text-gray-700 dark:text-gray-100 mt-4">
        <div className="flex flex-col gap-2 mb-2 w-full">
          <label htmlFor="mobileRows" className="whitespace-nowrap">
            Rows per page:
          </label>
          <select
            id="mobileRows"
            value={rows}
            onChange={(e) => {
              setRows(Number(e.target.value));
              setPage(0);
            }}
            className="px-2 py-1 rounded dark:bg-gray-800 bg-gray-100 dark:text-white text-gray-800 w-full border"
          >
            {rowsPerPageOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="text-black dark:text-white font-medium">
          Page {page + 1} of {totalPages}
        </div>

        <div className="flex flex-wrap justify-between gap-2 w-full mt-2">
          <button
            onClick={() => setPage(0)}
            disabled={page === 0}
            className="flex-1 px-2 py-1 text-xs rounded-md font-medium bg-gray-100 dark:bg-gray-800 text-black dark:text-white disabled:opacity-40"
          >
            ⏮ First
          </button>
          <button
            onClick={() => setPage(Math.max(0, page - 1))}
            disabled={page === 0}
            className="flex-1 px-2 py-1 text-xs rounded-md font-medium bg-gray-100 dark:bg-gray-800 text-black dark:text-white disabled:opacity-40"
          >
            Prev
          </button>
          <button
            onClick={() => setPage(Math.min(page + 1, totalPages - 1))}
            disabled={page + 1 >= totalPages}
            className="flex-1 px-2 py-1 text-xs rounded-md font-medium bg-gray-100 dark:bg-gray-800 text-black dark:text-white disabled:opacity-40"
          >
            Next
          </button>
          <button
            onClick={() => setPage(totalPages - 1)}
            disabled={page + 1 >= totalPages}
            className="flex-1 px-2 py-1 text-xs rounded-md font-medium bg-gray-100 dark:bg-gray-800 text-black dark:text-white disabled:opacity-40"
          >
            Last
          </button>
        </div>
      </div>
    );
  };

  return (
    <BaseDataTableContext.Provider value={{ data, loading, totalRecords }}>
      <div className="card p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md">
        {title && <h3 className="app-section-title mb-4">{title}</h3>}

        {loading ? (
          <div className="flex justify-center mt-5">
            <ProgressSpinner />
          </div>
        ) : isMobile && mobileCardRender ? (
          <>
            <div>{data.map((item, index) => mobileCardRender(item, index))}</div>
            {renderMobilePagination()}
          </>
        ) : (
          (() => {
            const firstRecord = totalRecords === 0 ? 0 : page * rows + 1;
            const lastRecord = Math.min(totalRecords, (page + 1) * rows);
            return (
              <DataTable
                value={data}
                lazy
                paginator
                first={page * rows}
                paginatorTemplate="RowsPerPageDropdown CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
                currentPageReportTemplate={`Showing ${firstRecord} to ${lastRecord} of ${totalRecords} orders`}
                rows={rows}
                totalRecords={totalRecords}
                onPage={onPageChange}
                rowsPerPageOptions={rowsPerPageOptions}
                sortMode="single"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={onSort}
                onFilter={onFilter}
                filters={filters}
                globalFilterFields={globalFilterFields}
                emptyMessage={emptyMessage}
                responsiveLayout="scroll"
              >
                {columns.map((column) => (
                  <Column
                    key={column.field as string}
                    field={column.field as string}
                    header={column.header}
                    sortable={column.sortable}
                    filter={column.filter}
                    filterElement={renderFilterInput(column.filterPlaceholder)}
                    body={column.body}
                    className={column.className}
                  />
                ))}
              </DataTable>
            );
          })()
        )}
      </div>
    </BaseDataTableContext.Provider>
  );
}

BaseDataTable.ChartWrapper = function ChartWrapper<T>({
  children,
}: {
  children: (context: BaseDataTableContextProps<T>) => React.ReactNode;
}) {
  const context = useContext(BaseDataTableContext);
  return <>{children(context)}</>;
};