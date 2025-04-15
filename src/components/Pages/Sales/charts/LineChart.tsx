import { ResponsiveLine } from "@nivo/line";

export const LineChart = (props: any) => {
  const formatYAxis = (value: any) => {
    if (value >= 1000 && value < 1000000) {
      return `${(value / 1000000).toFixed(1).replace(/\.0$/, "")}M`;
    } else if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1).replace(/\.0$/, "")}M`;
    }
    return value.toString();
  };

  const formatXAxis = (value: any) => {
    const parts = value.split(" ");
    return parts.length === 3 ? parts[2] : value;
  };

  return (
    <div className="h-full w-full">
      <ResponsiveLine
        data={props.data}
        colors={[
          "rgba(173, 99, 155, 0.65)",
          "rgba(253, 88, 173, 0.8)",
          "rgba(125, 221, 187, 0.68)",
        ]}
        margin={{ top: 10, right: 110, bottom: 60, left: 80 }}  
        xScale={{ type: "point" }}
        yScale={{
          type: "linear",
          min: 0,
          max: "auto",
          stacked: true,
          reverse: false,
        }}
        yFormat=" >-.2f"
        curve="cardinal"
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 0.5,
          tickPadding: 3,
          tickRotation: -40,
          legend: "Dates",  
          legendOffset: 36,
          legendPosition: "middle",
          format: formatXAxis,
        }}
        axisLeft={{
          tickSize: 3,
          tickPadding: 4,
          tickRotation: 0,
          legend: props.leftLegend,  
          legendOffset: -50,  
          legendPosition: "middle",
          format: formatYAxis,
        }}
        enableArea={true}
        enableGridX={true}
        enableGridY={true}
        theme={{
          grid: {
            line: {
              stroke: "#f2f5fa",
            },
          },
        }}
        enablePoints={false}
        pointSize={10}
        pointColor={{ theme: "background" }}
        pointBorderWidth={2}
        pointBorderColor={{ from: "serieColor" }}
        pointLabelYOffset={-12}
        useMesh={true}
        legends={[
          {
            anchor: "right",
            direction: "column",
            justify: false,
            translateX: 100,
            translateY: -3,
            itemsSpacing: 0,
            itemDirection: "left-to-right",
            itemWidth: 80,
            itemHeight: 20,
            itemOpacity: 0.75,
            symbolSize: 12,
            symbolShape: "circle",
            symbolBorderColor: "rgba(0, 0, 0, .5)",
            effects: [
              {
                on: "hover",
                style: {
                  itemBackground: "rgba(0, 0, 0, .03)",
                  itemOpacity: 1,
                },
              },
            ],
          },
        ]}
        tooltip={({ point }) => (
          <div style={{ background: 'white', padding: '5px', border: '1px solid black' }}>
            <strong>Order Date:</strong> {formatXAxis(point.data.x)}
            <br />
            <strong>Order Amount:</strong> ${formatYAxis(point.data.y)}
          </div>
        )}
      />
    </div>
  );
};
