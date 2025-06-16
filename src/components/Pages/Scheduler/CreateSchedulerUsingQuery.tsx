import moment from "moment";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useState, useRef } from "react";
import { axiosInstance } from "../../../axios";
import { Toast } from "primereact/toast";
import { Calendar } from "primereact/calendar";
import { InputTextarea } from "primereact/inputtextarea";
import CommonButton from "../../modularity/buttons/Button";
import { PrimeSelectFilter } from "../../modularity/dropdowns/Dropdown";

interface SchedulerData {
  schedulerStartDate: Date | null;
  schedulerEndDate: Date | null;
  recurrencePattern: RecurrencePattern;
  email: string[];
  bcc: string[];
  title: string;
  description: string;
  query: string;
}

type RecurrencePattern = "daily" | "weekly" | "monthly";
const recurrenceOptions: { label: string; value: RecurrencePattern }[] = [
  { label: "Get emails Daily", value: "daily" },
  { label: "Get emails Weekly", value: "weekly" },
  { label: "Get emails Monthly", value: "monthly" },
];

export const CreateSchedulerUsingQuery = () => {
  const toast = useRef<Toast>(null);

  const [schedulerData, setSchedulerData] = useState<SchedulerData>({
    title: "",
    description: "",
    bcc: [],
    schedulerStartDate: null,
    schedulerEndDate: null,
    recurrencePattern: "daily",
    email: [],
    query: "",
  });

  const handleSaveScheduler = async () => {
    try {
      const {
        title,
        description,
        bcc,
        schedulerStartDate,
        schedulerEndDate,
        recurrencePattern,
        email,
        query,
      } = schedulerData;

      const formattedStartDate = moment(schedulerStartDate).format(
        "YYYY-MM-DDTHH:mm:ss"
      );
      const formattedEndDate = schedulerEndDate
        ? moment(schedulerEndDate).format("YYYY-MM-DDTHH:mm:ss")
        : null;

      if (
        !title ||
        !schedulerStartDate ||
        !schedulerEndDate ||
        !recurrencePattern ||
        email.length === 0 ||
        !query
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
        bcc: bcc.join(","),
        email: email.join(","),
        recurrencePattern,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        customQuery: query,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      };

      const response = await axiosInstance.post(
        "/schedulers/create-query-scheduler",
        payload
      );

      if (response.status !== 200) {
        throw new Error(
          `HTTP error! Status: ${response.status}, Message: ${response.statusText}`
        );
      }

      toast.current?.show({
        severity: "success",
        summary: "Success",
        detail: "Scheduler saved successfully!",
        life: 3000,
      });

      setSchedulerData({
        title: "",
        description: "",
        bcc: [],
        schedulerStartDate: null,
        schedulerEndDate: null,
        recurrencePattern: "daily",
        email: [],
        query: "",
      });
    } catch (error: any) {
      console.error("Error saving scheduler data:", error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: error?.message || "An error occurred.",
        life: 3000,
      });
    }
  };

  const handleValidateQuery = async () => {
    try {
      const response = await axiosInstance.post("/schedulers/validate-query", {
        query: schedulerData.query,
      });

      if (response.data === "Query is valid") {
        toast.current?.show({
          severity: "success",
          summary: "Success",
          detail: "SQL query is valid.",
          life: 3000,
        });
      } else {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "Invalid SQL query.",
          life: 3000,
        });
      }
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to validate SQL query.",
        life: 3000,
      });
    }
  };

  return (
    <div className="create-scheduler-page">
      <Toast ref={toast} className="custom-toast" />
      <h1 className="app-subheading">Create Scheduler with Query</h1>

      <div className="p-fluid">
        {/* Title Field */}
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

        {/* Description Field */}
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

        {/* Start Date */}
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

        {/* End Date */}
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

        {/* Email Field */}
        <div className="p-field">
          <label className="text-base font-semibold" htmlFor="emailAddress">
            Email Address<span className="text-red-500">*</span>
          </label>
          <InputText
            id="emailAddress"
            value={schedulerData.email.join(",")}
            placeholder="Enter Email Addresses separated by commas"
            onChange={(e) => {
              const emailsArray = e.target.value
                .split(",")
                .map((email) => email.trim());
              setSchedulerData({ ...schedulerData, email: emailsArray });
            }}
          />
        </div>

        {/* BCC Field */}
        <div className="p-field">
          <label className="text-base font-semibold" htmlFor="bcc">
            BCC<span className="text-base font-light">(Optional)</span>
          </label>
          <InputText
            id="bcc"
            value={schedulerData.bcc.join(",")}
            placeholder="Enter BCC Email Addresses separated by commas"
            onChange={(e) => {
              const bccArray = e.target.value
                .split(",")
                .map((bcc) => bcc.trim());
              setSchedulerData({ ...schedulerData, bcc: bccArray });
            }}
          />
        </div>

        {/* Recurrence Pattern */}
        <div className="p-field">
          <label
            className="text-base font-semibold"
            htmlFor="recurrencePattern"
          >
            Email Recurrence Pattern<span className="text-red-500">*</span>
          </label>
          <PrimeSelectFilter<RecurrencePattern>
            value={schedulerData.recurrencePattern}
            options={recurrenceOptions}
            onChange={(value) =>
              setSchedulerData({
                ...schedulerData,
                recurrencePattern: value,
              })
            }
            placeholder="Select recurrence pattern"
          />
        </div>

        {/* SQL Query */}
        <div className="p-field">
          <label className="text-base font-semibold" htmlFor="query">
            Query<span className="text-red-500">*</span>
          </label>
          <small className="block mt-2 text-sm text-gray-500">
            Example:{" "}
            <code>
              SELECT * FROM orders WHERE order_date BETWEEN '2025-04-05
              00:00:00' AND '2025-04-15 23:59:59';
            </code>
          </small>
          <InputTextarea
            id="query"
            value={schedulerData.query}
            placeholder="Enter SQL query"
            rows={5}
            onChange={(e) =>
              setSchedulerData({ ...schedulerData, query: e.target.value })
            }
          />
        </div>

        {/* Validate Query Button */}
        <div className="flex justify-end mb-3">
          <Button
            label="Validate"
            icon="pi pi-check"
            onClick={handleValidateQuery}
            className="validate-button p-button-sm bg-purple-500 border-none"
            style={{
              width: "auto",
              height: "30px",
              marginTop: "1rem",
              background: "#a855f7",
              border: "none",
              color: "white",
              transition: "none",
            }}
          />
        </div>

        {/* Save Scheduler Button */}
        <div className="flex justify-end">
          <CommonButton variant="action" text="Save Scheduler" onClick={handleSaveScheduler} />
        </div>
      </div>
    </div>
  );
};

export default CreateSchedulerUsingQuery;
