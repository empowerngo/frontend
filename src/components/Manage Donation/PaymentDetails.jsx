import { useState } from "react";

const PaymentDetails = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [donors, setDonors] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    amount: "",
    bank: "",
    type: "",
    purpose: "",
    project: "",
    donationDate: "",
    note: "",
  });

  const allDonors = [
    { name: "John Doe", mobile: "1234567890", pan: "ABCDE1234F" },
    { name: "Jane Smith", mobile: "9876543210", pan: "XYZW5678K" },
  ];

  const handleSearch = () => {
    setLoading(true);
    setTimeout(() => {
      const filteredDonors = allDonors.filter((donor) =>
        donor.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setDonors(filteredDonors);
      setLoading(false);
    }, 1500);
  };

  const handleCheckboxChange = (donor) => {
    if (selectedRow === donor) {
      handleCancel();
    } else {
      setSelectedRow(donor);
      setShowForm(true);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCancel = () => {
    setShowForm(false);
    setSelectedRow(null);
    setFormData({
      amount: "",
      bank: "",
      type: "",
      purpose: "",
      project: "",
      donationDate: "",
      note: "",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted", formData);
  };

  return (
    <div className="w-full mx-auto bg-white p-8 rounded-2xl shadow-lg mt-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Payment Details</h2>
      <div className="flex flex-col md:flex-row justify-between items-start gap-6">
        <div className="w-full md:w-1/2">
          <h3 className="font-semibold text-gray-800">Enter Keyword (Search)</h3>
          <p className="text-gray-500 text-sm mb-2">(Name, Code, or Mobile No.)</p>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Keyword (Name, Code or Mobile No.)"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              onClick={handleSearch}
              disabled={!searchTerm.trim()}
              className={`px-4 py-2 rounded-lg text-white transition ${
                searchTerm.trim()
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              Search
            </button>
          </div>
        </div>
        {searchTerm.trim() && (
          <div className="w-full md:w-1/2">
            <h3 className="font-semibold text-gray-800">Donor List</h3>
            <p className="text-gray-500 text-sm mb-2">------</p>

            {loading && (
              <div className="flex justify-center my-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            )}

            {!loading && donors.length > 0 && (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="py-3 px-4 text-left font-semibold text-gray-600">Name</th>
                      <th className="py-3 px-4 text-left font-semibold text-gray-600">Mobile</th>
                      <th className="py-3 px-4 text-left font-semibold text-gray-600">PAN</th>
                      <th className="py-3 px-4 text-left font-semibold text-gray-600">Select</th>
                    </tr>
                  </thead>
                  <tbody>
                    {donors.map((donor, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50 transition">
                        <td className="py-2 px-4">{donor.name}</td>
                        <td className="py-2 px-4">{donor.mobile}</td>
                        <td className="py-2 px-4">{donor.pan}</td>
                        <td className="py-2 px-4">
                          <input
                            type="checkbox"
                            className="rounded focus:ring-blue-500"
                            checked={selectedRow === donor}
                            onChange={() => handleCheckboxChange(donor)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
      {showForm && (
        <div className="mt-6 p-4 border rounded-lg bg-gray-100">
        <h3 className="text-lg font-semibold mb-4">Payment Form</h3>
        <form className="grid grid-cols-1 md:grid-cols-3 gap-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="block">Amount</label>
            <input type="text" name="amount" className="border p-2 rounded w-full" onChange={handleChange} />
          </div>
          <div>
            <label className="block">Bank</label>
            <input type="text" name="bank" className="border p-2 rounded w-full" onChange={handleChange} />
          </div>
          <div>
            <label className="block">Type</label>
            <select name="type" className="border p-2 rounded w-full" onChange={handleChange}>
              <option value="">Select Type</option>
              <option value="Cash">Cash</option>
              <option value="E-Transfer">E-Transfer</option>
              <option value="PhonePe">PhonePe</option>
              <option value="InKind">InKind</option>
              <option value="Cheque">Cheque</option>
            </select>
          </div>
          <div>
            <label className="block">Purpose</label>
            <input type="text" name="purpose" className="border p-2 rounded w-full" onChange={handleChange} />
          </div>
          <div>
            <label className="block">Project</label>
            <input type="text" name="project" className="border p-2 rounded w-full" onChange={handleChange} />
          </div>
          <div>
            <label className="block">Donation Date</label>
            <input type="date" name="donationDate" className="border p-2 rounded w-full" onChange={handleChange} />
          </div>
          <div className="col-span-3">
            <label className="block">Note</label>
            <textarea name="note" className="border p-2 rounded w-full" onChange={handleChange}></textarea>
          </div>
          <div className="col-span-3 flex justify-end gap-4 mt-4">
          <button type="button" className="px-4 py-2 bg-gray-500 text-white rounded" onClick={handleCancel}>Cancel</button>
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">Submit</button>
          </div>
        </form>
      </div>
      )}
    </div>
  );
};

export default PaymentDetails;
