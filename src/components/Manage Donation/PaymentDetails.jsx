import { useEffect, useState } from "react";
import { getDonorData, handleDonationRequest } from "../../api/masterApi";
import { useSelector } from "react-redux";
import Decrypt from "../../Decrypt";

const PaymentDetails = ({
  selectedTransaction,
  isSearchDisable,
  setisSearchDisable,
  setSelectedTransaction,
  selectedDonationTable,
  setSelectedDonationTable,
  formData,
  setFormData,
  showForm,
  setShowForm,
  onSubmit,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [donors, setDonors] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [allDonars, setallDonars] = useState([]);
  const [selectedDonar, setSelectedDonar] = useState("");
  const encryptedUserData = useSelector((state) => state.userData);
  const [SelectedDonarID, setSelectedDonarID] = useState("");

  const userData = Decrypt(encryptedUserData);
  let parsedData = JSON.parse(userData);

  const fetchDonors = async () => {
    let ngoID = parsedData.NGO_ID;
    try {
      const response = await getDonorData({ ngoID }, "list");
      console.log("Donor List - ", response);
      if (response && Array.isArray(response.payload)) {
        console.log(response.payload);
        setallDonars(response.payload);
      }
    } catch (error) {
      throw new Error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (selectedTransaction) {
      setSelectedRow([]);
      console.log("Selected Transaction:", selectedTransaction);
      setFormData((prev) => ({
        ...prev,
        amount: selectedTransaction?.amount || "",
        // donationDate: selectedTransaction?.donationDate || "",
        donationDate: selectedTransaction?.txnDate
          ? convertDate(selectedTransaction.txnDate)
          : "",
        type: "E-Transfer",
        transactionID: selectedTransaction?.transactionID || "",
      }));

      if (selectedTransaction?.description) {
        const extractedUPI = extractUPIDetails(selectedTransaction.description);
        console.log(extractedUPI);
        setSearchTerm(extractedUPI.name);
        handleSearch();
      }
    }
  }, [selectedTransaction]);

  useEffect(() => {
    fetchDonors();
    console.log(parsedData, "user");
  }, []);

  // Trigger search automatically when searchTerm changes
  // useEffect(() => {
  //   if (searchTerm.trim()) {
  //     handleSearch();
  //   }
  // }, [searchTerm]);

  // const allDonors = [
  //   { name: "John Doe", mobile: "1234567890", pan: "ABCDE1234F" },
  //   { name: "RUSHIKES", mobile: "1234567890", pan: "ABCDE1234F" },
  //   { name: "RUSHIKESHJHA", mobile: "1234567891", pan: "ABCDE12345" },
  //   { name: "RUSHIKESHJHA", mobile: "1234567892", pan: "ABCDE12345" },
  //   { name: "RUSHIKESHJHA", mobile: "1234567893", pan: "ABCDE12345" },
  //   { name: "RUSHIKESHJHA", mobile: "1234567894", pan: "ABCDE12345" },
  //   { name: "RUSHIKESHJHA", mobile: "1234567895", pan: "ABCDE12345" },
  //   { name: "RUSHIKESHJHA", mobile: "1234567896", pan: "ABCDE12345" },
  //   { name: "RUSHIKESHJHA", mobile: "1234567897", pan: "ABCDE12345" },
  //   { name: "Jane Smith", mobile: "9876543210", pan: "XYZW5678K" },
  // ];

  const projectPurposes = parsedData?.PROJECTS?.reduce((acc, project) => {
    acc[project.PROJECT_NAME] = project.PURPOSES.map((p) => p.PURPOSE_NAME);
    return acc;
  }, {});

  const handleSearch = () => {
    if (searchTerm.trim() === "") {
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const filteredDonors = allDonars.filter(
        (donor) =>
          donor.donorFName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          donor.donorLName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          donor.donorPAN.toLowerCase().includes(searchTerm.toLowerCase()) ||
          donor.donorMobile.toLowerCase().includes(searchTerm.toLowerCase())
      );

      if (filteredDonors.length === 0) {
        setDonors([{ name: "No donor found", mobile: "-", pan: "-" }]);
        // setShowForm(false);
      } else {
        console.log(filteredDonors);
        setDonors(filteredDonors);
      }

      setLoading(false);
    }, 1500);
  };
  const resetForm = () => {
    setFormData({
      amount: "",
      bank: "",
      type: "",
      purpose: "",
      project: "",
      donationDate: "",
      note: "",
      transactionID: "",
      Fname: "",
      Lname: "",
    });
    setSelectedRow(null);
    setSearchTerm("");
    setShowForm(false);
    setSelectedTransaction(null);
  };

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

  const handleCheckboxChange = (donor) => {
    if (selectedRow === donor) {
      handleCancel();
    } else {
      setSelectedDonarID(donor.donorID);
      setSelectedRow(donor);
      setSelectedDonar(donor.donorFName + " " + donor.donorLName);
      setShowForm(true);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "project" && { purpose: "" }),
    }));
  };

  const handleCancel = () => {
    setShowForm(false);
    resetForm();
    setSelectedRow(null);
    setFormData({
      amount: "",
      bank: "",
      type: "",
      purpose: "",
      project: "",
      donationDate: "",
      note: "",
      transactionID: "",
      Fname: "",
      Lname: "",
    });
  };

  const handleSubmit = () => {
    const NGO_ID = Decrypt(encryptedUserData);
    const parsedData = JSON.parse(NGO_ID);
    const { amount, bank, type, purpose, project, donationDate, note } =
      formData;
    console.log(selectedDonationTable, "editTable");
    console.log(selectedRow, "transaction");

    const data = {
      ngoID: parsedData.NGO_ID.toString(),
      amount,
      bank,
      type,
      purpose,
      project,
      note,
      donationDate,
    };

    const donorID =
      selectedDonationTable?.donorID ?? selectedRow?.donorID ?? "";
    if (donorID === "") {
      alert("Please select a donor from the table");
      return;
    }

    const reqType = selectedDonationTable ? "u" : "s";

    if (selectedTransaction) {
      data.statementID = selectedTransaction.statementID.toString();
      data.transactionID = selectedTransaction.transactionID;
    }
    if (reqType === "u") {
      data.donationID = selectedDonationTable.donationID;
    }
    if (SelectedDonarID) {
      console.log(SelectedDonarID);
      data.donorID = SelectedDonarID;
    } else {
      data.donorID = selectedDonationTable
        ? selectedDonationTable.donorID
        : selectedRow.donorID;
    }

    console.log(data);

    handleDonationRequest(data, reqType)
      .then((response) => {
        console.log("Success:", response);
        if (onSubmit) {
          setSelectedDonar("");
          resetForm();
          onSubmit();
        }
        resetForm();
      })
      .catch((error) => console.error("Error:", error));
  };

  const extractUPIDetails = (upiString) => {
    const details = upiString.split("/");
    return {
      type: details[0] || "",
      mode: details[1] || "",
      transactionId: details[2] || "",
      name: details[3] || "",
      bankCode: details[4] || "",
      upiId: details[5] || "",
      method: details[6] || "",
    };
  };

  // Pagination

  const [currentPage, setCurrentPage] = useState(1);
  const donorsPerPage = 5; // Number of articles per page

  // Get current page articles
  const startIndex = (currentPage - 1) * donorsPerPage;
  const endIndex = startIndex + donorsPerPage;
  const currentDonors = donors.slice(startIndex, endIndex);

  // Handle Pagination
  const totalPages = Math.ceil(donors.length / donorsPerPage);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="w-full mx-auto bg-white p-8 rounded-2xl shadow-lg mt-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Payment Details</h2>
      <div className="flex flex-col justify-between items-start gap-6">
        <div className="w-full">
          <h3 className="font-semibold text-gray-800">
            Enter Keyword (Search)
          </h3>
          <p className="text-gray-500 text-sm mb-2">
            (Name, Pan, or Mobile No.)
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Keyword (Name, Pan or Mobile No.)"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                // if (searchTerm !== "") {
                //   setisSearchDisable(false);
                // }
              }}
            />
            <button
              onClick={() => {
                setFormData({
                  amount: "",
                  bank: "",
                  type: "",
                  purpose: "",
                  project: "",
                  donationDate: "",
                  note: "",
                  transactionID: "",
                  Fname: "",
                  Lname: "",
                });
                setSelectedRow(null);
                setSearchTerm("");
                setShowForm(false);
                setSelectedTransaction(null);
              }}
              className={`px-4 py-2 rounded-lg text-white transition ${
                searchTerm.trim()
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-slate-300 cursor-not-allowed"
              }`}
            >
              Reset
            </button>
            <button
              onClick={handleSearch}
              disabled={!searchTerm.trim() || setisSearchDisable}
              className={`px-4 py-2 rounded-lg text-white transition ${
                searchTerm.trim()
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-slate-300 cursor-not-allowed"
              }`}
            >
              Search
            </button>
          </div>
        </div>
        {searchTerm.trim() && (
          <div className="w-full">
            <h3 className="font-semibold text-gray-800">Donor List</h3>
            <p className="text-gray-500 text-sm mb-2">------</p>

            {loading && (
              <div className="flex justify-center my-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            )}

            {!loading && donors.length > 0 && (
              <div className="overflow-x-auto">
                {currentDonors.length === 0 ||
                currentDonors[0].name === "No donor found" ? (
                  <p className="text-center text-gray-500 py-4">
                    No donors found.
                  </p>
                ) : (
                  <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="py-3 px-4 text-left font-semibold text-gray-600">
                          Name
                        </th>
                        <th className="py-3 px-4 text-left font-semibold text-gray-600">
                          Mobile
                        </th>
                        <th className="py-3 px-4 text-left font-semibold text-gray-600">
                          PAN
                        </th>
                        <th className="py-3 px-4 text-left font-semibold text-gray-600">
                          Select
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentDonors.map((donor, index) => (
                        <tr
                          key={index}
                          className="border-b hover:bg-gray-50 transition"
                        >
                          <td className="py-2 px-4">{`${donor.donorFName} ${donor.donorLName}`}</td>
                          <td className="py-2 px-4">{donor.donorMobile}</td>
                          <td className="py-2 px-4">{donor.donorPAN}</td>
                          <td className="py-2 px-4 text-center">
                            <input
                              type="radio"
                              name="donorSelection"
                              // checked={selectedRow}
                              onChange={() => handleCheckboxChange(donor)}
                              className="w-5 h-5 text-green-500"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div style={{ textAlign: "center", marginTop: "20px" }}>
                    <button
                      className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                      onClick={goToPreviousPage}
                      disabled={currentPage === 1}
                    >
                      Prev
                    </button>
                    <span style={{ margin: "0 10px" }}>
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                      onClick={goToNextPage}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      {showForm && (
        <div className="mt-6 p-4 border rounded-lg bg-gray-100">
          <h3 className="text-lg font-semibold mb-4">Payment Form</h3>
          <form
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
            onSubmit={(e) => e.preventDefault()}
          >
            <div>
              <label className="block">Name</label>
              <input
                type="text"
                name="amount"
                value={selectedDonar || `${formData.Fname} ${formData.Lname}`}
                disabled
                className="border p-2 rounded w-full"
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block">Amount</label>
              <input
                type="text"
                name="amount"
                disabled={selectedTransaction}
                value={formData.amount}
                className="border p-2 rounded w-full"
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block">Bank</label>
              <input
                type="text"
                name="bank"
                value={formData.bank}
                className="border p-2 rounded w-full"
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block">Type</label>
              <select
                name="type"
                value={formData.type}
                className="border p-2 rounded w-full"
                onChange={handleChange}
              >
                {selectedTransaction ? (
                  <>
                    <option value="E-Transfer">E-Transfer</option>
                    <option value="Cheque">Cheque</option>
                  </>
                ) : (
                  <>
                    <option value="">Select Type</option>
                    <option value="Cash">Cash</option>
                    <option value="E-Transfer">E-Transfer</option>
                    <option value="InKind">InKind</option>
                    <option value="Cheque">Cheque</option>
                  </>
                )}
              </select>
            </div>
            {selectedTransaction ? (
              <div>
                <label className="block">Transaction ID</label>
                <input
                  type="text"
                  name="transactionID"
                  value={formData.transactionID}
                  className="border p-2 rounded w-full"
                  onChange={handleChange}
                />
              </div>
            ) : (
              (formData.type === "E-Transfer" ||
                formData.type === "Cheque") && (
                <div>
                  <label className="block">Transaction ID</label>
                  <input
                    type="text"
                    name="transactionID"
                    value={formData.transactionID || ""}
                    className="border p-2 rounded w-full"
                    onChange={handleChange}
                  />
                </div>
              )
            )}

            <div>
              <label className="block">Project</label>
              <select
                name="project"
                value={formData.project}
                className="border p-2 rounded w-full"
                onChange={handleChange}
              >
                <option value="">Select Project</option>
                {Object.keys(projectPurposes).map((project) => (
                  <option key={project} value={project}>
                    {project}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block">Purpose</label>
              <select
                name="purpose"
                value={formData.purpose}
                className="border p-2 rounded w-full"
                onChange={handleChange}
                disabled={!formData.project} // Disable if no project is selected
              >
                <option value="">Select Purpose</option>
                {formData.project &&
                  projectPurposes[formData?.project].map((purpose) => (
                    <option key={purpose} value={purpose}>
                      {purpose}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block">Donation Date</label>
              <input
                type="date"
                name="donationDate"
                disabled={selectedTransaction}
                className="border p-2 rounded w-full"
                value={
                  selectedTransaction?.txnDate
                    ? convertDate(selectedTransaction.txnDate)
                    : formData.donationDate
                }
                onChange={handleChange}
              />
            </div>
            <div className="col-span-3">
              <label className="block">Note</label>
              <textarea
                name="note"
                value={formData.note}
                className="border p-2 rounded w-full"
                onChange={handleChange}
              ></textarea>
            </div>
            <div className="col-span-3 flex justify-end gap-4 mt-4">
              <button
                type="button"
                className="px-4 py-2 bg-gray-500 text-white rounded"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded"
                onClick={() => {
                  handleSubmit();
                }}
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default PaymentDetails;
