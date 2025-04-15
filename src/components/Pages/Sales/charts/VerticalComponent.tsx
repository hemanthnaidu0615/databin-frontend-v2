// import { useRef, useEffect, useState } from 'react';
// import * as d3 from 'd3';
// import './style.css';

// interface FlowChartNode {
//   id: string;
//   label: string;
//   children?: FlowChartNode[];
//   zoom?: number;
// }

// const VerticalComponent = ({ data }: { data: FlowChartNode[] }) => {
//   const svgRef = useRef<SVGSVGElement>(null);
//   const [leafPositions, setLeafPositions] = useState<d3.HierarchyPointNode<FlowChartNode>[]>([]);

//   useEffect(() => {
//     if (!svgRef.current) return;

//     const svg = d3.select(svgRef.current);
//     svg.selectAll("*").remove();

//     const containerWidth = svgRef.current.parentElement?.clientWidth || 800;
//     const containerHeight = svgRef.current.parentElement?.clientHeight || 600;
//     const padding = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--padding'), 10) || 200;

//     const fixedLeafSpacing = 120;

//     const root = d3.hierarchy(data[0], (d: FlowChartNode) => d.children);

//     if (leafPositions.length === 0) {
//       let leafNodes: d3.HierarchyPointNode<FlowChartNode>[] = [];
//       const calculateLeafPositions = (node: d3.HierarchyPointNode<FlowChartNode>, x = 0) => {
//         if (!node.children || node.children.length === 0) {
//           leafNodes.push(node);
//         } else {
//           node.children.forEach((child: d3.HierarchyPointNode<FlowChartNode>, i: number) => {
//             calculateLeafPositions(child, x + i * fixedLeafSpacing);
//           });
//         }
//       };
//       calculateLeafPositions(root as d3.HierarchyPointNode<FlowChartNode>);
//       setLeafPositions(leafNodes);
//     } else {
//       leafPositions.forEach((leaf, index) => {
//         leaf.y = index * fixedLeafSpacing;
//       });
//     }

//     let yPosition = 0;
//     const computeYPosition = (node: d3.HierarchyPointNode<FlowChartNode>) => {
//       if (!node.children || node.children.length === 0) {
//         node.y = yPosition;
//         yPosition += fixedLeafSpacing;
//       } else {
//         node.children.forEach((child: d3.HierarchyPointNode<FlowChartNode>) => computeYPosition(child));
//         node.y = d3.mean(node.children.map((child: d3.HierarchyPointNode<FlowChartNode>) => child.y ?? 0)) ?? 0;
//       }
//     };
//     computeYPosition(root as d3.HierarchyPointNode<FlowChartNode>);

//     const treeLayout = d3.tree<FlowChartNode>()
//       .size([containerHeight * 2, containerWidth - padding])
//       .separation(() => 1);

//     const nodes = treeLayout(root);

//     const maxX = Math.max(...nodes.descendants().map((d: d3.HierarchyPointNode<FlowChartNode>) => (d.x ?? 0) + 120));
//     const maxY = Math.max(...nodes.descendants().map((d: d3.HierarchyPointNode<FlowChartNode>) => d.y ?? 0));

//     const svgWidth = Math.max(containerWidth, maxY + padding);
//     const svgHeight = Math.max(containerHeight, maxX + padding);

//     svg.attr("width", svgWidth).attr("height", svgHeight);

//     const translateX = (svgWidth - maxY - padding) / 2;
//     const translateY = (svgHeight - maxX - padding) / 2;

//     svg.selectAll(".d3-link")
//       .data(nodes.links())
//       .enter()
//       .append("path")
//       .attr("class", "d3-link")
//       .attr("d", (d: d3.HierarchyPointLink<FlowChartNode>) => {
//         const sourceX = (d.source.y ?? 0) + padding / 2 + translateX;
//         const sourceY = (d.source.x ?? 0) + padding / 2 + translateY;
//         const targetX = (d.target.y ?? 0) + padding / 2 + translateX;
//         const targetY = (d.target.x ?? 0) + padding / 2 + translateY;

//         if (d.source.children && d.source.children.length > 1) {
//           const midX = ((d.source.y ?? 0) + (d.target.y ?? 0)) / 2;
//           return `M${sourceX},${sourceY} H${midX} V${targetY} H${targetX}`;
//         } else {
//           return `M${sourceX},${sourceY} H${targetX} V${targetY}`;
//         }
//       })
//       .attr("fill", "none")
//       .attr("stroke", "#999")
//       .attr("stroke-width", 2);

//     svg.selectAll(".d3-node")
//       .data(nodes.descendants())
//       .enter()
//       .append("g")
//       .attr("class", "d3-node")
//       .attr("transform", (d: d3.HierarchyPointNode<FlowChartNode>) => `translate(${(d.y ?? 0) + padding / 2 + translateX},${(d.x ?? 0) + padding / 2 + translateY})`)
//       .each(function (this: SVGGElement, d: d3.HierarchyPointNode<FlowChartNode>) {
//         const nodeWidth = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--node-width')) || 180;
//         const nodeHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--node-height')) || 60;

//         d3.select(this)
//           .append("rect")
//           .attr("class", "d3-node-rect")
//           .attr("width", nodeWidth)
//           .attr("height", nodeHeight)
//           .attr("rx", getComputedStyle(document.documentElement).getPropertyValue('--node-border-radius') || '15px')
//           .attr("x", -nodeWidth / 2)
//           .attr("y", -nodeHeight / 2);

//         d3.select(this)
//           .append("text")
//           .attr("class", "d3-node-label")
//           .attr("dy", "0.35em")
//           .attr("x", 0)
//           .style("text-anchor", "middle")
//           .text(d.data.label);
//       });

//   }, [data, leafPositions]);

//   return (
//     <div className="d3-flowchart-container">
//       <svg ref={svgRef} className="d3-flowchart-svg"></svg>
//     </div>
//   );
// };

// export default VerticalComponent;
