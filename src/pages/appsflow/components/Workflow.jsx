import React, { useRef, useCallback, useState } from "react";
import { ReactFlowProvider, ReactFlow, addEdge, useNodesState, useEdgesState, Controls, Background } from "@xyflow/react";
import { useAppsFlow } from "./AppsFlowContext";
import Sidebar from "./Sidebar";

const initialNodes = [];

let id = 0;
const getId = () => `node_${id++}`;

const Workflow = () => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [draggedNodeType] = useAppsFlow();

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const nodeType = event.dataTransfer.getData("application/reactflow");
      if (!nodeType) return;

      const position = {
        x: event.clientX - reactFlowWrapper.current.getBoundingClientRect().left,
        y: event.clientY - reactFlowWrapper.current.getBoundingClientRect().top,
      };

      const newNode = {
        id: getId(),
        type: "default",
        position,
        data: { label: nodeType.charAt(0).toUpperCase() + nodeType.slice(1) },
      };

      setNodes((nds) => [...nds, newNode]);
    },
    [setNodes]
  );

  return (
    <div className="flex w-full h-screen">
      <Sidebar />
      <div className="reactflow-wrapper flex-grow h-screen" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          fitView
          style={{ backgroundColor: "#F7F9FB", width: "100%", height: "100%" }}
        >
          <Controls />
          <Background />
        </ReactFlow>
      </div>
    </div>
  );
};

const WorkflowWrapper = () => (
  <ReactFlowProvider>
    <Workflow />
  </ReactFlowProvider>
);

export default WorkflowWrapper;
