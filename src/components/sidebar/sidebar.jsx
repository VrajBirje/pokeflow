import React, { useState, useEffect } from 'react';
import img from '../../assets/image.png';
import { HiChartPie } from "react-icons/hi";
import { MdInventory } from "react-icons/md";
import { FaAngleRight } from "react-icons/fa";
import { LuWorkflow } from "react-icons/lu";
import { HiMenu } from "react-icons/hi";
import { MdOutlineDocumentScanner } from 'react-icons/md';
import { IoMailOutline } from "react-icons/io5";
import { AiOutlineAppstoreAdd } from "react-icons/ai";
import { RiShoppingCart2Line } from "react-icons/ri";
import { MdOutlineInventory2 } from "react-icons/md";
import { VscPieChart } from "react-icons/vsc";
import { fetchEmails, downloadAttachment } from '../GoogleApi'; // Ensure correct path
import './sidebar.css';

const Sidebar = () => {
    const [waitingForAttachment, setWaitingForAttachment] = useState(false);

    const checkForNewEmails = async () => {
        const token = localStorage.getItem("google_access_token");
        if (!token) return;

        let hasAttachments = false;

        while (!hasAttachments) {
            console.log("Checking for new emails...");
            const emails = await fetchEmails(token);

            const emailWithAttachment = emails.find(email => email.attachments?.length > 0);

            if (emailWithAttachment) {
                hasAttachments = true;
                console.log("Attachment found! Downloading...");

                // Download all attachments
                for (const attachment of emailWithAttachment.attachments) {
                    await downloadAttachment(token, emailWithAttachment.id, attachment.id, attachment.filename);
                }

                alert("Attachment downloaded successfully!");
                setWaitingForAttachment(false);
            } else {
                console.log("No attachments yet, waiting...");
                await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10 sec before rechecking
            }
        }
    };

    const handleMailClick = () => {
        setWaitingForAttachment(true);
        checkForNewEmails();
    };

    return (
        <div className='sidebar w-[20%] h-[100vh] text-white'>
            <div className='s-head'>
                <HiMenu size={25} />
                <h2 className="heading text-4xl font-bold">
                    <a href="/">taskify</a>
                </h2>
            </div>
            <div className='dash-items'>
                <a href="/dashboard" className='dash-1'>
                    <div className='content'>
                        <VscPieChart size={26} />
                        Dashboard
                    </div>
                    <FaAngleRight className='pt-[6px] items-end' size={26} />
                </a>
                <a href="/dashboard/add" className='dash-1'>
                    <div className='content'>
                        <LuWorkflow size={25} />
                        Add Workflows
                    </div>
                    <FaAngleRight className='pt-[6px]' size={26} />
                </a>
                <a href="/email" className='dash-1'>
                    <div className='content'>
                        <IoMailOutline size={24} />
                        Mail Attachments
                    </div>
                    <FaAngleRight className='pt-[6px]' size={26} />
                </a>
                <a href="/bill" className='dash-1'>
                    <div className='content'>
                        <MdOutlineDocumentScanner size={24} />
                        Bill Scanner
                    </div>
                    <FaAngleRight className='pt-[6px]' size={26} />
                </a>
                <a href="/inventory" className='dash-1'>
                    <div className='content'>
                        <MdOutlineInventory2 size={24} />
                        My Inventory
                    </div>
                    <FaAngleRight className='pt-[6px]' size={26} />
                </a>
                <a href="/email" className='dash-1'>
                    <div className='content'>
                        <RiShoppingCart2Line size={24} />
                        Marketplace
                    </div>
                    <FaAngleRight className='pt-[6px]' size={26} />
                </a>
                <a href="/connnectedapps" className='dash-1'>
                    <div className='content'>
                        <AiOutlineAppstoreAdd size={24} />
                        Connected Apps
                    </div>
                    <FaAngleRight className='pt-[6px]' size={26} />
                </a>
            </div>
            {waitingForAttachment && <p className="text-yellow-400 text-sm mt-2">Waiting for email with attachment...</p>}
        </div>
    );
};

export default Sidebar;
