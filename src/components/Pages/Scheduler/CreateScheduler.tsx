import moment from "moment";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { MultiSelect } from "primereact/multiselect";
import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { authFetch } from "../../../axios";
import { Toast } from "primereact/toast";
import { Calendar } from "primereact/calendar";
import "./style.css";

interface SchedulerData {
  schedulerStartDate: Date | null;
  schedulerEndDate: Date | null;
  recurrencePattern: string;
  email: string[];
  bcc: string[];
  title: string;
  description: string;
  tableSelection: string;
  columnSelection: string[];
  timeFrame: string;
}

export const CreateScheduler = () => {
  const [tables, setTables] = useState<{ label: string; value: string }[]>([]);
  const [data, setData] = useState<any[]>([]);
  const toast = useRef<Toast>(null);
  const { dates } = useSelector((store: any) => store.dateRange);

  const [schedulerData, setSchedulerData] = useState<SchedulerData>({
    title: "",
    description: "",
    bcc: [],
    schedulerStartDate: null,
    schedulerEndDate: null,
    recurrencePattern: "",
    email: [],
    tableSelection: "",
    columnSelection: [],
    timeFrame: "",
  });

  const fetchTableNames = async () => {
    try {
      const response = await authFetch(
        "http://localhost:8080/api/table-column-fetch/tables"
      );
      const tableOptions = response.data.tables.map((table: string) => ({
        label: formatHeaderKey(table),
        value: table,
      }));
      setTables(tableOptions);
      console.log("Table options:", tableOptions);
    } catch (error) {
      console.error("Error fetching table names:", error);
    }
  };

  const fetchColumns = async (tableName: string) => {
    try {
      const response = await authFetch(
        `http://localhost:8080/api/table-column-fetch/columns?tableName=${tableName}`
      );
      const columnOptions = response.data.columns.map((col: string) => ({
        field: col,
        header: formatHeaderKey(col),
      }));
      setData([
        Object.fromEntries(columnOptions.map((col) => [col.field, ""])),
      ]);
    } catch (error) {
      console.error("Error fetching columns:", error);
    }
  };

  const getTableColumns = (rows: any[]) => {
    if (!rows.length) return [];
    return Object.keys(rows[0]).map((field) => ({
      field,
      header: formatHeaderKey(field),
    }));
  };

  const formatHeaderKey = (key: string) => {
    return key
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const handleSaveScheduler = async () => {
    try {
      const {
        title,
        description,
        bcc,
        tableSelection,
        columnSelection,
        schedulerStartDate,
        schedulerEndDate,
        recurrencePattern,
        email,
        timeFrame,
      } = schedulerData;

      const formattedSchedulerStartDate = moment
        .utc(schedulerStartDate)
        .format("YYYY-MM-DD[T]HH:mm:ss"); // Updated format with T separator

      const formattedSchedulerEndDate = schedulerEndDate
        ? moment.utc(schedulerEndDate).format("YYYY-MM-DD[T]HH:mm:ss") // Updated format with T separator
        : null;

      if (
        !title ||
        !schedulerStartDate ||
        !schedulerEndDate ||
        !recurrencePattern ||
        !email.length ||
        !columnSelection.length ||
        !timeFrame
      ) {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "Please fill all required fields.",
          life: 3000,
        });
        return;
      }

      const payload = {
        title,
        description,
        bcc: bcc.join(","), // join into a comma-separated string
        email: email[0], // or join if you allow more than one
        recurrencePattern,
        startDate: formattedSchedulerStartDate,
        endDate: formattedSchedulerEndDate,
        tableName: tableSelection,
        columns: columnSelection,
        dateRangeType: timeFrame,
      };

      const response = await authFetch(
        "http://localhost:8080/api/schedulers/create-table-scheduler",
        {
          method: "POST",
          data: payload,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status !== 200) {
        throw new Error(
          `HTTP error! Status: ${response.status}, Message: ${response.statusText}`
        );
      }

      setSchedulerData({
        title: "",
        description: "",
        bcc: [],
        schedulerStartDate: null,
        schedulerEndDate: null,
        recurrencePattern: "",
        email: [],
        tableSelection: "",
        columnSelection: [],
        timeFrame: "",
      });

      toast.current?.show({
        severity: "success",
        summary: "Success",
        detail: "Scheduler saved successfully!",
        life: 3000,
      });
    } catch (error: any) {
      console.error("Error saving scheduler data:", error);

      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Status:", error.response.status);
        console.error("Headers:", error.response.headers);
      } else if (error.request) {
        console.error("No response received:", error.request);
      } else {
        console.error("Request setup error:", error.message);
      }
      console.error("Response data:", error.response?.data);
      console.error("Status:", error.response?.status);

      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to save scheduler. See console for details.",
        life: 4000,
      });
    }
  };

  useEffect(() => {
    fetchTableNames();
  }, []);

  function getTimeFrames(
    recurrencePattern: string
  ): { label: string; value: string }[] {
    const timeFrames: Record<string, { label: string; value: string }[]> = {
      daily: [
        { label: "Today", value: "Today" },
        { label: "Past Week Data", value: "Past Week" },
        { label: "Past Month Data", value: "Past Month" },
        { label: "Past 3 Months Data", value: "Past 3 Months" },
        { label: "Past 6 Months Data", value: "Past 6 Months" },
        { label: "Past Year Data", value: "Past Year" },
      ],
      weekly: [
        { label: "Past Week Data", value: "Past Week" },
        { label: "Past Month Data", value: "Past Month" },
        { label: "Past 3 Months Data", value: "Past 3 Months" },
        { label: "Past 6 Months Data", value: "Past 6 Months" },
        { label: "Past Year Data", value: "Past Year" },
      ],
      monthly: [
        { label: "Past Month Data", value: "Past Month" },
        { label: "Past 3 Months Data", value: "Past 3 Months" },
        { label: "Past 6 Months Data", value: "Past 6 Months" },
        { label: "Past Year Data", value: "Past Year" },
        { label: "Past 2 Years Data", value: "Past 2 Years" },
        { label: "Past 5 Years Data", value: "Past 5 Years" },
        { label: "Past 10 Years Data", value: "Past 10 Years" },
      ],
      yearly: [
        { label: "Past Year Data", value: "Past Year" },
        { label: "Past 2 Years Data", value: "Past 2 Years" },
        { label: "Past 5 Years Data", value: "Past 5 Years" },
        { label: "Past 10 Years Data", value: "Past 10 Years" },
      ],
    };
    return timeFrames[recurrencePattern] || [];
  }

  return (
    <div className="create-scheduler-page">
      <Toast ref={toast} className="custom-toast" />
      <h1 style={{ fontSize: "1.5rem" }}>Create Scheduler</h1>

      <div className="p-fluid">
        <div className="p-field">
          <label className="text-base font-semibold" htmlFor="title">
            Title<span className="text-red-500">*</span>
          </label>
          <InputText
            id="title"
            value={schedulerData.title}
            placeholder="Enter scheduler title"
            onChange={(e) =>
              setSchedulerData({ ...schedulerData, title: e.target.value })
            }
          />
        </div>

        <div className="p-field">
          <label className="text-base font-semibold" htmlFor="description">
            Description<span className="text-red-500">*</span>
          </label>
          <InputText
            id="description"
            value={schedulerData.description}
            placeholder="Enter description"
            onChange={(e) =>
              setSchedulerData({
                ...schedulerData,
                description: e.target.value,
              })
            }
          />
        </div>

        <div className="p-field">
          <label
            className="text-base font-semibold"
            htmlFor="schedulerStartDate"
          >
            Scheduler Start Date<span className="text-red-500">*</span>
          </label>
          <Calendar
            id="schedulerStartDate"
            value={schedulerData.schedulerStartDate}
            minDate={new Date()}
            placeholder="Select scheduler start date"
            onChange={(e) =>
              setSchedulerData({
                ...schedulerData,
                schedulerStartDate: e.value || null,
              })
            }
            showTime
          />
        </div>

        <div className="p-field">
          <label className="text-base font-semibold" htmlFor="schedulerEndDate">
            Scheduler End Date<span className="text-red-500">*</span>
          </label>
          <Calendar
            id="schedulerEndDate"
            value={schedulerData.schedulerEndDate}
            minDate={schedulerData.schedulerStartDate || new Date()}
            placeholder="Select scheduler end date"
            onChange={(e) =>
              setSchedulerData({
                ...schedulerData,
                schedulerEndDate: e.value || null,
              })
            }
            showTime
          />
        </div>

        <div className="p-field">
          <label className="text-base font-semibold" htmlFor="emailAddress">
            Email Address<span className="text-red-500">*</span>
          </label>
          <InputText
            id="emailAddress"
            value={schedulerData.email.join(",")}
            placeholder="Enter Email Addresses separated by commas"
            onChange={(e) =>
              setSchedulerData({
                ...schedulerData,
                email: e.target.value.split(",").map((email) => email.trim()),
              })
            }
          />
        </div>

        <div className="p-field">
          <label className="text-base font-semibold" htmlFor="bcc">
            BCC<span className="text-base font-light">(Optional)</span>
          </label>
          <InputText
            id="bcc"
            value={schedulerData.bcc.join(",")}
            placeholder="Enter BCC Email Addresses separated by commas"
            onChange={(e) =>
              setSchedulerData({
                ...schedulerData,
                bcc: e.target.value.split(",").map((bcc) => bcc.trim()),
              })
            }
          />
        </div>

        <div className="p-field">
          <label
            className="text-base font-semibold"
            htmlFor="recurrencePattern"
          >
            Email Recurrence Pattern<span className="text-red-500">*</span>
          </label>
          <Dropdown
            id="recurrencePattern"
            value={schedulerData.recurrencePattern}
            placeholder="Select recurrence pattern"
            options={[
              { label: "Get emails Daily", value: "daily" },
              { label: "Get emails Weekly", value: "weekly" },
              { label: "Get emails Monthly", value: "monthly" },
              { label: "Get emails Yearly", value: "yearly" },
            ]}
            onChange={(e) =>
              setSchedulerData({
                ...schedulerData,
                recurrencePattern: e.value,
                timeFrame: getTimeFrames(e.value)[0]?.value || "",
              })
            }
          />
        </div>

        <div className="p-field">
          <label className="text-base font-semibold" htmlFor="tableSelection">
            Table Selection<span className="text-red-500">*</span>
          </label>
          <Dropdown
            id="tableSelection"
            value={schedulerData.tableSelection}
            placeholder="Select Table"
            options={tables}
            onChange={(e) => {
              setSchedulerData({
                ...schedulerData,
                tableSelection: e.value,
                columnSelection: [],
              });
              fetchColumns(e.value);
            }}
          />
        </div>

        <div className="p-field">
          <label className="text-base font-semibold" htmlFor="columnSelection">
            Column Selection<span className="text-red-500">*</span>
          </label>
          <MultiSelect
            id="columnSelection"
            value={schedulerData.columnSelection}
            options={getTableColumns(data).slice(1)}
            optionLabel="header"
            optionValue="field"
            display="chip"
            placeholder="Select Columns"
            selectAll
            selectAllLabel={
              schedulerData.columnSelection.length ===
              getTableColumns(data).slice(1).length
                ? "Deselect All"
                : "Select All"
            }
            onChange={(e) =>
              setSchedulerData({ ...schedulerData, columnSelection: e.value })
            }
          />
        </div>

        <div className="p-field">
          <label className="text-base font-semibold" htmlFor="timeFrame">
            Data Range<span className="text-red-500">*</span>
          </label>
          <Dropdown
            id="timeFrame"
            value={schedulerData.timeFrame}
            placeholder="Select data range"
            options={getTimeFrames(schedulerData.recurrencePattern)}
            onChange={(e) =>
              setSchedulerData({ ...schedulerData, timeFrame: e.value })
            }
          />
        </div>

        <div className="flex justify-end">
          <Button
            label="Save Scheduler"
            icon="pi pi-check"
            onClick={handleSaveScheduler}
            className="button w-auto ml-auto mr-auto bg-purple-500 border-none"
          />
        </div>
      </div>
    </div>
  );
};

export default CreateScheduler;
