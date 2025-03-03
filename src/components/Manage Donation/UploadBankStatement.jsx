import { useEffect, useState } from "react";
import Papa from "papaparse";
import { importFile, getStatement } from "../../api/masterApi";

const UploadBankStatement = ({
  onSelectTransaction,
  selectedTransaction,
  setSelectedDonationTable,
  setisSearchDisable,
  setShowForm,
}) => {
  const [file, setFile] = useState(null);
  const [donationType, setDonationType] = useState("");
  const [csvData, setCsvData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // State for current page
  const rowsPerPage = 5; // Number of rows to display per page
  const userData = localStorage.getItem("user");

  const getStatementfromServer = async () => {
    const statement = await getStatement();
    setCsvData(statement.payload);
    console.log(statement);
    return statement;
  };

  useEffect(() => {
    getStatementfromServer();
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file.");
      return;
    }
    if (!donationType) {
      alert("Please select a donationType.");
      return;
    }

    const reader = new FileReader();
    let parsedData = JSON.parse(userData);
    console.log("ngoId - ", parsedData.NGO_ID);

    reader.onload = async (e) => {
      const csvText = e.target.result;

      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          const data = results.data.map((row) => ({
            txnDate: row["Txn Date"] ? row["Txn Date"].trim() : "",
            description: row["Description"] ? row["Description"].trim() : "",
            transactionID: row["TransactionID"]
              ? row["TransactionID"].trim()
              : "",
            amount: row["Amount"] ? row["Amount"].trim() : "",
          }));

          getStatementfromServer();
          importFile(data, parsedData.NGO_ID, donationType);
          console.log("Parsed CSV Data:", data);
        },
        error: (error) => {
          console.error("CSV parsing error:", error);
          alert("Error parsing CSV.");
        },
      });
    };
    reader.readAsText(file);
  };

  const handleAdd = async (item) => {
    console.log(item);
    if (selectedTransaction) {
      onSelectTransaction(null);
      return;
    }
    const data = {
      txnDate: item.donationDate,
      description: item.transactionID,
      transactionID: item.transactionID,
      amount: item.amount,
      statementID: item.statementID,
    };
    setSelectedDonationTable(null);
    setisSearchDisable(false);
    setShowForm(true);
    onSelectTransaction(data);
    console.log(data);
  };

  // Pagination Logic
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = csvData.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(csvData.length / rowsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="w-full mx-auto bg-white p-8 rounded-2xl shadow-lg">
      <div className="flex flex-row justify-between items-center w-full mb-4">
        {/* Title */}
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Upload Bank Statement
        </h2>

        {/* Next Button */}
        {/* <button
          onClick={() => getStatementfromServer()}
          className="px-4 py-2 bg-blue-700 text-white hover:bg-blue-800 rounded-lg disabled:bg-gray-100 disabled:text-gray-400 transition"
          aria-label="Next Page"
        >
          Refresh
        </button> */}
      </div>
      <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6 w-full">
        <label className="w-full md:w-1/2 flex items-center justify-between bg-gray-50 border-2 border-dashed border-gray-300 text-gray-600 rounded-xl cursor-pointer px-4 py-3 hover:bg-gray-100 transition">
          <span className="truncate">
            {file ? file.name : "Choose File (CSV)"}
          </span>
          <input
            type="file"
            accept=".csv"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
        <select
          value={donationType}
          onChange={(e) => setDonationType(e.target.value)}
          className="w-full md:w-1/4 bg-white border border-gray-300 text-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500"
        >
          <option value="" disabled>
            Select Donation Type
          </option>
          <option value="FCRA">FCRA Donation</option>
          <option value="Domestic">Domestic Donation</option>
        </select>
        <button
          onClick={handleUpload}
          className="w-full md:w-1/6 bg-blue-600 text-white rounded-xl px-4 py-3 hover:bg-blue-700 transition"
        >
          Import
        </button>
      </div>

      {csvData.length > 0 && (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2">SI</th>
                <th className="border border-gray-300 px-4 py-2">Txn Date</th>
                <th className="border border-gray-300 px-4 py-2">
                  Transaction ID
                </th>
                <th className="border border-gray-300 px-4 py-2">Amount</th>
                <th className="border border-gray-300 px-4 py-2">
                  Donation Type
                </th>
                <th className="border border-gray-300 px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentRows.map((row, index) => (
                <tr
                  key={index}
                  className="text-center border-b border-gray-200"
                >
                  <td className="border border-gray-300 px-4 py-2">
                    {row.statementID}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {row.donationDate}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {row.transactionID}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {row.amount}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {row.donationType}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {selectedTransaction && index === 0 ? (
                      <button
                        onClick={() => handleAdd(row)}
                        disabled={index !== 0}
                        className={`${
                          index == 0 ? "bg-red-500" : "bg-slate-300"
                        } ${
                          index == 0 ? "text-white" : "text-black"
                        } px-4 py-2 rounded-lg ${
                          index == 0 ? "hover:bg-red-600" : "hover:bg-slate-300"
                        } transition`}
                      >
                        Remove
                      </button>
                    ) : (
                      <button
                        onClick={() => handleAdd(row)}
                        disabled={index !== 0}
                        className={`${
                          index == 0 ? "bg-green-500" : "bg-slate-300"
                        } ${
                          index == 0 ? "text-white" : "text-black"
                        } px-4 py-2 rounded-lg ${
                          index == 0
                            ? "hover:bg-green-600"
                            : "hover:bg-slate-300"
                        } transition`}
                      >
                        Add
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
      )}
    </div>
  );
};

export default UploadBankStatement;
