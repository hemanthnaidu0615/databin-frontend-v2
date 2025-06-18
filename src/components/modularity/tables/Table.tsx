import React, { useEffect, useState } from "react";
import { Paginator } from "primereact/paginator";
import { Tag } from "primereact/tag";
import { ProgressBar } from "primereact/progressbar";
import { InputText } from "primereact/inputtext";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

// ==================== TYPES ====================
export type TableColumn = {
  field: string;
  header: string;
  type?: "text" | "tag" | "progress" | "custom";
  width?: string;
  mobilePriority?: boolean;
  tagSeverity?: (value: any) => string;
  customBody?: (rowData: any) => React.ReactNode;
};

export type TableConfig = {
  columns: TableColumn[];
  mobileCardFields?: string[]; // Fields to show in mobile card view
  statusColors?: Record<string, string>; // For tag styling
  expandable?: boolean; // For mobile expandable rows
};

export type PaginationConfig = {
  page: number;
  rows: number;
  totalRecords: number;
  onPageChange: (page: number, rows: number) => void;
  rowsPerPageOptions?: number[];
};

export type TableProps = {
  data: any[];
  config: TableConfig;
  pagination?: PaginationConfig;
  loading?: boolean;
  error?: string | null;
  globalFilter?: string;
  onGlobalFilterChange?: (filter: string) => void;
  searchPlaceholder?: string;
  title?: string;
  className?: string;
};

// ==================== HOOKS ====================
export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
};

export const usePagination = (initialPage = 0, initialRows = 10) => {
  const [page, setPage] = useState(initialPage);
  const [rows, setRows] = useState(initialRows);

  const onPageChange = (newPage: number, newRows: number) => {
    setPage(newPage);
    setRows(newRows);
  };

  return { page, rows, onPageChange };
};

// ==================== COMPONENTS ====================
export const TableHeader: React.FC<{
  title?: string;
  globalFilter?: string;
  onGlobalFilterChange?: (filter: string) => void;
  searchPlaceholder?: string;
  loading?: boolean;
}> = ({ title, globalFilter, onGlobalFilterChange, searchPlaceholder, loading }) => (
  <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
    {title && <h3 className="app-section-title">{title}</h3>}
    {onGlobalFilterChange && (
      <div className="flex gap-2 flex-wrap items-center">
        <InputText
          type="search"
          value={globalFilter || ""}
          onChange={(e) => onGlobalFilterChange(e.target.value)}
          placeholder={searchPlaceholder || "Search..."}
          className="app-search-input"
          disabled={loading}
        />
      </div>
    )}
  </div>
);

export const TableView: React.FC<TableProps> = ({
  data,
  config,
  pagination,
  loading,
  error,
  globalFilter,
  onGlobalFilterChange,
  searchPlaceholder,
  title,
  className = "",
}) => {
  const isMobile = useIsMobile();

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  if (data.length === 0) {
    return <p>No data available</p>;
  }

  return (
    <div className={`bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md ${className}`}>
      <TableHeader
        title={title}
        globalFilter={globalFilter}
        onGlobalFilterChange={onGlobalFilterChange}
        searchPlaceholder={searchPlaceholder}
        loading={loading}
      />

      {!isMobile ? (
        <DesktopTableView data={data} config={config} />
      ) : config.expandable ? (
        <MobileExpandableView data={data} config={config} />
      ) : (
        <MobileCardView data={data} config={config} />
      )}

      {pagination && (
        <TablePagination
          pagination={pagination}
          isMobile={isMobile}
          loading={loading}
        />
      )}
    </div>
  );
};

const DesktopTableView: React.FC<{ data: any[]; config: TableConfig }> = ({
  data,
  config,
}) => {
  return (
    <div className="overflow-hidden">
      <table className="min-w-full text-sm text-left">
        <thead className="border-b dark:border-gray-700">
          <tr>
            {config.columns.map((col) => (
              <th key={col.field} className="py-2 px-1 app-table-heading">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, idx) => (
            <tr key={idx} className="border-t dark:border-gray-700">
              {config.columns.map((col) => (
                <td key={col.field} className="py-2 px-1 app-table-content">
                  {renderTableCell(item, col, config)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const MobileCardView: React.FC<{ data: any[]; config: TableConfig }> = ({
  data,
  config,
}) => {
  const fieldsToShow = config.mobileCardFields || 
    config.columns.filter(col => col.mobilePriority).map(col => col.field);

  return (
    <div className="space-y-4 mt-4">
      {data.map((item, idx) => (
        <div
          key={idx}
          className="border rounded-lg p-6 dark:border-gray-700 bg-white dark:bg-gray-800"
        >
          <div className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200">
            {item[fieldsToShow[0]] || "No title"}
          </div>
          <div className="grid grid-cols-2 text-xs gap-y-2 text-gray-700 dark:text-gray-300">
            {fieldsToShow.slice(1).map((field) => (
              <div key={field}>
                <strong>{field}:</strong> {renderMobileField(item, field, config)}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const MobileExpandableView: React.FC<{ data: any[]; config: TableConfig }> = ({
  data,
  config,
}) => {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const primaryField = config.columns[0].field;
  const mainColumns = config.columns.filter(col => col.mobilePriority || col.field === primaryField);
  const expandableColumns = config.columns.filter(col => !col.mobilePriority && col.field !== primaryField);

  return (
    <div className="max-h-[400px] overflow-y-auto">
      <table className="min-w-full border-separate border-spacing-0 w-full">
        <thead className="sticky top-0 z-20 bg-purple-100 dark:bg-gray-800 text-xs">
          <tr>
            <th className="w-8"></th>
            {mainColumns.map((col) => (
              <th key={col.field} className="text-left px-4 py-2 app-table-heading">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-sm text-gray-800 dark:text-gray-200 app-table-content">
          {data.map((item) => (
            <React.Fragment key={item[primaryField]}>
              <tr
                onClick={() => setExpandedRow(expandedRow === item[primaryField] ? null : item[primaryField])}
                className="hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer transition-colors"
              >
                <td className="py-3 px-4">
                  {expandedRow === item[primaryField] ? (
                    <FaChevronUp className="text-gray-500 dark:text-gray-400" />
                  ) : (
                    <FaChevronDown className="text-gray-500 dark:text-gray-400" />
                  )}
                </td>
                {mainColumns.map((col) => (
                  <td key={col.field} className="py-3 px-4">
                    {renderTableCell(item, col, config)}
                  </td>
                ))}
              </tr>

              {expandedRow === item[primaryField] && (
                <tr className="lg:hidden">
                  <td></td>
                  <td colSpan={mainColumns.length} className="px-4 pb-4">
                    <div className="rounded-xl bg-gray-100 dark:bg-white/5 p-3 text-xs text-gray-600 dark:text-gray-300 space-y-2 shadow-sm">
                      {expandableColumns.map((col) => (
                        <div key={col.field} className="flex justify-between items-center">
                          <span className="text-gray-500 dark:text-gray-400">{col.header}</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {renderMobileField(item, col.field, config)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const TablePagination: React.FC<{
  pagination: PaginationConfig;
  isMobile: boolean;
  loading?: boolean;
}> = ({ pagination, isMobile, loading }) => {
  const { page, rows, totalRecords, onPageChange, rowsPerPageOptions = [5, 10, 20, 50] } = pagination;

  if (isMobile) {
    return (
      <div className="flex flex-col sm:hidden text-sm text-gray-700 dark:text-gray-100 mt-4">
        <div className="flex flex-col gap-2 mb-2 w-full">
          <div className="flex flex-col gap-1">
            <label htmlFor="mobileRows" className="whitespace-nowrap">
              Rows per page:
            </label>
            <select
              id="mobileRows"
              value={rows}
              onChange={(e) => onPageChange(0, Number(e.target.value))}
              className="px-2 py-1 rounded dark:bg-gray-800 bg-gray-100 dark:text-white text-gray-800 w-full border"
              disabled={loading}
            >
              {rowsPerPageOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="text-black dark:text-white font-medium">
            Page {Math.floor(page / rows) + 1} of {Math.ceil(totalRecords / rows)}
          </div>
        </div>

        <div className="flex flex-wrap justify-between gap-2 w-full">
          <button
            onClick={() => onPageChange(0, rows)}
            disabled={page === 0 || loading}
            className="flex-1 px-2 py-1 text-xs rounded-md font-medium bg-gray-100 dark:bg-gray-800 text-black dark:text-white disabled:opacity-40"
          >
            ⏮ First
          </button>
          <button
            onClick={() => onPageChange(Math.max(0, page - rows), rows)}
            disabled={page === 0 || loading}
            className="flex-1 px-2 py-1 text-xs rounded-md font-medium bg-gray-100 dark:bg-gray-800 text-black dark:text-white disabled:opacity-40"
          >
            Prev
          </button>
          <button
            onClick={() => onPageChange(page + rows, rows)}
            disabled={page + rows >= totalRecords || loading}
            className="flex-1 px-2 py-1 text-xs rounded-md font-medium bg-gray-100 dark:bg-gray-800 text-black dark:text-white disabled:opacity-40"
          >
            Next
          </button>
          <button
            onClick={() => onPageChange((Math.ceil(totalRecords / rows) - 1) * rows, rows)}
            disabled={page + rows >= totalRecords || loading}
            className="flex-1 px-2 py-1 text-xs rounded-md font-medium bg-gray-100 dark:bg-gray-800 text-black dark:text-white disabled:opacity-40"
          >
            ⏭ Last
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center dark:text-gray-100">
      <Paginator
        first={page}
        rows={rows}
        totalRecords={totalRecords}
        onPageChange={(e) => onPageChange(e.first, e.rows)}
        template="RowsPerPageDropdown CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
        currentPageReportTemplate={`Showing {first} to {last} of {totalRecords} items`}
        rowsPerPageOptions={rowsPerPageOptions}
        className="w-full text-sm dark:text-white"
      />
    </div>
  );
};

// ==================== HELPER FUNCTIONS ====================
const renderTableCell = (item: any, column: TableColumn, config: TableConfig) => {
  if (column.customBody) {
    return column.customBody(item);
  }

  switch (column.type) {
    case "tag":
      const value = item[column.field];
      const allowedSeverities = ["success", "info", "warning", "danger", "secondary", "contrast"] as const;
      const severityValue = column.tagSeverity ? column.tagSeverity(value) : undefined;
      const severity = allowedSeverities.includes(severityValue as any) ? severityValue as typeof allowedSeverities[number] : undefined;
      const className = config.statusColors?.[value] || "";
      return <Tag value={value} severity={severity} className={className} />;
    case "progress":
      return <ProgressBar value={item[column.field]} showValue className="h-2 rounded-md" />;
    default:
      return item[column.field] || "-";
  }
};

const renderMobileField = (item: any, field: string, config: TableConfig) => {
  const column = config.columns.find(col => col.field === field);
  if (!column) return item[field] || "-";

  if (column.type === "tag") {
    const value = item[field];
    const className = config.statusColors?.[value] || "";
    return <span className={className}>{value}</span>;
  }

  return item[field] || "-";
};