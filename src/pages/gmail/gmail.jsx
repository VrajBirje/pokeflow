import React, { useState } from 'react';
import Sidebar from '../../components/sidebar/sidebar';
import './gmail.css';
import { fetchEmails, downloadAttachment, uploadToDrive, writeToSheet ,addEventToCalendar } from '../../components/GoogleApi';
import { IoMdMail } from 'react-icons/io';
import GoogleAuth from '../../components/api_int/GoogleAuth';
import OCRScanner from '../../components/ocr';

const Gmail = () => {
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

  return (
    <div className='w-[100vw] h-[100vh] flex gap-0 items-center'>
      <Sidebar />
      <div className='body w-[80%] h-[100vh] bg-black px-20 py-10'>
        <div className='w-[100%] font-bold mb-10 flex justify-start items-center text-3xl text-white'>
          Gmail
        </div>
        <div className='mail w-[100%] mb-10 flex justify-end items-center'>
          <button onClick={handleMailClick} className='dash-1 cursor-pointer'>
            <div className='content '>
             <img src='/gmail.svg'/>
              Mail
            </div>
          </button>
          <GoogleAuth/>
        </div>
        <OCRScanner/>
      </div>
    </div>
  );
};

export default Gmail;