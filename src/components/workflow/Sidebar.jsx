// import React from 'react';
// import { useDnD } from './DnDContext';
// import './Sidebar.css'
// export default () => {
//   const [_, setType] = useDnD();

//   const onDragStart = (event, nodeType) => {
//     setType(nodeType);
//     event.dataTransfer.effectAllowed = 'move';
//   };

//   return (
//     <aside className='sidebar-2  w-[17%] h-[100%] text-white'>
//       <div className="description">You can drag these nodes to the pane on the right.</div>
//       <div className="dndnode input" onDragStart={(event) => onDragStart(event, 'input')} draggable>
//         <button className='flow-btn'>Start Workflow</button>
//       </div>
//       <div className="dndnode" onDragStart={(event) => onDragStart(event, 'default')} draggable>
//         <button className='flow-btn'>Default Node</button>
//       </div>
//       <div className="dndnode output" onDragStart={(event) => onDragStart(event, 'output')} draggable>
//         <button className='flow-btn'>End Workflow</button>
//       </div>
//     </aside>
//   );
// };

import React from 'react';
import { useDnD } from './DnDContext';
import './Sidebar.css';

export default function Sidebar() {
  const [_, setType] = useDnD();

  const onDragStart = (event, nodeType) => {
    setType(nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className='sidebar-2 w-[17%] h-[100%] text-white p-4'>
      <h3 className="text-lg font-semibold mb-4">Drag & Drop Nodes</h3>
      <div className="dndnode email" onDragStart={(event) => onDragStart(event, 'Email')} draggable>
        <button className='flow-btn flex items-center justify-center gap-2'>
          <img src='/gmail.svg' className='h-[90%]' alt='' />
          Email
        </button>
      </div>
      <div className="dndnode drive" onDragStart={(event) => onDragStart(event, 'Drive')} draggable>
        <button className='flow-btn'>
          <img src='/drive.svg' className='h-[90%]' alt='' />
          Drive
        </button>
      </div>
      <div className="dndnode calendar" onDragStart={(event) => onDragStart(event, 'Calendar')} draggable>
        <button className='flow-btn'>
          <img src='/calendar.svg' className='h-[90%]' alt='' />
          Calendar
        </button>
      </div>
      <div className="dndnode spreadsheet" onDragStart={(event) => onDragStart(event, 'Spreadsheet')} draggable>
        <button className='flow-btn'>
          <img src='/sheets.svg' className='h-[90%]' alt='' />
          Spreadsheet
        </button>
      </div>

    </aside>
  );
}
