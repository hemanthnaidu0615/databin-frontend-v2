import moment from "moment";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { useState, useRef } from "react";
import {authFetch} from "../../../axios";
import { Toast } from "primereact/toast";
import { Calendar } from "primereact/calendar";
import { InputTextarea } from 'primereact/inputtextarea';

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

      // Convert the selected time to UTC before sending it to the backend
      const formattedSchedulerStartDate = moment(schedulerData.schedulerStartDate).utc().format("YYYY-MM-DD HH:mm:ss");
      const formattedSchedulerEndDate = schedulerEndDate
              ? moment.utc(schedulerEndDate).format("YYYY-MM-DD HH:mm:ss")
              : null;

      if (!title || !schedulerStartDate || !schedulerEndDate || !recurrencePattern || !email || !query) {
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
        bcc,
        email: email,
        recurrencePattern,
        schedulerStartDate: formattedSchedulerStartDate,
        schedulerEndDate: formattedSchedulerEndDate,
        query,
      };

      try {
        const response = await authFetch("/tables/schedule-task-v2", {
          method: "POST",
          data: payload,
          headers: {
            "Content-Type": "application/json",
          },
        });
      
        if (response.status !== 200) {
          throw new Error(`HTTP error! Status: ${response.status}, Message: ${response.statusText}`);
        }
      
        toast.current?.show({
          severity: "success",
          summary: "Success",
          detail: "Scheduler saved successfully!",
          life: 3000,
        });
      
      } catch (error: any) {  // Type the error as 'any' (or more specific type if needed)
        console.error("Error saving scheduler data:", error);
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: error?.message || "An error occurred.",  // Use optional chaining in case 'error' is not an object with a 'message' property
          life: 3000,
        });
      }
      

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

      toast.current?.show({
        severity: "success",
        summary: "Success",
        detail: "Scheduler saved successfully!",
        life: 3000,
      });
    } catch (error) {
      console.error("Error saving scheduler data:", error);
    }
  };

  const handleValidateQuery = async () => {
    try {
      const response = await authFetch.post("/tables/validate-query", {
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
      <h1 style={{fontSize:'1.5rem'}}>Create Scheduler with Query</h1>

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
            onChange={(e) => setSchedulerData({ ...schedulerData, title: e.target.value })}
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
            onChange={(e) => setSchedulerData({ ...schedulerData, description: e.target.value })}
          />
        </div>

        <div className="p-field">
          <label className="text-base font-semibold" htmlFor="schedulerStartDate">
            Scheduler Start Date<span className="text-red-500">*</span>
          </label>
          <Calendar
            id="schedulerStartDate"
            value={schedulerData.schedulerStartDate}
            minDate={new Date()}
            placeholder="Select scheduler start date"
            onChange={(e) =>
              setSchedulerData({ ...schedulerData, schedulerStartDate: e.value || null })
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
    minDate={schedulerData.schedulerStartDate || new Date()} // End date can't be before start date
    placeholder="Select scheduler end date"
    onChange={(e) => setSchedulerData({ ...schedulerData, schedulerEndDate: e.value || null })}
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
            value={schedulerData.email.join(",")} // join array to display as string
            placeholder="Enter Email Addresses separated by commas"
            onChange={(e) => {
              const emailsArray = e.target.value.split(',').map(email => email.trim());
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
            value={schedulerData.bcc.join(",")}  // same handling as email
            placeholder="Enter BCC Email Addresses separated by commas"
            onChange={(e) => {
              const bccArray = e.target.value.split(',').map(bcc => bcc.trim());
              setSchedulerData({ ...schedulerData, bcc: bccArray });
            }}
          />
        </div>

        {/* Recurrence Pattern Field */}
<div className="p-field">
  <label className="text-base font-semibold" htmlFor="recurrencePattern">
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
    onChange={(e) => setSchedulerData({
      ...schedulerData,
      recurrencePattern: e.value,
    })}
  />
</div>


        {/* Query Field */}
        {/* <div className="p-field">
          <label className="text-base font-semibold" htmlFor="query">
            Query<span className="text-red-500">*</span>
          </label>
          <InputTextarea
            id="query"
            value={schedulerData.query}
            placeholder="Enter SQL query"
            rows={5} 
            onChange={(e) => setSchedulerData({ ...schedulerData, query: e.target.value })}
          />
        </div>

        <div className="flex justify-start">
          <Button
            label="Validate SQL Query"
            icon="pi pi-check"
            onClick={handleValidateQuery}
            className="button bg-purple-500 border-none"
          />
        </div> */}

<div className="p-field">
          <label className="text-base font-semibold" htmlFor="query">
            Query<span className="text-red-500">*</span>
          </label>
          <InputTextarea
            id="query"
            value={schedulerData.query}
            placeholder="Enter SQL query"
            rows={5}
            onChange={(e) => setSchedulerData({ ...schedulerData, query: e.target.value })}
          />
        </div>

        {/* Validate Query Button positioned to the right */}
        <div className="flex justify-end mb-3">
          <Button
            label="Validate"
            icon="pi pi-check"
            onClick={handleValidateQuery}
            className="validate-button p-button-sm bg-purple-500 border-none" // Small button style
            style={{ width: 'auto', height: '30px', marginTop:'1rem' }} // Custom size
          />
        </div>

        {/* Save Button */}
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
