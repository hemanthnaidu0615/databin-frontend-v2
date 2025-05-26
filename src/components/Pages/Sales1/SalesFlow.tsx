import { useState, useEffect } from "react";
import {
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  Background,
  Controls,
  ReactFlow,
  Node,
  Edge,
} from "reactflow";
import "reactflow/dist/style.css";
import dagre from "dagre";
import { useSelector } from "react-redux";
import { axiosInstance } from "../../../axios";

const convertToUSD = (rupees: number): number => {
  const exchangeRate = 0.012;
  return rupees * exchangeRate;
};

const formatValue = (value: number): string => {
  if (value >= 1_000_000) return (value / 1_000_000).toFixed(1) + "M";
  if (value >= 1_000) return (value / 1_000).toFixed(1) + "K";
  return value.toFixed(0);
};

const nodeWidth = 200;
const nodeHeight = 150;

const getLayoutedElements = (
  nodes: Node[],
  edges: Edge[],
  direction: "TB" | "LR" = "TB"
): { nodes: Node[]; edges: Edge[] } => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
};

let nodeIdCounter = 1;

function formatDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function SalesFlow() {
  const dateRange = useSelector((state: any) => state.dateRange.dates);
  const [startDate, endDate] = dateRange || [];

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [rawData, setRawData] = useState<any[]>([]);
  const [_, setFitViewDone] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!startDate || !endDate) return;

      const formattedStart = formatDate(new Date(startDate));
      const formattedEnd = formatDate(new Date(endDate));

      const params = new URLSearchParams({
        startDate: formattedStart,
        endDate: formattedEnd,
      });

      try {
        const res = await axiosInstance.get(`/flow/breakdown?${params}`);
        const data = await res.data;
        const nested = convertToHierarchy(data as any[]);
        setRawData(nested);
        convertAndSetFlowData(nested);
        setFitViewDone(false);
      } catch (error) {
        console.error("Failed to fetch sales breakdown:", error);
      }
    };

    fetchData();
  }, [startDate, endDate]);

  const convertToHierarchy = (flatData: any[]) => {
    const grouped = new Map();

    for (const item of flatData) {
      // const { enterprise_key, category_name, product_name, total_sales } = item;
      const { enterprise_key, category_name, total_sales } = item;

      if (!grouped.has(enterprise_key)) {
        grouped.set(enterprise_key, new Map());
      }

      const categories = grouped.get(enterprise_key);
      if (!categories.has(category_name)) {
        categories.set(category_name, []);
      }

      // categories.get(category_name).push({
      //   key: product_name,
      //   original_order_total_amount: convertToUSD(total_sales),
      // });

      const currentList = categories.get(category_name);
      currentList.push(convertToUSD(total_sales));


    }

    const result: any[] = [];
    for (const [enterprise, cats] of grouped) {
      const children: any[] = [];
      let enterpriseTotal = 0;

      for (const [catName, products] of cats) {
        // const catTotal = products.reduce((sum: number, p: { original_order_total_amount: number }) => sum + p.original_order_total_amount, 0);
        const catTotal = products.reduce(
          (sum: number, p: number) => sum + p,
          0
        );

        enterpriseTotal += catTotal;

        children.push({
          key: catName,
          original_order_total_amount: catTotal,
          // children: products,
        });
      }

      result.push({
        key: enterprise,
        original_order_total_amount: enterpriseTotal,
        children,
      });
    }

    return [
      {
        key: "Total Sales",
        original_order_total_amount: result.reduce((sum, e) => sum + e.original_order_total_amount, 0),
        children: result,
      },
    ];
  };

  const convertAndSetFlowData = (data: any[]) => {
    nodeIdCounter = 1;
    const localNodes: Node[] = [];
    const localEdges: Edge[] = [];

    const total = data.reduce(
      (acc: number, item: any) => acc + item.original_order_total_amount,
      0
    );

    const buildFlow = (items: any[], parentId: string | null = null) => {
      return items.map((item: any) => {
        const currentId = String(nodeIdCounter++);
        const dollar = `$${formatValue(item.original_order_total_amount)}`;
        const percent =
          total > 0
            ? `(${((item.original_order_total_amount / total) * 100).toFixed(1)}%)`
            : "";
        const label = `${item.key}\n${dollar}\n${percent}`;

        localNodes.push({
          id: currentId,
          type: "default",
          data: {
            label: (
              <div className="whitespace-pre-line text-center text-sm px-2 py-1">
                {label}
              </div>
            ),
          },
          position: { x: 0, y: 0 },
        });

        if (parentId) {
          localEdges.push({
            id: `e${parentId}-${currentId}`,
            source: parentId,
            target: currentId,
          });
        }

        if (item.children && item.children.length > 0)
          buildFlow(item.children, currentId);

        return currentId;
      });
    };

    buildFlow(data);

    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      localNodes,
      localEdges
    );

    setNodes([...layoutedNodes]);
    setEdges([...layoutedEdges]);
  };

  const renderVerticalTimeline = (data: any[], parentTotal = 0) => {
    return (
      <div className="overflow-y-auto max-h-[70vh]">
        <ul className="space-y-4">
          {data.map((item, index) => {
            const dollar = `$${formatValue(item.original_order_total_amount)}`;
            const percent =
              parentTotal > 0
                ? `${((item.original_order_total_amount / parentTotal) * 100).toFixed(2)}%`
                : "";

            return (
              <li key={index} className="border-l border-purple-500 pl-4 ml-2">
                <div className="text-white dark:text-white">
                  <p className="font-semibold text-purple-300">{item.key}</p>
                  <p className="text-sm">
                    💰 {dollar} <span className="text-green-400">{percent}</span>
                  </p>
                </div>
                {item.children && item.children.length > 0 && (
                  <div className="ml-4 mt-2">
                    {renderVerticalTimeline(item.children, item.original_order_total_amount)}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl dark:bg-gray-900 min-h-screen w-full text-gray-900 dark:text-white p-4">
      <div className="max-w-full w-full mx-auto">
        <div className="mb-4">
          <h1 className="app-section-title mb-2">
            Sales Flow (USD)
          </h1>
        </div>

        {/* Desktop/Tablet View */}
        <div className="hidden sm:block h-[80vh] bg-gray-100 dark:bg-gray-800 rounded-xl shadow-lg">
          <ReactFlowProvider>
            {nodes.length > 0 && edges.length > 0 && (
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                fitView
                onInit={() => setFitViewDone(true)}
                proOptions={{ hideAttribution: true }}
                className="dark:!bg-gray-800"
              >
                <Background />
                <Controls className="!top-4 !left-4 !bottom-auto" />
              </ReactFlow>
            )}
          </ReactFlowProvider>
        </div>

        {/* Mobile View */}
        <div className="block sm:hidden w-full bg-gray-100 dark:bg-gray-800 rounded-xl shadow-lg p-4">
          {renderVerticalTimeline(
            rawData,
            rawData.reduce(
              (acc, item) => acc + item.original_order_total_amount,
              0
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default SalesFlow;