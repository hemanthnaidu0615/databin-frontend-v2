import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { axiosInstance } from "../../../axios";

const PipelineRow = ({
  stages,
  currentStage,
  isFinal = false,
}: {
  stages: {
    stage_name: string;
    orders_count: number;
    avg_duration_hours?: number;
  }[];
  currentStage: number;
  isFinal?: boolean;
}) => {
  return (
    <div
      className={`flex flex-col sm:flex-row ${
        isFinal ? "flex-wrap justify-center" : "md:flex-wrap justify-center"
      } items-center gap-x-4 gap-y-4 px-2 max-w-screen-xl mx-auto`}
    >
      {stages.map((stage, index) => {
        const isCompleted = index < currentStage;
        const isCurrent = index === currentStage;

        const bgColor = isFinal
          ? "bg-slate-400 dark:bg-slate-600"
          : isCompleted
          ? "bg-purple-500"
          : isCurrent
          ? "bg-emerald-600"
          : "bg-yellow-500";

        return (
          <React.Fragment key={index}>
            <div className="flex flex-col items-center min-w-[90px] w-[100px] sm:w-[110px] md:w-[130px]">
              <div
                className={`w-full p-2 sm:p-3 rounded-md text-center font-bold text-[11px] sm:text-sm text-white ${bgColor}`}
              >
                {stage.orders_count.toLocaleString()}
              </div>
              <div className="mt-1 text-center text-[10px] sm:text-xs text-gray-700 dark:text-gray-300 font-medium">
                {stage.stage_name}
              </div>
              <div className="text-[9px] sm:text-[10px] text-gray-500 dark:text-gray-400">
                {stage.avg_duration_hours != null
                  ? stage.avg_duration_hours === 0
                    ? "0 hrs"
                    : `${stage.avg_duration_hours.toFixed(1)} hrs`
                  : "–"}
              </div>
            </div>

            {!isFinal && index < stages.length - 1 && (
              <>
                {/* Desktop Arrow (→) */}
                <div className="hidden sm:flex items-center justify-center -mt-10">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-gray-400 dark:text-gray-500"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>

                {/* Mobile Arrow (↓) */}
                <div className="sm:hidden flex justify-center my-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-gray-400 dark:text-gray-500"
                  >
                    <path d="M12 5v14M19 12l-7 7-7-7" />
                  </svg>
                </div>
              </>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

const FulfillmentPipeline = () => {
  const [stagesData, setStagesData] = useState<any[]>([]);
  const [finalStagesData, setFinalStagesData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const dateRange = useSelector((state: any) => state.dateRange.dates);
  const [startDate, endDate] = dateRange;
  const enterpriseKey = useSelector((state: any) => state.enterpriseKey.key);

  useEffect(() => {
    const fetchData = async () => {
      if (!startDate || !endDate) return;

      try {
        setLoading(true);

        const response = await axiosInstance.get(
          "/fulfillment/stages-pipeline",
          {
            params: {
              startDate,
              endDate,
              ...(enterpriseKey ? { enterpriseKey } : {}),
            },
          }
        );

        let data = response.data as {
          stage_name: string;
          orders_count: number;
          avg_duration_hours?: number;
        }[];

        const desiredPipelineStages = [
          "Order Placed",
          "Processing",
          "Distribution Center",
          "Warehouse",
          "Store Pickup",
          "Ship to Home",
          "Vendor Drop Shipping",
          "Locker Pickup",
          "Same-Day Delivery",
          "Curbside Pickup",
        ];

        const finalStageLabels = ["Shipped", "Cancelled", "Return Received"];

        const pipelineStages = desiredPipelineStages
          .map((label) => data.find((s: any) => s.stage_name === label))
          .filter(Boolean);

        const finalStages = data.filter((s: any) =>
          finalStageLabels.includes(s.stage_name)
        );

        setStagesData(pipelineStages);
        setFinalStagesData(finalStages);
      } catch (err: any) {
        setError(err.message || "Error loading data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [startDate, endDate, enterpriseKey]);

  if (loading) return <p>Loading fulfillment pipeline...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="w-full py-6 space-y-12">
      {/* Fulfillment Flow */}
      <div className="max-w-screen-xl px-4 sm:px-6 lg:px-8 mx-auto">
        <h2 className="app-subheading  mb-10">
          Fulfillment Stages Pipeline
        </h2>
        <PipelineRow stages={stagesData} currentStage={2} />
      </div>

      {/* Final Status Flow */}
      <div className="max-w-screen-xl px-4 sm:px-6 lg:px-8 mx-auto">
        <h2 className="app-subheading mt-8 mb-5">Final Stages</h2>
        <PipelineRow stages={finalStagesData} currentStage={-1} isFinal />
      </div>
    </div>
  );
};

export default FulfillmentPipeline;
