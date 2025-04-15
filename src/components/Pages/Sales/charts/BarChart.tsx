import { CategoryScale, Chart, registerables } from "chart.js";
import { Bar } from "react-chartjs-2";

Chart.register(...registerables);
Chart.register(CategoryScale);
export const BarChart = ({ chartData }: any) => {
  const formatValue = (value: number) => {
    if (value >= 1_000_000) {
      return `$${(value / 1_000_000).toFixed(1)}M`;
    } else if (value >= 1_000) {
      return `$${(value / 1_000_000).toFixed(1)}M`;
    }
    return `$${value.toLocaleString()}`;
  };
  return (
    <div className="chart-container h-48 w-full">
      <Bar
        data={chartData}
        width={750}
        options={{
          plugins: {
            title: {
              display: true,
            },
            legend: {
              display: true,
            },
            tooltip: {
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
                display: true,
              },
              title : {
                display: true,
                text: 'Dates',
              },
            },
            y: {
              ticks: {
                callback: function (value: any) {
                  return formatValue(value);
                },
              },
              title : {
                display: true,
                text: 'Order Amount ($)',
              },
            },
          },
          interaction: {
            mode: 'nearest',
            intersect: false,
          },
          hover: {
            mode: 'index',
            intersect: true,
          },
        }}
      />
    </div>
  );
};
