import { ResponsivePie } from "@nivo/pie";
import { abbrvalue } from "../helpers/helpers";
import { useTheme } from "next-themes";

interface PieChartProps {
  data: any[];
}

export const PieChart = ({ data }: PieChartProps) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="w-full h-[300px] sm:h-[400px] md:h-[500px] xl:h-[600px] overflow-hidden bg-white dark:bg-gray-900 rounded-lg p-4">
      <ResponsivePie
        data={data}
        margin={{ top: 10, right: 100, bottom: 20, left: 20 }}
        innerRadius={0.5}
        padAngle={0.7}
        cornerRadius={3}
        activeOuterRadiusOffset={8}
        borderWidth={1}
        borderColor={{
          from: "color",
          modifiers: [["darker", 0.2]],
        }}
        enableArcLinkLabels={false}
        arcLabelsSkipAngle={10}
        arcLabelsTextColor={{
          from: "color",
          modifiers: [["darker", isDark ? 1 : 2]],
        }}
        valueFormat={(value) => `$${abbrvalue(value)}`}
        legends={[
          {
            anchor: "right",
            direction: "column",
            justify: false,
            translateX: 100,
            translateY: 0,
            itemsSpacing: 6,
            itemWidth: 100,
            itemHeight: 20,
            itemTextColor: isDark ? "#e4e4e7" : "#4B5563",
            itemDirection: "left-to-right",
            itemOpacity: 0.85,
            symbolSize: 14,
            symbolShape: "circle",
            effects: [
              {
                on: "hover",
                style: {
                  itemTextColor: isDark ? "#ffffff" : "#111827",
                },
              },
            ],
          },
        ]}
        theme={{
          background: "transparent",
          text: {
            color: isDark ? "#e4e4e7" : "#333",
          },
          tooltip: {
            container: {
              background: isDark ? "#1F2937" : "#ffffff",
              color: isDark ? "#F9FAFB" : "#111",
              fontSize: 12,
              border: `1px solid ${isDark ? "#4B5563" : "#D1D5DB"}`,
              borderRadius: 4,
              padding: "6px 10px",
            },
          },
        }}
      />
    </div>
  );
};
