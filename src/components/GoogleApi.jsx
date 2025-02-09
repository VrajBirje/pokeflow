import axios from "axios";

// Gmail API Base URL
const GMAIL_API_URL = "https://www.googleapis.com/gmail/v1/users/me";
export const addEventToCalendar = async (token, event) => {
    const response = await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(event),
    });

    return await response.json();
};

  
export const uploadToDrive = async (token, file, filename) => {
    const metadata = {
        name: filename,
        mimeType: file.type,
    };

    const formData = new FormData();
    formData.append("metadata", new Blob([JSON.stringify(metadata)], { type: "application/json" }));
    formData.append("file", file);

    const response = await fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
    });

    return await response.json();
};

export const writeToSheet = async (token, spreadsheetId, values) => {
    const range = "Sheet1!A:B"; // Adjust range if needed

    try {
        const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}:append?valueInputOption=RAW`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ values }),
        });

        if (!response.ok) {
            console.error("Error writing to Google Sheets:", response.status, response.statusText);
            return null;
        }

        return await response.json();
    } catch (error) {
        console.error("Fetch error:", error);
        return null;
    }
};


// export const uploadToDrive = async (token, fileName, fileData) => {
//     const metadata = {
//         name: fileName,
//         mimeType: "application/octet-stream"
//     };

//     const formData = new FormData();
//     formData.append("metadata", new Blob([JSON.stringify(metadata)], { type: "application/json" }));
//     formData.append("file", new Blob([fileData], { type: "application/octet-stream" }));

//     try {
//         const response = await fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart", {
//             method: "POST",
//             headers: { Authorization: `Bearer ${token}` },
//             body: formData
//         });

//         const data = await response.json();
//         console.log("Drive upload response:", data);
//         return data.id; // Return file ID
//     } catch (error) {
//         console.error("Error uploading file to Drive:", error);
//         return null;
//     }
// };
// export const writeToSheet = async (token, values) => {
//     const spreadsheetId = "YOUR_SPREADSHEET_ID"; // Replace with your Google Sheets ID
//     const range = "Sheet1!A1:B1"; // Adjust range if needed

//     const body = {
//         values: values
//     };

//     try {
//         const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}:append?valueInputOption=RAW`, {
//             method: "POST",
//             headers: {
//                 "Authorization": `Bearer ${token}`,
//                 "Content-Type": "application/json"
//             },
//             body: JSON.stringify(body)
//         });

//         const data = await response.json();
//         console.log("Sheet update response:", data);
//         return data;
//     } catch (error) {
//         console.error("Error writing to Google Sheets:", error);
//     }
// };

// Function to fetch unread emails with attachments
export const fetchEmails = async (accessToken) => {
    try {
        const response = await axios.get(`${GMAIL_API_URL}/messages`, {
            headers: { Authorization: `Bearer ${accessToken}` },
            params: { q: "is:unread has:attachment" }, // Only unread emails with attachments
        });

        if (!response.data?.messages || response.data.messages.length === 0) {
            console.log("No new emails with attachments.");
            return [];
        }

        // Fetch full details for each email
        const emails = await Promise.all(
            response.data.messages.map(async (msg) => {
                const emailData = await axios.get(`${GMAIL_API_URL}/messages/${msg.id}`, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });

                const parts = emailData.data?.payload?.parts || [];
                const attachments = parts
                    .filter((part) => part.body?.attachmentId)
                    .map((part) => ({
                        id: part.body.attachmentId,
                        filename: part.filename,
                        mimeType: part.mimeType,
                    }));

                return { id: msg.id, attachments };
            })
        );

        return emails;
    } catch (error) {
        console.error("Error fetching emails:", error.response?.data || error.message);
        return [];
    }
};

// Function to download an attachment
export const downloadAttachment = async (accessToken, messageId, attachmentId, filename) => {
    try {
        const response = await axios.get(`${GMAIL_API_URL}/messages/${messageId}/attachments/${attachmentId}`, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (!response.data?.data) {
            console.error("No attachment data found.");
            return;
        }

        // Decode Base64 safely (Fix for large attachments)
        const byteCharacters = atob(response.data.data.replace(/-/g, "+").replace(/_/g, "/"));
        const byteNumbers = new Array(byteCharacters.length)
            .fill(0)
            .map((_, i) => byteCharacters.charCodeAt(i));
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: "application/octet-stream" });

        // Create a link element and trigger download
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        console.log("Attachment downloaded:", filename);
    } catch (error) {
        console.error("Error downloading attachment:", error.response?.data || error.message);
    }
};
