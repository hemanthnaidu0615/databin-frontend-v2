import { ResponsivePie } from "@nivo/pie";

interface HalfPiechartProps {
  data: any;
  isDark?: boolean;
}

export const HalfPiechart = ({ data, isDark }: HalfPiechartProps) => {
  const CenteredMetric = ({ dataWithArc, centerX, centerY }: any) => {
    const value = Math.ceil(
      (parseInt(dataWithArc[0]?.formattedValue) /
        parseInt(dataWithArc[1]?.formattedValue)) *
      100
    );
    return (
      <text
        x={centerX}
        y={centerY}
        textAnchor="middle"
        dominantBaseline="central"
        style={{
          fontSize: "14px",
          fontWeight: 700,
          transform: "translateY(-10%)",
          fill: isDark ? "#F9FAFB" : "#111827",
        }}
      >
        {value}%
      </text>
    );
  };

  const chartTheme = {
    tooltip: {
      container: {
        background: isDark ? "#1F2937" : "#ffffff",
        color: isDark ? "#F9FAFB" : "#111827",
        fontSize: 12,
        border: `1px solid ${isDark ? "#4B5563" : "#D1D5DB"}`,
        borderRadius: 4,
        padding: 8,
      },
    },
    legends: {
      text: {
        fill: isDark ? "#E5E7EB" : "#111827",
      },
    },
    labels: {
      text: {
        fill: isDark ? "#E5E7EB" : "#111827",
      },
    },
  };

  return (
    <div className="w-full h-[250px] md:h-[300px] lg:h-[350px] xl:h-[400px]">
      <ResponsivePie
        data={data}
        theme={chartTheme}
        colors={{ datum: "data.color" }}
        margin={{ top: 0, right: 25, bottom: 0, left: 25 }}
        startAngle={-90}
        endAngle={90}
        innerRadius={0.5}
        activeOuterRadiusOffset={8}
        borderWidth={0}
        enableArcLinkLabels={false}
        enableArcLabels={false}
        arcLinkLabelsSkipAngle={10}
        arcLinkLabelsTextColor={isDark ? "#E5E7EB" : "#333333"}
        arcLabelsSkipAngle={10}
        arcLabelsTextColor={{
          from: "color",
          modifiers: [["opacity", 0]],
        }}
        layers={["arcs", "arcLabels", "arcLinkLabels", "legends", CenteredMetric]}
        tooltip={({ datum }) => (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "5px 10px",
              background: isDark ? "#1F2937" : "white",
              border: `1px solid ${isDark ? "#4B5563" : "#D1D5DB"}`,
              borderRadius: "4px",
              whiteSpace: "nowrap",
              color: isDark ? "#F9FAFB" : "#111827",
            }}
          >
            <div
              style={{
                width: "12px",
                height: "12px",
                backgroundColor: datum.color,
                marginRight: "10px",
                borderRadius: "2px",
              }}
            />
            <div>
              <strong>{datum.label}:</strong> ${(datum.value / 1_000_000).toFixed(2)}M
            </div>
          </div>
        )}
      />
    </div>
  );
};
