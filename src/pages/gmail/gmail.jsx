import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/sidebar/sidebar';
import './gmail.css';
import { fetchEmails, downloadAttachment, uploadToDrive, writeToSheet, addEventToCalendar } from '../../components/GoogleApi';
import { IoMdMail } from 'react-icons/io';
import GoogleAuth from '../../components/api_int/GoogleAuth';
import OCRScanner from '../../components/ocr';

const checkForNewEmails = async () => {
  let token = localStorage.getItem("google_access_token");

  if (!token) {
    alert("Please authenticate with Google first.");
    return;
  }

  console.log("Checking for new emails...");
  const emails = await fetchEmails(token);

  if (emails.length === 0) {
    console.log("No emails found.");
    return;
  }

  console.log("Emails:", emails);
};

const Gmail = () => {
  const [token, setToken] = useState(null);
  const [waitingForAttachment, setWaitingForAttachment] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("google_access_token");
    if (storedToken) {
      setToken(storedToken);
      console.log("Google Access Token:", storedToken);
    }
  }, []);

  const checkForNewEmails = async () => {
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
        let emailText = emailWithAttachment.body || "No text available";
        let emailSubject = emailWithAttachment.subject || "No Subject";
        let emailDate = new Date(emailWithAttachment.date);

        for (const attachment of emailWithAttachment.attachments) {
          const fileData = await downloadAttachment(token, emailWithAttachment.id, attachment.id, attachment.filename);

          console.log("Uploading to Drive...");
          const driveFileId = await uploadToDrive(token, attachment.filename, fileData);
          console.log(`File uploaded to Drive: ${driveFileId}`);

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
        await new Promise(resolve => setTimeout(resolve, 5000)); 
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
        <div className='w-[100%] font-bold mb-10 flex justify-start items-center text-3xl text-[#F1E0C6]'>
          Mail Attachments
        </div>
        <div className='mail w-[100%] mb-10 flex justify-end items-center pt-40 '>
          <GoogleAuth setToken={setToken} /> 
          <button onClick={handleMailClick} className='mail-btn cursor-pointer'>
            <div className='content'>
              <img src='/gmail.svg' width='35px' />
              Mail Attachment
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Gmail;
