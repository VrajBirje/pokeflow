import React, { useRef, useCallback, useState, useEffect } from 'react';
import './workflow.css'
import {
    ReactFlow,
    ReactFlowProvider,
    addEdge,
    useNodesState,
    useEdgesState,
    Controls,
    useReactFlow,
    Background,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';
import Sidebar from './Sidebar';
import { DnDProvider, useDnD } from './DnDContext';

const initialNodes = [
    {
        id: '1',
        type: 'textUpdater',
        data: { label: 'input node' },
        position: { x: 250, y: 5 },
    },
];

let id = 0;
const getId = () => `dndnode_${id++}`;

const DnDFlow = () => {
    const reactFlowWrapper = useRef(null);
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const { screenToFlowPosition } = useReactFlow();
    const [type] = useDnD();

    const onConnect = useCallback(
        (params) => setEdges((eds) => addEdge(params, eds)),
        [],
    );

    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback(
        (event) => {
            event.preventDefault();

            if (!type) return;

            const position = screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            });
            const newNode = {
                id: getId(),
                type: 'textUpdater',
                position,
                data: { label: '' },
            };

            setNodes((nds) => [...nds, newNode]);
        },
        [screenToFlowPosition, type]
    );

    const onLabelChange = (id, newLabel) => {
        setNodes((nds) =>
            nds.map((node) =>
                node.id === id ? { ...node, data: { ...node.data, label: newLabel } } : node
            )
        );
    };

    return (
        <div className="dndflow w-[100%] h-[90%] flex">
            <div className="reactflow-wrapper w-[80%] h-[100%]" ref={reactFlowWrapper}>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                    fitView
                    style={{ backgroundColor: "#F7F9FB" }}
                >
                    <Controls />
                    <Background />
                </ReactFlow>
            </div>
            <Sidebar />
            <div className="labels-list w-[20%] p-4">
                <h3 className="text-[#efdf9f] text-lg font-semibold">Node Labels</h3>
                <p className='text-sm' >Edit your labels here</p>
                <ul className='l-list'>
                    {nodes.map((node) => (
                        <li key={node.id} className="text-sm">
                            <input
                                type="text"
                                value={node.data.label}
                                onChange={(e) => onLabelChange(node.id, e.target.value)}
                                className="input-label border p-1 w-full"
                            />
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

const DnDFlowWrapper = () => (
    <ReactFlowProvider>
        <DnDProvider>
            <DnDFlow />
        </DnDProvider>
    </ReactFlowProvider>
);

export default DnDFlowWrapper;