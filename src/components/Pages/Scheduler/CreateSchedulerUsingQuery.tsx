import moment from "moment";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { useState, useRef } from "react";
import { axiosInstance } from "../../../axios"; // Adjust path as needed
import { Toast } from "primereact/toast";
import { Calendar } from "primereact/calendar";
import { InputTextarea } from "primereact/inputtextarea";

interface SchedulerData {
  schedulerStartDate: Date | null;
  schedulerEndDate: Date | null;
  recurrencePattern: string;
  email: string[];
  bcc: string[];
  title: string;
  description: string;
  query: string;
}

export const CreateSchedulerUsingQuery = () => {
  const toast = useRef<Toast>(null);

  const [schedulerData, setSchedulerData] = useState<SchedulerData>({
    title: "",
    description: "",
    bcc: [],
    schedulerStartDate: null,
    schedulerEndDate: null,
    recurrencePattern: "",
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
        recurrencePattern: "",
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
      const response = await axiosInstance.post("/tables/validate-query", {
        query: schedulerData.query,
      });

      if (response.data.message === "Query is valid") {
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
      <h1 style={{ fontSize: "1.5rem" }}>Create Scheduler with Query</h1>

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
          <Dropdown
            id="recurrencePattern"
            value={schedulerData.recurrencePattern}
            placeholder="Select recurrence pattern"
            options={[
              { label: "Get emails Daily", value: "daily" },
              { label: "Get emails Weekly", value: "weekly" },
              { label: "Get emails Monthly", value: "monthly" },
            ]}
            onChange={(e) =>
              setSchedulerData({
                ...schedulerData,
                recurrencePattern: e.value,
              })
            }
          />
        </div>

        {/* SQL Query */}
        <div className="p-field">
          <label className="text-base font-semibold" htmlFor="query">
            Query<span className="text-red-500">*</span>
          </label>
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
            style={{ width: "auto", height: "30px", marginTop: "1rem" }}
          />
        </div>

        {/* Save Scheduler Button */}
        <div className="flex justify-end">
          <Button
            label="Save Scheduler"
            icon="pi pi-check"
            onClick={handleSaveScheduler}
            className="button button w-auto ml-auto mr-auto bg-purple-500 border-none"
          />
        </div>
      </div>
    </div>
  );
};

export default CreateSchedulerUsingQuery;
