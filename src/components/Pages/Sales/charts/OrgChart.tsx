import { useState, useRef, useLayoutEffect } from "react";
import { OrganizationChart } from "primereact/organizationchart";
import { TreeNode } from "primereact/treenode";
import './style.css';
import { useTheme } from "next-themes";

interface OrgChartProps {
  data: TreeNode[];
  orientation?: string;
  zoom?: number;
}

export default function CustomOrgChart({
  data,
  zoom = 100,
}: OrgChartProps) {
  const { theme } = useTheme();
  const [selection, setSelection] = useState<TreeNode[]>([]);
  const chartRef = useRef<HTMLDivElement>(null);
  const [chartHeight, setChartHeight] = useState<number | null>(null);

  useLayoutEffect(() => {
    if (chartRef.current) {
      const height = chartRef.current.offsetHeight;
      setChartHeight(height);
    }
  }, [data, zoom]);

  const nodeTemplate = (node: TreeNode) => {
    const label = node.label || "";
    let nodeData = "";
    if (typeof node.data === "string") {
      nodeData = node.data.trim();
    } else if (typeof node.data === "object" && node.data !== null) {
      nodeData = `${node.data.value ?? ""} ${node.data.percentage ?? ""}`;
    }

    const [value = "", percentage = ""] = nodeData.split(" ");

    return (
      <div
        className={`p-3 rounded-md shadow-md text-center transition-all cursor-pointer ${theme === "dark"
            ? "bg-white text-gray-900 border border-gray-600"
            : "bg-white text-black"
          }`}
      >
        <div className="text-sm font-semibold mb-1">{label}</div>
        <div className="text-sm">{value}</div>
        {percentage && <div className="text-xs text-gray-500">{percentage}</div>}
      </div>
    );
  };

  return (
    <div
      className="overflow-auto border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 p-2"
      style={{ height: chartHeight ?? "auto" }}
    >
      <div
        ref={chartRef}
        className="inline-block"
        style={{
          transform: `scale(${zoom / 100})`,
          transformOrigin: "top left",
          whiteSpace: "nowrap",
        }}
      >
        <OrganizationChart
          value={data}
          selection={selection}
          onSelectionChange={(e) => setSelection(e.data as TreeNode[])}
          nodeTemplate={nodeTemplate}
          className="bg-transparent text-sm"
        />
      </div>
    </div>
  );
}
