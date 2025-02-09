import React, { useState, useEffect } from 'react';
import img from '../../assets/image.png';
import { HiChartPie } from "react-icons/hi";
import { MdInventory } from "react-icons/md";
import { FaAngleRight } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";
import { HiMenu } from "react-icons/hi";
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
                <h2 className="heading text-4xl font-bold">Taskify</h2>
            </div>
            <div className='dash-items'>
                <a href="/dashboard" className='dash-1'>
                    <div className='content'>
                        <HiChartPie size={25} />
                        Dashboard
                    </div>
                    <FaAngleRight className='pt-[6px] items-end' size={26} />
                </a>
                <a href="/dashboard" className='dash-1'>
                    <div className='content'>
                        <MdInventory size={25} />
                        My Inventory
                    </div>
                    <FaAngleRight className='pt-[6px]' size={26} />
                </a>
                <a href="/email" className='dash-1'>
                    <div className='content'>
                        <IoMdMail size={24} />
                        Mail
                    </div>
                    <FaAngleRight className='pt-[6px]' size={26} />
                </a>
                {/* <button onClick={handleMailClick} className='dash-1'>
                    <div className='content'>
                        <IoMdMail size={24} />
                        Mail
                    </div>
                    <FaAngleRight className='pt-[6px]' size={26} />
                </button> */}
            </div>
            {waitingForAttachment && <p className="text-yellow-400 text-sm mt-2">Waiting for email with attachment...</p>}
        </div>
    );
};

export default Sidebar;
