import { OrganizationChart } from "primereact/organizationchart";
import { TreeNode } from "primereact/treenode";
import { useState } from "react";
import './style.css';

interface OrgChartProps {
  data: TreeNode[];
  orientation?: string;
  zoom?: number; 
}

export default function OrgChart({ data, orientation = "horizontal", zoom = 50 }: OrgChartProps) {
  const [selection, setSelection] = useState<TreeNode[]>([]);
  
  const nodeTemplate = (node: TreeNode) => {
    const label = node.label || ''; 
    let data= node.data || '';
    if (label.includes("Sales")) {
      data = data.replace("100.00%", "");
    }
    const [value, percentage] = data.trim().split(' '); 
    // console.log(value+" is"+percentage)
    return (
      <div className="node-container">
        <div className="node-content">
          <span className="node-label font-bold mb-2">{label}</span>
          <span className="node-data">{value}</span>
         {percentage && <span className="node-data">{percentage}</span>}
        </div>
      </div>
    );
  };

  return (
    <div
      className="card"
      style={{
        transform: orientation === "vertical" ? `rotate(-90deg) scale(${zoom / 50})` : `scale(${zoom / 50})`,
        transformOrigin: orientation === "vertical" ? "left" : "left top",
        overflow: "auto", 
        display: "inline-block",
        backgroundColor:"white", 
        maxHeight: "calc(100vh - 200px)"
      }}
    >
      <OrganizationChart
        value={data}
        selectionMode="multiple"
        selection={selection}
        onSelectionChange={(e) => setSelection(e.data as any)}
        nodeTemplate={nodeTemplate}
        pt={{ node: { className: "p-0 text-xs" } }}
        style={{padding:"0px",backgroundColor:"white"}}
      />
    </div>
  );
}