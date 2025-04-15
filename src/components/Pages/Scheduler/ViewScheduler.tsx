import React, { useEffect, useState, useRef } from "react";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { FilterMatchMode } from 'primereact/api';
import{ authFetch} from "../../../axios";
import moment from "moment";
import './style.css';

interface Scheduler {
  id: number;
  title: string;
  description: string;
  email: string;
  bcc: string;
  scheduler_start_date: string;
  recurrence_pattern: string;
  table_selection: string;
  column_selection: { field: string; header: string }[];
  time_frame: string;
  created_at: string;
}

const ViewScheduler: React.FC = () => {
  const [schedulers, setSchedulers] = useState<Scheduler[]>([]);
  const [selectedScheduler, setSelectedScheduler] = useState<Scheduler | null>(null);
  const [visible, setVisible] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const toast = useRef<Toast>(null);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [filters, setFilters] = useState<{
    global: { value: string | null; matchMode: FilterMatchMode };
    title: { value: string | null; matchMode: FilterMatchMode };
    description: { value: string | null; matchMode: FilterMatchMode };
  }>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    title: { value: null, matchMode: FilterMatchMode.CONTAINS },
    description: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [schedulerToDelete, setSchedulerToDelete] = useState<number | null>(null);  

  useEffect(() => {
    fetchSchedulers();
  }, []);

  const fetchSchedulers = async () => {
    try {
      const response = await authFetch("/tables/schedulers");
      setSchedulers(response.data);
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

  const handleUpdate = async () => {
    if (selectedScheduler) {
      try {
        const payload = {
          ...selectedScheduler,
          scheduler_start_date: moment(selectedScheduler.scheduler_start_date).utc().format("YYYY-MM-DDTHH:mm:ss.SSSZ")
        };

        const response = await authFetch(`/tables/schedulers/${selectedScheduler.id}`, {
          method: "PUT",
          data: JSON.stringify(payload),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.status === 200) {
          toast.current?.show({
            severity: "success",
            summary: "Success",
            detail: "Scheduler updated successfully!",
            life: 3000,
          });

          setVisible(false);
          fetchSchedulers();
        }
      } catch (error) {
        console.error("Error updating scheduler:", error);
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "Error updating scheduler data",
          life: 3000,
        });
      }
    }
  };

  const handleDeleteClick = (id: number) => {
    setSchedulerToDelete(id);
    setDeleteDialogVisible(true);  // Show confirmation dialog
  };
  
  const confirmDelete = async () => {
    if (schedulerToDelete) {
      try {
        const response = await authFetch(`/tables/schedulers/${schedulerToDelete}`, {
          method: "DELETE",
        });
  
        if (response.status === 200) {
          toast.current?.show({
            severity: "success",
            summary: "Success",
            detail: "Scheduler deleted successfully!",
            life: 3000,
          });
  
          fetchSchedulers();
        }
      } catch (error) {
        console.error("Error deleting scheduler:", error);
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "Error deleting scheduler data",
          life: 3000,
        });
      } finally {
        setDeleteDialogVisible(false);  // Hide the confirmation dialog
      }
    }
  };

  const renderDialogFooter = () => (
    <div className="vw-scheduler-dialog-footer">
      <Button label="Cancel" icon="pi pi-times" onClick={() => setVisible(false)} className="p-button-text" />
      <Button label="Save Changes" icon="pi pi-check" onClick={handleUpdate} className="p-button-success" />
    </div>
  );

  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    let _filters = { ...filters };
    _filters['global'].value = value;
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
          globalFilterFields={['title', 'description']}
          className="vw-scheduler-table"
          selectionMode="single"
          onRowSelect={(e) => setSelectedScheduler(e.data)}
        >
          
          <Column field="title" header="Title" style={{ width: "200px" }} />
          <Column field="description" header="Description" style={{ width: "300px" }} />
          <Column field="email" header="Email" style={{ width: "200px" }} />
          <Column field="recurrence_pattern" header="Recurrence" style={{ width: "200px" }} />
          <Column
            field="scheduler_start_date"
            header="Start Date"
            body={(rowData) => moment(rowData.scheduler_start_date).format("YYYY-MM-DD HH:mm")}
            style={{ width: "200px" }}
          />
          <Column field="time_frame" header="Time Frame" style={{ width: "150px" }} />
          <Column
            body={(rowData) => (
              <div className="vw-scheduler-action-buttons">
                {/* <Button
                  icon="pi pi-pencil"
                  rounded
                  severity="info"
                  onClick={() => { setSelectedScheduler(rowData); setVisible(true); }}
                /> */}
                <Button
                  icon="pi pi-trash"
                  rounded
                  severity="danger"
                  onClick={() => handleDeleteClick(rowData.id)}
                />
              </div>
            )}
            header="Actions"
            style={{ width: "100px" }}
          />
        </DataTable>
      </div>
    </div>

    <Dialog
  header="Confirm Deletion"
  visible={deleteDialogVisible}
  style={{ width: "30vw" }}
  onHide={() => setDeleteDialogVisible(false)}
  footer={
    <div className="p-d-flex p-jc-end">
      <Button 
        label="No" 
        icon="pi pi-times" 
        onClick={() => setDeleteDialogVisible(false)} 
        className="p-button-text p-mr-2" 
      />
      <Button 
        label="Yes" 
        icon="pi pi-check" 
        severity="danger" 
        onClick={confirmDelete} 
        autoFocus 
        className="p-button-danger"
      />
    </div>
  }
  closable={false}  // Optional: Prevent closing the dialog by clicking outside
>
  <div className="p-d-flex p-flex-column p-ai-center">
    <i className="pi pi-exclamation-triangle p-mb-3" style={{ fontSize: '3rem', color: '#ff6a00' }} />
    <p style={{ fontSize: '1.1rem', textAlign: 'center' }}>Are you sure you want to delete this scheduler?</p>
  </div>
</Dialog>

      <Dialog
        header="Edit Scheduler"
        visible={visible}
        style={{ width: "50vw" }}
        footer={renderDialogFooter()}
        onHide={() => setVisible(false)}
      >
        {selectedScheduler && (
          <div className="vw-scheduler-dialog-grid">
            <div className="vw-scheduler-form-field">
              <label htmlFor="title">Title</label>
              <InputText
                id="title"
                value={selectedScheduler.title}
                onChange={(e) => setSelectedScheduler({ ...selectedScheduler, title: e.target.value })}
              />
            </div>
            <div className="vw-scheduler-form-field">
              <label htmlFor="description">Description</label>
              <InputText
                id="description"
                value={selectedScheduler.description}
                onChange={(e) => setSelectedScheduler({ ...selectedScheduler, description: e.target.value })}
              />
            </div>
            <div className="vw-scheduler-form-field">
              <label htmlFor="startDate">Start Date</label>
              <InputText
                id="startDate"
                type="datetime-local"
                value={moment(selectedScheduler.scheduler_start_date).local().format("YYYY-MM-DDTHH:mm")}
                onChange={(e) => setSelectedScheduler({ 
                  ...selectedScheduler, 
                  scheduler_start_date: moment(e.target.value).utc().toISOString() 
                })}
              />
            </div>
            <div className="vw-scheduler-form-field">
              <label htmlFor="email">Email Address</label>
              <InputText
                id="email"
                value={selectedScheduler.email}
                onChange={(e) => setSelectedScheduler({ ...selectedScheduler, email: e.target.value })}
              />
            </div>
            <div className="vw-scheduler-form-field">
              <label htmlFor="recurrencePattern">Recurrence Pattern</label>
              <Dropdown
                id="recurrencePattern"
                value={selectedScheduler.recurrence_pattern}
                options={[
                  { label: "Daily", value: "daily" },
                  { label: "Weekly", value: "weekly" },
                  { label: "Monthly", value: "monthly" },
                  { label: "Yearly", value: "yearly" },
                ]}
                onChange={(e) => setSelectedScheduler({ ...selectedScheduler, recurrence_pattern: e.value })}
              />
            </div>
            <div className="vw-scheduler-form-field">
              <label htmlFor="timeFrame">Time Frame</label>
              <Dropdown
                id="timeFrame"
                value={selectedScheduler.time_frame}
                options={[
                  { label: "Today", value: "Today" },
                  { label: "Past Week", value: "Past Week" },
                  { label: "Next Week", value: "Next Week" },
                ]}
                onChange={(e) => setSelectedScheduler({ ...selectedScheduler, time_frame: e.value })}
              />
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
};

export default ViewScheduler;