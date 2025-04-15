import { useState } from "react";
import { Button } from "primereact/button";
import CreateScheduler from "./CreateScheduler";
import CreateSchedulerUsingQuery from "./CreateSchedulerUsingQuery";
import ViewScheduler from "./ViewScheduler";
import { Card } from "primereact/card"; // Import Card for panel layout
import "./style.css"; // Keep this for minimal custom active button color only

const Scheduler = () => {
  const [activePage, setActivePage] = useState<"create" | "view">("create");

  return (
    <div className="schedulerContainer">
      {/* Header with PrimeReact Buttons */}
      <div className="schedulerHeader">
        <Button
          label="Create Scheduler"
          icon="pi pi-calendar-plus"
          onClick={() => setActivePage("create")}
          className={`schedulerHeaderButton ${activePage === "create" ? 'active' : ''}`}
          severity="success" // Use valid severity type
          outlined={activePage !== "create"}
        />
        <Button
          label="View Scheduler"
          icon="pi pi-calendar"
          onClick={() => setActivePage("view")}
          className={`schedulerHeaderButton ${activePage === "view" ? 'active' : ''}`}
          severity="success" // Use valid severity type
          outlined={activePage !== "view"}
        />
      </div>

      {/* Main Content */}
      <div className="schedulerContent">
        {activePage === "create" ? (
          <div className="schedulerSplitScreen">
            <Card className="schedulerPanel left-panel">
              <CreateScheduler />
            </Card>
            <Card className="schedulerPanel right-panel">
              <CreateSchedulerUsingQuery />
            </Card>
          </div>
        ) : (
          <Card className="view-scheduler">
            <ViewScheduler />
          </Card>
        )}
      </div>
    </div>
  );
};

export default Scheduler;
