import { useState } from "react";
import { Button } from "primereact/button";
import CreateScheduler from "./CreateScheduler";
import CreateSchedulerUsingQuery from "./CreateSchedulerUsingQuery";
import ViewScheduler from "./ViewScheduler";
import { Card } from "primereact/card";
import "./style.css"; // Keep this for minor tweaks

const Scheduler = () => {
  const [activePage, setActivePage] = useState<"create" | "view">("create");

  return (
    <div className="schedulerContainer">
      {/* Button Header */}
      <div className="w-full px-4 py-4 flex flex-col md:flex-row items-center gap-4 rounded-xl">
  <Button
    label="Create Scheduler"
    icon="pi pi-calendar-plus"
    onClick={() => setActivePage("create")}
    style={{background: "#9614d0",border:"none"}}
    className={`w-full md:w-auto px-5 py-3 rounded-lg font-semibold shadow transition-all duration-200 ${
      activePage === "create"
        ? "bg-[#8b9eff] text-black"
        : "bg-transparent text-gray-300 border border-[#8b9eff] hover:bg-[#2a2e45]"
    }`}
  />
  <Button
    label="View Scheduler"
    icon="pi pi-calendar"
    style={{background: "#9614d0", border:"none"}}
    onClick={() => setActivePage("view")}
    className={`w-full md:w-auto px-5 py-3 rounded-lg font-semibold shadow transition-all duration-200 ${
      activePage === "view"
        ? "bg-[#8b9eff] text-black"
        : "bg-transparent text-gray-300 border border-[#8b9eff] hover:bg-[#2a2e45]"
    }`}
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
