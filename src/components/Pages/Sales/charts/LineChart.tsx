import { ResponsiveLine } from "@nivo/line";

interface LineChartProps {
  data: any;
  leftLegend?: string;
  isDark?: boolean;
  bottomLegend?: string;
  length?: number;
}

export const LineChart = ({ data, leftLegend = "Value", isDark = false, bottomLegend = "Dates" }: LineChartProps) => {
  const formatYAxis = (value: any) => {
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
    if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
    return value.toString();
  };

  const formatXAxis = (value: any) => {
    const parts = value.split(" ");
    return parts.length === 3 ? parts[2] : value;
  };

  const chartTheme = {
    axis: {
      ticks: {
        text: {
          fill: isDark ? "#E5E7EB" : "#4B5563",
        },
      },
      legend: {
        text: {
          fill: isDark ? "#F9FAFB" : "#1F2937",
        },
      },
    },
    grid: {
      line: {
        stroke: isDark ? "#374151" : "#E5E7EB",
        strokeWidth: 1,
      },
    },
    legends: {
      text: {
        fill: isDark ? "#E5E7EB" : "#1F2937",
      },
    },
    tooltip: {
      container: {
        background: isDark ? "#1F2937" : "#ffffff",
        color: isDark ? "#F9FAFB" : "#1F2937",
        fontSize: 12,
        border: `1px solid ${isDark ? "#4B5563" : "#D1D5DB"}`,
        borderRadius: 4,
        padding: 8,
      },
    },
  };

  return (
    <div className="w-full h-[300px] sm:h-[400px] md:h-[500px] xl:h-[600px] overflow-hidden bg-white dark:bg-gray-900 rounded-lg p-4">
      <ResponsiveLine
        data={data}
        margin={{ top: 10, right: 100, bottom: 60, left: 70 }}
        xScale={{ type: "point" }}
        yScale={{
          type: "linear",
          min: 0,
          max: "auto",
          stacked: true,
          reverse: false,
        }}
        curve="cardinal"
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 0,
          tickPadding: 6,
          tickRotation: -40,
          legend: bottomLegend,
          legendOffset: 40,
          legendPosition: "middle",
          format: formatXAxis,
        }}
        axisLeft={{
          tickSize: 3,
          tickPadding: 6,
          legend: leftLegend,
          legendOffset: -50,
          legendPosition: "middle",
          format: formatYAxis,
        }}
        enableArea={true}
        enablePoints={false}
        enableGridX={true}
        enableGridY={true}
        theme={chartTheme}
        useMesh={true}
        colors={[
          "rgba(173, 99, 155, 0.65)",
          "rgba(253, 88, 173, 0.8)",
          "rgba(125, 221, 187, 0.68)",
        ]}
        legends={[
          {
            anchor: "right",
            direction: "column",
            translateX: 100,
            itemWidth: 80,
            itemHeight: 20,
            itemOpacity: 0.75,
            symbolSize: 12,
            symbolShape: "circle",
            effects: [
              {
                on: "hover",
                style: {
                  itemBackground: isDark ? "#374151" : "#F3F4F6",
                  itemOpacity: 1,
                },
              },
            ],
          },
        ]}
        tooltip={({ point }) => (
          <div
            style={{
              background: isDark ? "#1F2937" : "#ffffff",
              color: isDark ? "#F9FAFB" : "#1F2937",
              border: `1px solid ${isDark ? "#4B5563" : "#D1D5DB"}`,
              borderRadius: 4,
              padding: "6px",
              fontSize: "0.75rem",
            }}
          >
            <strong>Order Date:</strong> {formatXAxis(point.data.x)} <br />
            <strong>Order Amount:</strong> {formatYAxis(point.data.y)}
          </div>
        )}
      />
    </div>
  );
};
