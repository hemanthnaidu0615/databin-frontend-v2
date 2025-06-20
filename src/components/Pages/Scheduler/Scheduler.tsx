import { useState } from "react";
import CreateScheduler from "./CreateScheduler";
import CreateSchedulerUsingQuery from "./CreateSchedulerUsingQuery";
import ViewScheduler from "./ViewScheduler";
import { Card } from "primereact/card";
import "./style.css";
import CommonButton from "../../modularity/buttons/Button";


const Scheduler = () => {
  const [activePage, setActivePage] = useState<"create" | "view">("create");

  return (
    <div className="schedulerContainer">
            <h1 className="app-section-title mb-4">
        Reports and Scheduler
      </h1>
      <div className="w-full px-4 py-4 flex flex-col md:flex-row items-center gap-4 rounded-xl">
        <CommonButton
          variant="tab"
          text="Create Scheduler"
          icon={<i className="pi pi-calendar-plus" />}
          active={activePage === "create"}
          onClick={() => setActivePage("create")}
        />

        <CommonButton
          variant="tab"
          text="View Scheduler"
          icon={<i className="pi pi-calendar" />}
          active={activePage === "view"}
          onClick={() => setActivePage("view")}
        />

      </div>

      {/* Main Content */}
      <div className="schedulerContent mt-6">
        {activePage === "create" ? (
          <div className="schedulerSplitScreen flex flex-col lg:flex-row gap-6">
            <Card className="schedulerPanel left-panel w-full lg:w-1/2">
              <CreateScheduler />
            </Card>
            <Card className="schedulerPanel right-panel w-full lg:w-1/2">
              <CreateSchedulerUsingQuery />
            </Card>
          </div>
        ) : (
          <Card className="view-scheduler mt-4">
            <ViewScheduler />
          </Card>
        )}
      </div>
    </div>
  );
};

export default Scheduler;
