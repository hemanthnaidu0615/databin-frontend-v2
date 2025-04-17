import { CategoryScale, Chart, registerables } from "chart.js";
import { Bar } from "react-chartjs-2";
import { useEffect } from "react";

Chart.register(...registerables);
Chart.register(CategoryScale);

interface BarChartProps {
  chartData: any;
  isDark?: boolean;
}

export const BarChart = ({ chartData, isDark = false }: BarChartProps) => {
  const formatValue = (value: number) => {
    if (value >= 1_000_000) {
      return `$${(value / 1_000_000).toFixed(1)}M`;
    } else if (value >= 1_000) {
      return `$${(value / 1_000).toFixed(1)}K`;
    }
    return `$${value.toLocaleString()}`;
  };

  return (
    <div className="w-full h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px] xl:h-[450px] overflow-hidden">
      <Bar
        data={chartData}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: false,
            },
            legend: {
              display: true,
              position: "top" as const,
              labels: {
                color: isDark ? "#E5E7EB" : "#111827",
              },
            },
            tooltip: {
              backgroundColor: isDark ? "#1F2937" : "#ffffff",
              titleColor: isDark ? "#F9FAFB" : "#111827",
              bodyColor: isDark ? "#D1D5DB" : "#1F2937",
              borderColor: isDark ? "#4B5563" : "#D1D5DB",
              borderWidth: 1,
              callbacks: {
                label: function (context: any) {
                  return `${context.dataset.label}: ${formatValue(context.raw)}`;
                },
              },
            },
          },
          scales: {
            x: {
              ticks: {
                color: isDark ? "#D1D5DB" : "#111827",
              },
              title: {
                display: true,
                text: "Dates",
                color: isDark ? "#E5E7EB" : "#111827",
              },
              grid: {
                color: isDark ? "#374151" : "#E5E7EB",
              },
            },
            y: {
              ticks: {
                color: isDark ? "#D1D5DB" : "#111827",
                callback: function (value: any) {
                  return formatValue(value);
                },
              },
              title: {
                display: true,
                text: "Order Amount ($)",
                color: isDark ? "#E5E7EB" : "#111827",
              },
              grid: {
                color: isDark ? "#374151" : "#E5E7EB",
              },
            },
          },
          interaction: {
            mode: "nearest",
            intersect: false,
          },
          hover: {
            mode: "index",
            intersect: true,
          },
        }}
      />
    </div>
  );
};
