import React from "react";
import { useAppsFlow } from "./AppsFlowContext";

const Sidebar = () => {
  const [_, setDraggedNodeType] = useAppsFlow();

  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
    setDraggedNodeType(nodeType);
  };

  return (
    <aside className="sidebar bg-gray-800 text-white p-4 w-1/5 h-screen">
      <h3 className="text-lg font-semibold mb-4">Drag & Drop Nodes</h3>
      <div
        className="dndnode bg-blue-500 p-2 mb-2 cursor-pointer"
        draggable
        onDragStart={(event) => onDragStart(event, "read-email")}
      >
        Read Email
      </div>
      <div
        className="dndnode bg-green-500 p-2 mb-2 cursor-pointer"
        draggable
        onDragStart={(event) => onDragStart(event, "upload-drive")}
      >
        Upload to Drive
      </div>
      <div
        className="dndnode bg-red-500 p-2 mb-2 cursor-pointer"
        draggable
        onDragStart={(event) => onDragStart(event, "send-email")}
      >
        Send Email
      </div>
    </aside>
  );
};

export default Sidebar;
