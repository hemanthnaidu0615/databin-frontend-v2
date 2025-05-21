import React, { useEffect, useState, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { FilterMatchMode } from "primereact/api";
import { axiosInstance } from "../../../axios";
import moment from "moment";
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
      <Toast ref={toast} />
      <div className="vw-scheduler-content">
        <div className="vw-scheduler-table-container">
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
    </div>
  );
};

export default ViewScheduler;
