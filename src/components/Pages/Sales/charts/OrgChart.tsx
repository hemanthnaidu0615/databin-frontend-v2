import { OrganizationChart } from "primereact/organizationchart";
import { TreeNode } from "primereact/treenode";
import { useState } from "react";
import './style.css';

interface OrgChartProps {
  data: TreeNode[];
  orientation?: string;
  zoom?: number;
}

export default function OrgChart({
  data,
  orientation = "horizontal",
  zoom = 50,
}: OrgChartProps) {
  const [selection, setSelection] = useState<TreeNode[]>([]);

  const nodeTemplate = (node: TreeNode) => {
    const label = node.label || '';
    let nodeData = node.data || '';

    if (label.includes("Sales")) {
      nodeData = nodeData.replace("100.00%", "");
    }

    const [value, percentage] = nodeData.trim().split(' ');

    return (
      <div className="node-container bg-white dark:bg-gray-800 text-black dark:text-white border border-gray-300 dark:border-gray-700 rounded-md p-2 shadow-sm transition-all">
        <div className="node-content flex flex-col items-center">
          <span className="node-label font-semibold text-sm mb-1 text-center">{label}</span>
          <span className="node-data text-sm">{value}</span>
          {percentage && <span className="node-data text-xs text-gray-500 dark:text-gray-300">{percentage}</span>}
        </div>
      </div>
    );
  };

  return (
    <div
      className="card bg-white dark:bg-gray-900 overflow-auto inline-block max-h-[calc(100vh-200px)] rounded-md p-2"
      style={{
        transform:
          orientation === "vertical"
            ? `rotate(-90deg) scale(${zoom / 50})`
            : `scale(${zoom / 50})`,
        transformOrigin: orientation === "vertical" ? "left" : "left top",
      }}
    >
      <OrganizationChart
        value={data}
        selectionMode="multiple"
        selection={selection}
        onSelectionChange={(e) => setSelection(e.data as any)}
        nodeTemplate={nodeTemplate}
        pt={{ node: { className: "p-0 text-xs" } }}
        className="bg-transparent text-sm"
      />
    </div>
  );
}
