import { useState } from "react";
import Papa from "papaparse";
import { importFile } from "../../api/masterApi";

const UploadBankStatement =  ({  }) => {
  const [file, setFile] = useState(null);
  const [donationType, setDonationType] = useState("");
  const userData =   localStorage.getItem("user");
   

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    // if (!file || !ngoId || !donationType) {
    //   alert("Please select a file, NGO ID, and Donation Type.");
    //   return;
    // }

    // const  ngoId =  userData.NGO_ID;
    
    // console.log("donationType - ", donationType);
    // console.log("userData - ", userData);
    // console.log("ngoId - ", ngoId);

    const reader = new FileReader();
    let parsedData = JSON.parse(userData);
    console.log("ngoId - ", parsedData.NGO_ID);
    reader.onload = async (e) => {
      const csvText = e.target.result;

      // Parse CSV using PapaParse
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          const csvData = results.data.map((row) => ({
            txnDate: row["Txn Date"] ? row["Txn Date"].trim() : "",
            description: row["Description"] ? row["Description"].trim() : "",
            transactionID: row["TransactionID"] ? row["TransactionID"].trim() : "",
            amount: row["Amount"] ? row["Amount"].trim() : "",
          }));

          console.log("Parsed CSV Data:", csvData);
          importFile(csvData, parsedData.NGO_ID, donationType); // ✅ Passing donationType from dropdown
        },
        error: (error) => {
          console.error("CSV parsing error:", error);
          alert("Error parsing CSV.");
        },
      });
    };

    reader.readAsText(file);
  };

  return (
    <div className="w-full mx-auto bg-white p-8 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Upload Bank Statement</h2>
      <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6 w-full">
        <label className="w-full md:w-1/2 flex items-center justify-between bg-gray-50 border-2 border-dashed border-gray-300 text-gray-600 rounded-xl cursor-pointer px-4 py-3 hover:bg-gray-100 transition">
          <span className="truncate">{file ? file.name : "Choose File (CSV)"}</span>
          <input type="file" accept=".csv" className="hidden" onChange={handleFileChange} />
        </label>
        <select
          value={donationType}
          onChange={(e) => setDonationType(e.target.value)}
          className="w-full md:w-1/4 bg-white border border-gray-300 text-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500"
        >
          <option value="" disabled>Select Donation Type</option>
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
    </div>
  );
};

export default UploadBankStatement;
