
import { useState,useLayoutEffect } from "react";
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

const filterButtons = [
  { label: "Item Info", value: "item-info" },
  { label: "Fulfillment", value: "fulfillment" },
  { label: "Order Channel", value: "order_capture_channel" },
];

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

function SalesFlow() {
  const [selectedFilter, setSelectedFilter] = useState(filterButtons[0].value);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [rawData, setRawData] = useState<any[]>([]);
  const [fitViewDone, setFitViewDone] = useState(false);


useLayoutEffect(() => {
  const dummy = dummyData[selectedFilter];
  convertAndSetFlowData(dummy);
  setRawData(dummy);
  setFitViewDone(false); // Reset zoom flag on filter change
}, [selectedFilter]);

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
      const dollar = `$${item.original_order_total_amount.toLocaleString()}`;
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
      <ul className="space-y-4">
        {data.map((item, index) => {
          const dollar = `$${item.original_order_total_amount.toLocaleString()}`;
          const percent =
            parentTotal > 0
              ? `${(
                  (item.original_order_total_amount / parentTotal) *
                  100
                ).toFixed(2)}%`
              : "";

          return (
            <li key={index} className="border-l border-blue-500 pl-4 ml-2">
              <div className="text-white dark:text-white">
                <p className="font-semibold text-blue-300">{item.key}</p>
                <p className="text-sm">
                  💰 {dollar} <span className="text-green-400">{percent}</span>
                </p>
              </div>
              {item.children && item.children.length > 0 && (
                <div className="ml-4 mt-2">
                  {renderVerticalTimeline(
                    item.children,
                    item.original_order_total_amount
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen  text-gray-900 dark:text-white">
      <div className="max-w-full w-full mx-auto">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-blue-700 dark:text-blue-300 mb-2">
            Sales Flow (Dummy)
          </h1>
          <div className="flex flex-wrap gap-4">
            {filterButtons.map((btn) => (
              <button
                key={btn.value}
                onClick={() => setSelectedFilter(btn.value)}
                className={`px-4 py-2 rounded-lg font-medium text-sm shadow-md transition-all duration-150 ${
                  selectedFilter === btn.value
                    ? "bg-blue-600 text-white"
                    : "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-white"
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* Desktop/Tablet View */}
        <div className="hidden sm:block w-full h-[80vh] bg-gray-100 dark:bg-gray-800 rounded-xl shadow-lg px-6 ml-5 mr-2">
   <ReactFlowProvider>
  {nodes.length > 0 && edges.length > 0 && (
<ReactFlow
  key={selectedFilter}
  nodes={nodes}
  edges={edges}
  onNodesChange={onNodesChange}
  onEdgesChange={onEdgesChange}
  fitView={fitViewDone}
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

// ...previous imports and component setup remain unchanged

const dummyData: Record<string, any[]> = {
  "item-info": [
    {
      key: "Total Sales",
      original_order_total_amount: 1730000,
      children: [
        {
          key: "AWD",
          original_order_total_amount: 780000,
          children: [
            {
              key: "Mobiles",
              original_order_total_amount: 320000,
            },
            {
              key: "Laptops",
              original_order_total_amount: 250000,
            },
            {
              key: "Accessories",
              original_order_total_amount: 210000,
            },
          ],
        },
        {
          key: "AWW",
          original_order_total_amount: 950000,
          children: [
            {
              key: "Mobiles",
              original_order_total_amount: 400000,
              children: [
                {
                  key: "iPhone",
                  original_order_total_amount: 240000,
                },
                {
                  key: "Samsung",
                  original_order_total_amount: 160000,
                },
              ],
            },
            {
              key: "Laptops",
              original_order_total_amount: 300000,
              children: [
                {
                  key: "Dell",
                  original_order_total_amount: 180000,
                },
                {
                  key: "HP",
                  original_order_total_amount: 120000,
                },
              ],
            },
            {
              key: "Accessories",
              original_order_total_amount: 250000,
            },
          ],
        },
      ],
    },
  ],
  fulfillment: [
    {
      key: "Total Sales",
      original_order_total_amount: 1730000,
      children: [
        {
          key: "AWD",
          original_order_total_amount: 780000,
          children: [
            {
              key: "Mobiles",
              original_order_total_amount: 320000,
            },
            {
              key: "Laptops",
              original_order_total_amount: 250000,
            },
            {
              key: "Accessories",
              original_order_total_amount: 210000,
            },
          ],
        },
        {
          key: "AWW",
          original_order_total_amount: 950000,
          children: [
            {
              key: "Mobiles",
              original_order_total_amount: 400000,
              children: [
                {
                  key: "iPhone",
                  original_order_total_amount: 240000,
                },
                {
                  key: "Samsung",
                  original_order_total_amount: 160000,
                },
              ],
            },
            {
              key: "Laptops",
              original_order_total_amount: 300000,
              children: [
                {
                  key: "Dell",
                  original_order_total_amount: 180000,
                },
                {
                  key: "HP",
                  original_order_total_amount: 120000,
                },
              ],
            },
            {
              key: "Accessories",
              original_order_total_amount: 250000,
            },
          ],
        },
      ],
    },
  ],
  order_capture_channel: [
    {
      key: "Total Sales",
      original_order_total_amount: 1730000,
      children: [
        {
          key: "AWD",
          original_order_total_amount: 780000,
          children: [
            {
              key: "Mobiles",
              original_order_total_amount: 320000,
            },
            {
              key: "Laptops",
              original_order_total_amount: 250000,
            },
            {
              key: "Accessories",
              original_order_total_amount: 210000,
            },
          ],
        },
        {
          key: "AWW",
          original_order_total_amount: 950000,
          children: [
            {
              key: "Mobiles",
              original_order_total_amount: 400000,
              children: [
                {
                  key: "iPhone",
                  original_order_total_amount: 240000,
                },
                {
                  key: "Samsung",
                  original_order_total_amount: 160000,
                },
              ],
            },
            {
              key: "Laptops",
              original_order_total_amount: 300000,
              children: [
                {
                  key: "Dell",
                  original_order_total_amount: 180000,
                },
                {
                  key: "HP",
                  original_order_total_amount: 120000,
                },
              ],
            },
            {
              key: "Accessories",
              original_order_total_amount: 250000,
            },
          ],
        },
      ],
    },
  ],
};

export default SalesFlow;