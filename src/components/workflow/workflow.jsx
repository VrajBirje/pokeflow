// import React, { useRef, useCallback, useState, useEffect } from 'react';
// import './workflow.css'
// import {
//     ReactFlow,
//     ReactFlowProvider,
//     addEdge,
//     useNodesState,
//     useEdgesState,
//     Controls,
//     useReactFlow,
//     Background,
// } from '@xyflow/react';

// import '@xyflow/react/dist/style.css';
// import Sidebar from './Sidebar';
// import { DnDProvider, useDnD } from './DnDContext';

// const initialNodes = [
//     {
//         id: '1',
//         type: 'textUpdater',
//         data: { label: 'input node' },
//         position: { x: 250, y: 5 },
//     },
// ];

// let id = 0;
// const getId = () => `dndnode_${id++}`;

// const DnDFlow = () => {
//     const reactFlowWrapper = useRef(null);
//     const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
//     const [edges, setEdges, onEdgesChange] = useEdgesState([]);
//     const { screenToFlowPosition } = useReactFlow();
//     const [type] = useDnD();

//     const onConnect = useCallback(
//         (params) => setEdges((eds) => addEdge(params, eds)),
//         [],
//     );

//     const onDragOver = useCallback((event) => {
//         event.preventDefault();
//         event.dataTransfer.dropEffect = 'move';
//     }, []);

//     const onDrop = useCallback(
//         (event) => {
//             event.preventDefault();

//             if (!type) return;

//             const position = screenToFlowPosition({
//                 x: event.clientX,
//                 y: event.clientY,
//             });
//             const newNode = {
//                 id: getId(),
//                 type: 'textUpdater',
//                 position,
//                 data: { label: '' },
//             };

//             setNodes((nds) => [...nds, newNode]);
//         },
//         [screenToFlowPosition, type]
//     );

//     const onLabelChange = (id, newLabel) => {
//         setNodes((nds) =>
//             nds.map((node) =>
//                 node.id === id ? { ...node, data: { ...node.data, label: newLabel } } : node
//             )
//         );
//     };

//     return (
//         <div className="dndflow w-[100%] h-[90%] flex">
//             <div className="reactflow-wrapper w-[80%] h-[100%]" ref={reactFlowWrapper}>
//                 <ReactFlow
//                     nodes={nodes}
//                     edges={edges}
//                     onNodesChange={onNodesChange}
//                     onEdgesChange={onEdgesChange}
//                     onConnect={onConnect}
//                     onDrop={onDrop}
//                     onDragOver={onDragOver}
//                     fitView
//                     style={{ backgroundColor: "#F7F9FB" }}
//                 >
//                     <Controls />
//                     <Background />
//                 </ReactFlow>
//             </div>
//             <Sidebar />
//             <div className="labels-list w-[20%] p-4 bg-[#F1E0C6] text-[#6b4e2f]">
//                 <h3 className="text-[#efdf9f] text-lg font-semibold">Node Labels</h3>
//                 <p className='text-sm' >Edit your labels here</p>
//                 <ul className='l-list'>
//                     {nodes.map((node) => (
//                         <li key={node.id} className="text-sm">
//                             <input
//                                 type="text"
//                                 value={node.data.label}
//                                 onChange={(e) => onLabelChange(node.id, e.target.value)}
//                                 className="input-label border p-1 w-full"
//                             />
//                         </li>
//                     ))}
//                 </ul>
//             </div>
//         </div>
//     );
// };

// const DnDFlowWrapper = () => (
//     <ReactFlowProvider>
//         <DnDProvider>
//             <DnDFlow />
//         </DnDProvider>
//     </ReactFlowProvider>
// );

// export default DnDFlowWrapper;
import React, { useRef, useCallback, useState } from 'react';
import './workflow.css';
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
import { fetchEmails, downloadAttachment, uploadToDrive, writeToSheet ,addEventToCalendar } from '../../components/GoogleApi';
import '@xyflow/react/dist/style.css';
import Sidebar from './Sidebar';
import { DnDProvider, useDnD } from './DnDContext';
import { useUser } from "@clerk/clerk-react";

const initialNodes = [];

let id = 0;
const getId = () => `dndnode_${id++}`;

const DnDFlow = () => {
    const { user } = useUser();
    const name = user?.firstName || "User";
    const reactFlowWrapper = useRef(null);
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const { screenToFlowPosition } = useReactFlow();
    const [type] = useDnD();

    const [waitingForAttachment, setWaitingForAttachment] = useState(false);

    const checkForNewEmails = async () => {
        const token = localStorage.getItem("google_access_token");
        if (!token) {
            alert("Please authenticate with Google first.");
            return;
        }

        let hasAttachments = false;

        while (!hasAttachments) {
            console.log("Checking for new emails...");
            const emails = await fetchEmails(token);

            const emailWithAttachment = emails.find(email => email.attachments?.length > 0);

            if (emailWithAttachment) {
                hasAttachments = true;
                console.log("Attachment found! Downloading...");
                let emailText = emailWithAttachment.body || "No text available"; // Extract email body
                let emailSubject = emailWithAttachment.subject || "No Subject";
                let emailDate = new Date(emailWithAttachment.date); // Convert received date
                for (const attachment of emailWithAttachment.attachments) {
                    const fileData = await downloadAttachment(token, emailWithAttachment.id, attachment.id, attachment.filename);

                    console.log("Uploading to Drive...");
                    const driveFileId = await uploadToDrive(token, attachment.filename, fileData);

                    console.log(`File uploaded to Drive: ${driveFileId}`);

                    // If attachment is a text file, extract text and save to Sheets
                    if (attachment.filename.endsWith('.txt')) {
                        const textContent = new TextDecoder().decode(fileData);
                        console.log("Saving text to Google Sheets...");
                        await writeToSheet(token, [[attachment.filename, textContent]]);
                    }
                }
                console.log("Saving email content to Google Sheets...");
                await writeToSheet(token, [[emailWithAttachment.subject || "No Subject", emailText]]);
                console.log("Adding event to Google Calendar...");
                await addEventToCalendar(token, emailSubject, emailDate);

                alert("Attachment processed successfully!");
                setWaitingForAttachment(false);
            } else {
                console.log("No attachments yet, waiting...");
                await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 10 sec before rechecking
            }
        }
    };

    const handleMailClick = () => {
        setWaitingForAttachment(true);
        checkForNewEmails();
    };
    // Function to send data to API when the button is clicked
    const sendDataToAPI = async () => {
        try {
            const connectedNodes = edges
                .map(edge => {
                    const sourceNode = nodes.find(n => n.id === edge.source);
                    const targetNode = nodes.find(n => n.id === edge.target);
                    return [sourceNode, targetNode];
                })
                .flat()
                .filter(node => node && node.data && node.data.label); // Ensure node and label exist

            if (connectedNodes.length === 0) {
                console.warn("No connected nodes to send.");
                return;
            }

            const payload = connectedNodes.reduce((acc, node, index) => {
                acc[`flow${index + 1}`] = node.data.label;
                return acc;
            }, { created_by: name });

            console.log("Sending Payload:", payload);

            const response = await fetch('http://localhost:5000/api/workflows/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                console.error("API call failed");
            } else {
                alert("API call successful");
                if (payload.flow1 === "Email" && payload.flow2 === "Drive") {
                    handleMailClick();
                }
            }
        } catch (error) {
            console.error("Error calling API:", error);
        }
    };

    const onConnect = useCallback((params) => {
        setEdges((eds) => addEdge(params, eds));
    }, []);

    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback((event) => {
        event.preventDefault();
        if (!type) return;

        const position = screenToFlowPosition({
            x: event.clientX,
            y: event.clientY,
        });

        const newNode = {
            id: getId(),
            type: 'default',
            position,
            data: { label: type }, // Set label based on type
        };

        setNodes((nds) => [...nds, newNode]);
    }, [screenToFlowPosition, type]);

    return (
        <div className="dndflow w-[100%] h-[90%] flex items-center">
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

            {/* Send Button */}


            <div className='w-[20%] h-[100%] flex flex-col items-center '>
                <Sidebar />
                <button
                    className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    onClick={sendDataToAPI}
                >
                    Send
                </button>
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
