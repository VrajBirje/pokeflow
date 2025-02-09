import React, { useEffect, useState } from "react";
import Tesseract from "tesseract.js";
import moment from "moment"; // Install moment.js for date validation: npm install moment
import axios from "axios";
import Modal from "react-modal";
import { toast } from "react-hot-toast";

const ItemModal = ({ show, setShow }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    unit_id: "",
    price: "",
    quantity: "",
    rsc_id: "0",
    created_by: 1,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const accountData = localStorage.getItem("account");
    const account = accountData ? JSON.parse(accountData) : null;
    const token = account?.token || ""; // Use optional chaining and default value

    console.log(token || "Token not found in localStorage");

    try {
      const response = await axios.post(
        "http://localhost:3000/api/inventory/raw-items",
        { ...formData },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Axios automatically throws error for non-2xx status codes, so no need for response.ok
      setShow(false); // Close modal on successful submission
      if (response) {
        alert("Item added successfully!");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    show && (
      <Modal
        isOpen={show}
        onRequestClose={() => setShow(false)}
        style={{
          overlay: { backgroundColor: "rgba(0,0,0,0.5)" },
          content: {
            margin: "auto",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          },
        }}
      >
        <h1>Add New Item</h1>
        <form onSubmit={handleSubmit} style={{ width: "80%", color: "black" }}>
          <label className="text-black">
            Name:
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="text-black"
              style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
            />
          </label>

          <label className="text-black">
            Description:
            <input
              type="text"
              name="description"
              className="text-black"
              value={formData.description}
              onChange={handleChange}
              required
              style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
            />
          </label>

          <label className="text-black">
            Unit ID:
            <input
              type="text"
              name="unit_id"
              className="text-black"
              value={formData.unit_id}
              onChange={handleChange}
              required
              style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
            />
          </label>

          <label className="text-black">
            Price:
            <input
              type="number"
              name="price"
              className="text-black"
              value={formData.price}
              onChange={handleChange}
              required
              style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
            />
          </label>

          <label className="text-black">
            Quantity:
            <input
              type="number"
              name="quantity"
              className="text-black"
              value={formData.quantity}
              onChange={handleChange}
              required
              style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
            />
          </label>
          <div>
            <button
              type="submit"
              style={{
                padding: "10px 20px",
                backgroundColor: "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Submit
            </button>
            <button
              type="button"
              onClick={() => setShow(false)}
              style={{
                padding: "10px 20px",
                backgroundColor: "#ff4d4d",
                color: "white",
                border: "none",
                borderRadius: "5px",
                marginLeft: "10px",
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>
        </form>
      </Modal>
    )
  );
};

const OCRScanner = () => {
  const [image, setImage] = useState(null);
  const [parsedData, setParsedData] = useState({});
  const [rawText, setRawText] = useState("");
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const itemsNotInclude = [
    "total",
    "sub total",
    "cgst",
    "sgst",
    "st",
    "@",
    "discount",
  ];

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  useEffect(() => {
    const loadingToast = toast.loading("Fetching updates...");
    const accountData = localStorage.getItem("account");
    const account = accountData ? JSON.parse(accountData) : null;
    const token = account?.token || ""; // Use optional chaining and default value

    console.log(token || "Token not found in localStorage");

    const getRawItems = async () => {
      const responses = await Promise.all(
        parsedData.items.map(async (item) => {
          const res = await axios.post(
            "http://localhost:3000/api/inventory/raw-items-by-name",
            {
              name: item.name.toLowerCase(),
            },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          return res.data; // Adjust based on API response structure
        })
      );
      console.log(responses);
      const res = await Promise.all(
        responses.map(async (item, index) => {
          console.log(item);

          if (item.success == true) {
            const res = await axios.put(
              `http://localhost:3000/api/inventory/raw-items/${item.data.r_id}`,
              {
                quantity:
                  parseInt(item.data.quantity) +
                  parseInt(parsedData.items[index].quantity),
              },
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
              }
            );
          } else {
            setShow(true);
          }
        })
      );
      if (res) {
        toast.success("Item added successfully!");
      }
    };
    toast.dismiss(loadingToast);
    getRawItems();
  }, [parsedData]);
  const handleScan = async () => {
    if (!image) {
      alert("Please upload an image first!");
      return;
    }

    setLoading(true);
    Tesseract.recognize(image, "eng", {})
      .then(({ data: { text } }) => {
        setRawText(text); // Save raw OCR output
        const extractedData = extractBillDetails(text);
        console.log("Extracted data:", extractedData);
        setParsedData(extractedData);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const extractBillDetails = (text) => {
    const lines = text.split("\n");
    const result = {
      seller: "",
      date: "",
      items: [],
      total: 0, // Initialize total as 0
    };

    // Extract seller information (assuming it's on the first line)
    if (lines.length > 0) result.seller = lines[0];

    // Extract date (enhanced with multiple formats)
    const dateRegex =
      /\b(\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4}|[A-Za-z]{3,9} \d{1,2}, \d{4})\b/;
    const dateMatch = text.match(dateRegex);
    if (dateMatch) {
      const rawDate = dateMatch[0];
      if (isValidDate(rawDate)) {
        result.date = formatDate(rawDate);
      } else {
        console.warn("Date found but invalid:", rawDate);
      }
    }

    // Extract items (EXCLUDING words from itemsNotInclude)
    const itemRegex = /(.+?)\s+(\d+)\s+([\d.,]+)/; // Format: Item Name  Quantity  Price
    lines.forEach((line) => {
      const match = line.match(itemRegex);
      if (match) {
        const itemName = match[1].trim().toLowerCase();
        const quantity = match[2];
        const price = parseFloat(match[3].replace(/,/g, "")) || 0; // Convert price to float

        // Check if item name CONTAINS any excluded word
        const shouldInclude = !itemsNotInclude.some((word) =>
          itemName.includes(word)
        );

        if (shouldInclude) {
          result.items.push({
            name: match[1].trim(),
            quantity,
            price,
          });

          // **Add the price to the total**
          result.total += price;
        }
      }
    });

    console.log(result.items);
    return result;
  };

  const isValidDate = (dateString) => {
    // Validate date using moment.js or JavaScript's Date object
    return moment(
      dateString,
      ["MM/DD/YYYY", "DD/MM/YYYY", "DD/MM/YY", "YYYY-MM-DD", "MMMM DD, YYYY"],
      true
    ).isValid();
  };

  const formatDate = (dateString) => {
    // Format date to a consistent output like YYYY-MM-DD
    return moment(dateString, [
      "MM/DD/YYYY",
      "DD/MM/YYYY",
      "YYYY-MM-DD",
      "MMMM DD, YYYY",
    ]).format("YYYY-MM-DD");
  };
  const [isChecked, setIsChecked] = useState(false);

  return (
    <div className="p-6 max-w-4xl min-w-[35%] mx-auto bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-center mb-6">OCR Bill Scanner</h1>
      <div className="mb-6">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="mb-4 block w-full text-sm text-gray-600 border border-gray-300 rounded px-3 py-2"
        />
        <button
          onClick={handleScan}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        >
          {loading ? "Scanning..." : "Scan Bill"}
        </button>
      </div>

      <div className="flex space-x-8 h-fit">
        {/* Left side: Bill Image */}
        <div className="flex-none w-1/2">
          {image && (
            <img
              src={image}
              alt="Uploaded preview"
              className="h-[50%] max-w-md mx-auto rounded-lg"
            />
          )}
        </div>
        <ItemModal show={show} setShow={setShow} />

        {/* Right side: Extracted Data */}
        <div className="flex-1 h-fit">
          {rawText && (
            <div style={{ color: "black" }}>
              <h2 className="text-2xl font-semibold mb-4">Extracted Details</h2>
              <div className="space-y-2">
                <p>
                  <strong>Seller:</strong> {parsedData.seller || "Not found"}
                </p>
                <p>
                  <strong>Date:</strong> {parsedData.date || "Not found"}
                </p>
                <p>
                  <strong>Items:</strong>
                </p>
                <ul className="list-disc pl-6 text-[14px]">
                  {parsedData.items?.map((item, index) => (
                    <li key={index}>
                      {item.name} - Qty: {item.quantity}, Price: {item.price}
                    </li>
                  ))}
                </ul>
                <p>
                  <strong>Total:</strong>{" "}
                  {parsedData.total.toFixed(2) || "Not found"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OCRScanner;