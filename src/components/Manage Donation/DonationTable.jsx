import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Alert,
} from "@mui/material";
import { Edit, Delete, Visibility, Send, Download } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { retrieveDonations, sendEmail } from "../../api/masterApi";
import DonationReceipt from "./Recipt";
import { renderToString } from "react-dom/server";
import { debounce } from "lodash"; // Import lodash for debounce
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import html2pdf from "html2pdf.js";

const DonationTable = ({
  setFormData,
  setShowForm,
  setSelectedDonationTable,
  selectedTransaction,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [donations, setdonations] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const userData = localStorage.getItem("user");

  const [donors, setDonors] = useState([]);
  const [filteredDonors, setFilteredDonors] = useState([]);

  // Pagination Logic
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredDonors.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(filteredDonors.length / rowsPerPage);
  let parsedData = JSON.parse(userData);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getDonationfromServer = async () => {
    const statement = await retrieveDonations();
    setDonors(statement.payload);
    setFilteredDonors(statement.payload);
    console.log(statement, "statement");
    return statement;
  };

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredDonors(donors);
      return;
    }
    debouncedSearch(searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm, donors]); // Also re-run if donations update
  useEffect(() => {
    getDonationfromServer();
  }, []);

  const debouncedSearch = debounce((term) => {
    const filtered = donors.filter(
      (donor) =>
        donor.donorFName.toLowerCase().includes(term.toLowerCase()) ||
        donor.donorLName.toLowerCase().includes(term.toLowerCase()) ||
        donor.donorMobile.includes(term) ||
        donor.donorPAN.includes(term)
    );

    setFilteredDonors(
      filtered.length
        ? filtered
        : [{ donorFName: "No donor found", donorMobile: "-", donorPAN: "-" }]
    );
  }, 300);

  const convertDate = (dateStr) => {
    if (!dateStr) return "";

    console.log("Original Date String:", dateStr);

    const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (isoDateRegex.test(dateStr)) {
      console.log("Input is already in YYYY-MM-DD format.");
      return dateStr;
    }

    const parts = dateStr.split("/");

    if (parts.length !== 3) {
      console.error(
        "Invalid date format. Expected 'DD/MM/YYYY' or 'DD/MM/YY'."
      );
      return "";
    }

    const [day, month, year] = parts;

    if (isNaN(day) || isNaN(month) || isNaN(year)) {
      console.error(
        "Invalid date components. Day, month, and year must be numeric."
      );
      return "";
    }

    const fullYear = year.length === 2 ? `20${year}` : year;

    console.log(
      `Converted Date: ${fullYear}-${month.padStart(2, "0")}-${day.padStart(
        2,
        "0"
      )}`
    );

    return `${fullYear}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  };

  const EditRow = (donation, i) => {
    if (selectedTransaction) {
      // Prevent editing if a transaction is already selected (import in progress)
      alert(
        "Edit Not Allowed", // Title of the alert
        "Import statement is running, can't Edit" // Message body
      );
      return; // Exit the function early
    }
    console.log("row :" + i);
    console.log("Donation row: ", donation);

    const {
      amount,
      bank,
      type,
      purpose,
      project,
      donationDate,
      note,
      transactionID,
    } = donation;
    setFormData({
      amount,
      bank,
      type,
      purpose,
      project,
      donationDate,
      note,
      transactionID: transactionID === null ? "" : transactionID,
    });
    console.log(amount, bank, type, purpose, project, donationDate, note);
    setSelectedDonationTable(donation);
    setShowForm(true);
  };

  const GeneratePdf = (element, donation) => {
    const options = {
      margin: [0, 0, 0, 0],
      filename: `${donation.donorFName}_${donation.donorLName}_${formatDate(
        donation.donationDate
      )}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, scrollX: 0, scrollY: 0 },
      jsPDF: { unit: "pt", format: "a4", orientation: "portrait" },
    };

    const base64Prefix = "data:application/pdf;base64,";

    return new Promise((resolve, reject) => {
      html2pdf()
        .set(options)
        .from(element)
        .toPdf()
        .outputPdf("datauristring")
        .then((dataUri) => {
          // console.log("Generated data URI:", dataUri);
          let base64Content;

          if (dataUri.startsWith(base64Prefix)) {
            base64Content = dataUri.slice(base64Prefix.length);
          } else if (dataUri.includes(",")) {
            base64Content = dataUri.split(",")[1];
          } else {
            reject(new Error("Invalid data URI format"));
          }

          resolve(base64Content);
        })
        .catch((error) => reject(error));
    });
  };

  const formatDate = (isoDateString) => {
    if (!isoDateString) return "";

    const date = new Date(isoDateString);

    if (isNaN(date.getTime())) {
      console.error("Invalid date string provided.");
      return "";
    }

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    const formattedDate = `${day}-${month}-${year}`;

    return formattedDate;
  };

  const pdfViewReceipt = (donation, i) => {
    const receiptHtml = renderToString(
      <DonationReceipt receiptData={donation} />
    );

    const hiddenContainer = document.createElement("div");
    hiddenContainer.style.position = "absolute";
    hiddenContainer.style.top = "-9999px";
    hiddenContainer.style.left = "-9999px";
    hiddenContainer.innerHTML = `
      <div class="receipt-container">
        ${receiptHtml}
      </div>
    `;

    document.body.appendChild(hiddenContainer);

    const style = document.createElement("style");
    style.innerHTML = `
      .receipt-container {
        width: 794px; /* A4 width */
        height: 1123px; /* A4 height */
        background: white;
        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        overflow: hidden; /* Prevent content overflow */
      }
  
      @media print {
        @page { size: A4; margin: 0; }
        body { background: none; }
        .receipt-container {
          width: 100%;
          height: 100%;
          box-shadow: none;
        }
      }
    `;
    document.head.appendChild(style);

    setTimeout(() => {
      const element = hiddenContainer.querySelector(".receipt-container");
      const options = {
        margin: 0,
        filename: "Donation_Receipt.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true }, // Ensures external images load
        jsPDF: { unit: "pt", format: "a4", orientation: "portrait" },
      };

      html2pdf()
        .set(options)
        .from(element)
        .toPdf()
        .get("pdf")
        .then((pdf) => {
          const pdfBlob = pdf.output("blob");
          const pdfUrl = URL.createObjectURL(pdfBlob);
          window.open(pdfUrl, "_blank");
        });

      document.body.removeChild(hiddenContainer);
      document.head.removeChild(style);
    }, 500);
  };
  const pdfDownloadReceipt = (donation, i) => {
    const receiptHtml = renderToString(
      <DonationReceipt receiptData={donation} />
    );

    const hiddenContainer = document.createElement("div");
    hiddenContainer.style.position = "absolute";
    hiddenContainer.style.top = "-9999px";
    hiddenContainer.style.left = "-9999px";
    hiddenContainer.innerHTML = `
      <div class="receipt-container">
        ${receiptHtml}
      </div>
    `;

    document.body.appendChild(hiddenContainer);

    const style = document.createElement("style");
    style.innerHTML = `
      .receipt-container {
        width: 794px; /* A4 width */
        height: 1123px; /* A4 height */
        background: white;
        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        overflow: hidden; /* Prevent content overflow */
      }
  
      @media print {
        @page { size: A4; margin: 0; }
        body { background: none; }
        .receipt-container {
          width: 100%;
          height: 100%;
          box-shadow: none;
        }
      }
    `;
    document.head.appendChild(style);

    setTimeout(() => {
      const element = hiddenContainer.querySelector(".receipt-container");
      const options = {
        margin: 0,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "pt", format: "a4", orientation: "portrait" },
      };

      html2pdf()
        .set(options)
        .from(element)
        .toPdf()
        .get("pdf")
        .then((pdf) => {
          const pdfBlob = pdf.output("blob");
          const pdfUrl = URL.createObjectURL(pdfBlob);
          // window.open(pdfUrl, "_blank");

          setTimeout(() => {
            const a = document.createElement("a");
            a.href = pdfUrl;
            a.download = `${donation.donorFName}_${
              donation.donorLName
            }_${formatDate(donation.donationDate)}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          }, 1000);
        });

      document.body.removeChild(hiddenContainer);
      document.head.removeChild(style);
    }, 500);
  };

  const ShareReceipt = async (i) => {
    try {
      const receiptHtml = renderToString(<DonationReceipt receiptData={i} />);

      const hiddenContainer = document.createElement("div");
      hiddenContainer.style.position = "absolute";
      hiddenContainer.style.top = "-9999px";
      hiddenContainer.style.left = "-9999px";

      hiddenContainer.innerHTML = `
        <div class="receipt-container">
          ${receiptHtml}
        </div>
      `;

      document.body.appendChild(hiddenContainer);

      const style = document.createElement("style");
      style.innerHTML = `
      .receipt-container {
        width: 794px; /* A4 width */
        min-height: 1120px; /* A4 height */
        max-height: 1120px; /* Prevent overflow */
        background: white;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        overflow: hidden;
      }
    
      @media print {
        @page { size: A4; margin: 0; }
        body { background: none; }
        .receipt-container {
          width: 794px;
          height: 1120px;
          overflow: hidden;
          page-break-after: avoid; /* Prevent extra pages */
        }
      }
    `;
      document.head.appendChild(style);

      const receiptElement =
        hiddenContainer.querySelector(".receipt-container");

      receiptElement.style.height = "1123px"; // Force single page
      receiptElement.style.overflow = "hidden"; // Prevent extra content from forcing a new page

      const base64Pdf = await GeneratePdf(receiptElement, i);

      const receiptAttachment = {
        filename: ` ${i.donorFName}_${i.donorLName}_${formatDate(
          i.donationDate
        )}.pdf`,
        contentType: "application/pdf",
        content: base64Pdf,
      };

      const donorDetails = {
        donorFName: i.donorFName,
        donorLName: i.donorLName,
        donorEmail: i.donorEmail,
        ngoName: parsedData.NGO_NAME,
        contactPerson: parsedData.FNAME + " " + parsedData.LNAME,
        ngoContactNo: parsedData.CONTACT_NUMBER,
      };

      console.log(donorDetails, receiptAttachment);

      const response = await sendEmail(donorDetails, receiptAttachment);

      console.log("Email sent successfully:", response);
      alert("Email sent successfully!");
    } catch (error) {
      console.error("Failed to send email:", error);
      alert("Failed to send email. Please try again.");
    }
  };

  return (
    <div className="w-full mx-auto bg-white p-8 rounded-2xl shadow-lg mt-5">
      <div className="flex flex-row justify-between items-center w-full mb-4">
        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-800">Donation Table</h2>

        {/* Next Button */}
        <button
          onClick={() => getDonationfromServer()}
          className="px-4 py-2 bg-blue-700 text-white hover:bg-blue-800 rounded-lg disabled:bg-gray-100 disabled:text-gray-400 transition"
          aria-label="Next Page"
        >
          Refresh
        </button>
      </div>

      <div className="w-full">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Keyword (Name or Mobile No.)"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <TableContainer component={Paper} className="mt-4 shadow-md rounded-lg">
        <Table>
          <TableHead>
            <TableRow className="bg-gray-100">
              <TableCell className="font-semibold text-gray-700">SI</TableCell>
              <TableCell className="font-semibold text-gray-700">
                Receipt No.
              </TableCell>
              <TableCell className="font-semibold text-gray-700">
                Date
              </TableCell>

              <TableCell className="font-semibold text-gray-700">
                Name
              </TableCell>
              <TableCell className="font-semibold text-gray-700">
                Mobile
              </TableCell>
              <TableCell className="font-semibold text-gray-700">PAN</TableCell>
              <TableCell className="font-semibold text-gray-700">
                Amount
              </TableCell>

              <TableCell className="font-semibold text-gray-700">
                Receipt
              </TableCell>

              <TableCell className="font-semibold text-gray-700">
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentRows.map((donation, index) => (
              <TableRow key={index} className="hover:bg-gray-50 transition">
                <TableCell>{index + 1}</TableCell>
                <TableCell>{donation.receiptNumber}</TableCell>
                <TableCell>{formatDate(donation.donationDate)}</TableCell>
                <TableCell>
                  {donation.donorFName} {donation.donorLName}
                </TableCell>
                <TableCell>{donation.donorMobile}</TableCell>
                <TableCell>{donation.donorPAN}</TableCell>
                <TableCell>{donation.amount}</TableCell>
                <TableCell>
                  <IconButton
                    aria-label="visibility"
                    className="text-green-500 hover:text-green-700"
                    onClick={() => {
                      pdfViewReceipt(donation, index);
                    }}
                  >
                    <Visibility />
                  </IconButton>
                  <IconButton
                    aria-label="visibility"
                    className="text-green-500 hover:text-green-700"
                    onClick={() => {
                      pdfDownloadReceipt(donation, index);
                    }}
                  >
                    <Download />
                  </IconButton>
                  <IconButton
                    aria-label="send mail"
                    className="text-green-500 hover:text-green-700"
                    onClick={() => {
                      ShareReceipt(donation);
                    }}
                  >
                    <Send />
                  </IconButton>
                </TableCell>

                <TableCell>
                  <div className="flex space-x-2">
                    <IconButton
                      aria-label="edit"
                      className="text-blue-500 hover:text-blue-700"
                      onClick={() => {
                        EditRow(donation, index);
                      }}
                    >
                      <Edit />
                    </IconButton>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* Pagination Controls */}
      <div className="flex justify-center mt-4 space-x-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:bg-gray-100 disabled:text-gray-400"
        >
          Previous
        </button>
        <span className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:bg-gray-100 disabled:text-gray-400"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default DonationTable;
