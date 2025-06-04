import React, { useEffect, useState, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { FilterMatchMode } from "primereact/api";
import { axiosInstance } from "../../../axios";
import moment from "moment";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import "./style.css";

interface Scheduler {
  title: string;
  description: string;
  email: string;
  start_date: string;
  recurrence_pattern: string;
  date_range_type: string | null;
}

type FiltersType = {
  [key: string]: {
    value: string | null;
    matchMode: FilterMatchMode;
  };
};

const ViewScheduler: React.FC = () => {
  const [schedulers, setSchedulers] = useState<Scheduler[]>([]);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const toast = useRef<Toast>(null);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [expandedStates, setExpandedStates] = useState<string[]>([]);

  const [filters, setFilters] = useState<FiltersType>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    title: { value: null, matchMode: FilterMatchMode.CONTAINS },
    description: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  useEffect(() => {
    fetchSchedulers();
  }, []);

  const fetchSchedulers = async () => {
    try {
      const response = await axiosInstance.get("/schedulers/view");
      setSchedulers(response.data as Scheduler[]);
    } catch (error) {
      console.error("Error fetching schedulers:", error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Error fetching scheduler data",
        life: 3000,
      });
    }
  };

  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const _filters = { ...filters };
    _filters["global"].value = value;
    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const arrowExpand = (stateName: string) => {
    setExpandedStates((prev) =>
      prev.includes(stateName)
        ? prev.filter((name) => name !== stateName)
        : [...prev, stateName]
    );
  };

  const renderHeader = () => (
    <div className="vw-scheduler-header">
      <div className="vw-scheduler-header-controls">
        <InputText
          value={globalFilterValue}
          onChange={onGlobalFilterChange}
          placeholder="Search by title or description"
          className="vw-scheduler-search-input"
        />
        <Dropdown
          value={rowsPerPage}
          options={[5, 10, 15, 20, 50]}
          onChange={(e) => setRowsPerPage(e.value)}
          placeholder="Rows per page"
          className="vw-scheduler-rows-dropdown"
        />
      </div>
      <h1 className="vw-scheduler-title">View and Manage Schedulers</h1>
    </div>
  );

  return (
    <div className="vw-scheduler-container">
      <h1 className="app-subheading">Scheduled Reports</h1>
      <Toast ref={toast} />
      <div className="vw-scheduler-content">
        {/* Desktop View */}
        <div className="vw-scheduler-table-container hidden lg:block">
          <DataTable
            value={schedulers}
            header={renderHeader()}
            paginator
            rows={rowsPerPage}
            filters={filters}
            filterDisplay="row"
            globalFilterFields={["title", "description"]}
            className="vw-scheduler-table"
          >
            <Column field="title" header="Title" style={{ width: "200px" }} />
            <Column
              field="description"
              header="Description"
              style={{ width: "300px" }}
            />
            <Column field="email" header="Email" style={{ width: "200px" }} />
            <Column
              field="recurrence_pattern"
              header="Recurrence"
              style={{ width: "200px" }}
            />
            <Column
              field="start_date"
              header="Start Date"
              body={(rowData) =>
                moment(rowData.start_date).format("YYYY-MM-DD HH:mm")
              }
              style={{ width: "200px" }}
            />
            <Column
              field="date_range_type"
              header="Time Frame"
              style={{ width: "150px" }}
            />
          </DataTable>
        </div>
      </div>

      {/* Mobile View */}
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
          {schedulers.map((row) => (
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
                        <span className="text-gray-600 dark:text-gray-400">
                          Description
                        </span>
                        <span className="text-right font-medium text-gray-900 dark:text-white break-words max-w-[60%]">
                          {row.description}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">
                          Email
                        </span>
                        <span className="text-right font-medium text-gray-900 dark:text-white break-all max-w-[60%]">
                          {row.email}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">
                          Recurrence
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {row.recurrence_pattern}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">
                          Start Date
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {moment(row.start_date).format("YYYY-MM-DD HH:mm")}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">
                          Time Frame
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {row.date_range_type}
                        </span>
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
  );
};

export default ViewScheduler;
