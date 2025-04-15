import { ResponsivePie } from "@nivo/pie";
import { abbrvalue } from "../helpers/helpers";

export const PieChart = (props: any) => {
  // console.log("pie chart data", props.data);
  return (
    <div className="h-full w-full">
      <ResponsivePie
        data={props.data}
        margin={{ top: 10, right: 80, bottom: 10, left: 0 }}
        activeOuterRadiusOffset={8}
        borderWidth={1}
        borderColor={{
          from: "color",
          modifiers: [["darker", 0]],
        }}
        enableArcLinkLabels={false}
        arcLabelsSkipAngle={10}
        arcLabelsTextColor={{
          from: "color",
          modifiers: [["darker", 2]],
        }}
        valueFormat={(i) => "$" + abbrvalue(i)}
        legends={[
          {
            anchor: "right",
            direction: "column",
            justify: false,
            translateX: -30,
            translateY: 30,
            itemsSpacing: 0,
            itemWidth: 114,
            itemHeight: 33,
            itemTextColor: "#999",
            itemDirection: "left-to-right",
            itemOpacity: 1,
            symbolSize: 14,
            symbolShape: "circle",
            effects: [
              {
                on: "hover",
                style: {
                  itemTextColor: "#000",
                },
              },
            ],
          },
        ]}
      />
    </div>
  );
};
