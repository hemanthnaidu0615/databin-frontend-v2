import React from "react";
import { Button } from "primereact/button";

// Importing widgets
import StatisticsChart from "../StatisticsChart";
import RecentOrders from "../RecentOrders";
import OrderTracking from "../OrderTracking";
import DemographicCard from "../DemographicCard";
import OrderProcessingTime from "../Widgets/OrderProcessingTime";
import OrderTrendsCategory from "../Widgets/OrderTrendsCategory";
import OrderValueSegment from "../Widgets/OrderValueSegment";
import RevenuePerCustomer from "../Widgets/RevenuePerCustomer";

const widgetComponents: Record<string, React.FC> = {
  StatisticsChart,
  RecentOrders,
  OrderTracking,
  DemographicCard,
  OrderProcessingTime,
  OrderTrendsCategory,
  OrderValueSegment,
  RevenuePerCustomer,
};

interface WidgetGridProps {
  selectedWidgets: string[];
  removeWidget: (widgetName: string) => void;
}

const WidgetGrid: React.FC<WidgetGridProps> = ({ selectedWidgets, removeWidget }) => {
  return (
    <div className="grid grid-cols-12 gap-4 p-4">
      {selectedWidgets.map((widgetName) => {
        const WidgetComponent = widgetComponents[widgetName];
        if (!WidgetComponent) return null;

        return (
          <div 
            key={widgetName} 
            className="col-span-12 md:col-span-6 xl:col-span-4 
                       relative bg-white dark:bg-gray-900 p-4 rounded-lg shadow-lg"
          >
            {/* Render Widget */}
            <WidgetComponent />

            {/* Remove Button */}
            <Button 
              icon="pi pi-times" 
              className="p-button-danger p-button-text absolute top-2 right-2" 
              onClick={() => removeWidget(widgetName)} 
            />
          </div>
        );
      })}
    </div>
  );
};

export default WidgetGrid;