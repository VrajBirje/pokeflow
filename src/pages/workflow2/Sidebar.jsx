import React from 'react';
import { useDnD } from './DnDContext';
import './Sidebar.css'
export default () => {
  const [_, setType] = useDnD();

  const onDragStart = (event, nodeType) => {
    setType(nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className='sidebar-2  w-[17%] h-[100%] text-white'>
      <div className="description">You can drag these nodes to the pane on the right.</div>
      <div className="dndnode input" onDragStart={(event) => onDragStart(event, 'input')} draggable>
        <button className='flow-btn'>Start Workflow</button>
      </div>
      <div className="dndnode" onDragStart={(event) => onDragStart(event, 'default')} draggable>
        <button className='flow-btn'>Default Node</button>
      </div>
      <div className="dndnode output" onDragStart={(event) => onDragStart(event, 'output')} draggable>
        <button className='flow-btn'>End Workflow</button>
      </div>
    </aside>
  );
};