import React, { useState } from "react";
import { OrganizationChart } from "primereact/organizationchart";
import { TreeNode } from "primereact/treenode";
import { useTheme } from "next-themes";

interface OrgChartProps {
  data: TreeNode[];
  orientation?: string;
  zoom?: number;
}

export default function CustomOrgChart({
  data,
  orientation = "horizontal",
  zoom = 50,
}: OrgChartProps) {
  const { theme } = useTheme(); // Get current theme
  const [selection, setSelection] = useState<TreeNode[]>([]); // State to track selected nodes

  // Template for each node in the OrgChart
  const nodeTemplate = (node: TreeNode) => {
    const label = node.label || "";
    let nodeData = "";
    if (typeof node.data === "string") {
      nodeData = node.data.trim();
    } else if (typeof node.data === "object" && node.data !== null) {
      nodeData = `${node.data.value ?? ""} ${node.data.percentage ?? ""}`;
    }

    const [value = "", percentage = ""] = nodeData.split(" ");

    // Click handler to set the clicked node as selected
    const handleNodeClick = () => {
      setSelection([node]); // Set the selected node
      console.log("Node clicked:", node); // Handle any other logic on click
    };

    return (
      <div
        className={`p-3 rounded-md shadow-md text-center transition-all cursor-pointer ${
          theme === "dark"
            ? "bg-white text-gray-900 border border-gray-600"
            : "bg-white text-black"
        }`}
        onClick={handleNodeClick} // Adding the onClick handler
      >
        <div className="text-sm font-semibold mb-1">{label}</div>
        <div className="text-sm">{value}</div>
        {percentage && <div className="text-xs text-gray-500">{percentage}</div>}
      </div>
    );
  };

  return (
    <div
      className="inline-block overflow-auto bg-transparent rounded-md p-2"
      style={{
        transform:
          orientation === "vertical"
            ? `rotate(-90deg) scale(${zoom / 50})`
            : `scale(${zoom / 50})`,
        transformOrigin: orientation === "vertical" ? "left" : "left top",
        height: "calc(100vh - 200px)",
      }}
    >
      <OrganizationChart
        value={data}
        selection={selection}
        onSelectionChange={(e) => setSelection(e.data as TreeNode[])}
        nodeTemplate={nodeTemplate}
        pt={{
          node: {
            className: `p-0 text-xs ${
              theme === "dark" ? "bg-white text-gray-900" : "bg-white text-black"
            }`,
          },
        }}
        className="bg-transparent text-sm"
      />
    </div>
  );
}
