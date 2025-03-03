import { useState } from "react";
import { FaEdit, FaTrashAlt, FaPrint } from "react-icons/fa";
import ReactPaginate from "react-paginate";

const DonorList = () => {
  const [donors, setDonors] = useState([
    { name: "John Doe", amount: "₹5000", date: "2025-01-10" },
    { name: "Jane Smith", amount: "₹10000", date: "2025-01-15" },
    { name: "Ravi Kumar", amount: "₹3000", date: "2025-01-20" },
    { name: "Alice Walker", amount: "₹7000", date: "2025-01-22" },
    { name: "Bob Martin", amount: "₹2000", date: "2025-01-25" },
    { name: "Charlie Brown", amount: "₹6000", date: "2025-01-30" },
    { name: "David Lee", amount: "₹8000", date: "2025-02-01" },
    { name: "Eva Green", amount: "₹4000", date: "2025-02-05" },
    { name: "George White", amount: "₹1000", date: "2025-02-10" },
    { name: "Helen Blue", amount: "₹9000", date: "2025-02-15" },
    { name: "Isla Turner", amount: "₹5500", date: "2025-02-18" },
    { name: "Jack Black", amount: "₹7500", date: "2025-02-20" },
  ]);
  const [filter, setFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const donorsPerPage = 10;

  const handleFilterChange = (e) => setFilter(e.target.value);

  const handleDelete = (index) => setDonors(donors.filter((_, i) => i !== index));

  const handleAddDonor = () => {
    const newDonor = { name: "New Donor", amount: "₹0", date: "2025-01-25" };
    setDonors([...donors, newDonor]);
  };

  const filteredDonors = donors.filter((donor) =>
    donor.name.toLowerCase().includes(filter.toLowerCase())
  );

  const totalPages = Math.ceil(filteredDonors.length / donorsPerPage);

  const handlePageClick = (data) => setCurrentPage(data.selected);

  const currentDonors = filteredDonors.slice(
    currentPage * donorsPerPage,
    (currentPage + 1) * donorsPerPage
  );

  return (
    <div className="p-4 rounded-lg bg-white">
      <h2 className="text-2xl font-semibold text-center text-blue-600 mb-6">Donor List</h2>

      <div className="flex items-center mb-4">
        <input
          type="text"
          placeholder="Search by name"
          value={filter}
          onChange={handleFilterChange}
          className="border py-2 px-4 rounded-md mr-4 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
        />
        <button
          onClick={handleAddDonor}
          className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm"
        >
          Add Donor
        </button>
      </div>

      <table className="min-w-full table-auto border-collapse">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="py-3 px-4 text-center text-sm">Donor Name</th>
            <th className="py-3 px-4 text-center text-sm">Amount</th>
            <th className="py-3 px-4 text-center text-sm">Date</th>
            <th className="py-3 px-4 text-center text-sm">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentDonors.map((donor, index) => (
            <tr key={index} className="border-t border-gray-200 hover:bg-gray-50">
              <td className="py-3 px-4 text-center text-sm">{donor.name}</td>
              <td className="py-3 px-4 text-center text-sm">{donor.amount}</td>
              <td className="py-3 px-4 text-center text-sm">{donor.date}</td>
              <td className="py-3 px-4 flex justify-center space-x-3">
                <button className="bg-gray-200 rounded-full p-2 text-blue-600 hover:bg-blue-100 text-sm">
                  <FaPrint />
                </button>
                <button
                  className="bg-gray-200 rounded-full p-2 text-red-600 hover:bg-red-100 text-sm"
                  onClick={() => handleDelete(index)}
                >
                  <FaTrashAlt />
                </button>
                <button className="bg-gray-200 rounded-full p-2 text-yellow-600 hover:bg-yellow-100 text-sm">
                  <FaEdit />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end mt-6">
        <ReactPaginate
          previousLabel={<span className="text-sm">{"<"}</span>}
          nextLabel={<span className="text-sm">{">"}</span>}
          breakLabel={"..."}
          pageCount={totalPages}
          marginPagesDisplayed={1}
          pageRangeDisplayed={3}
          onPageChange={handlePageClick}
          containerClassName="flex justify-center items-center space-x-2"
          pageClassName="py-2 px-4 rounded-md bg-gray-200 text-sm cursor-pointer hover:bg-blue-600 hover:text-white transition-all"
          activeClassName="bg-blue-600 text-white"
          disabledClassName="bg-gray-300 text-gray-400 cursor-not-allowed"
          previousClassName="py-2 px-4 rounded-md bg-gray-200 text-sm cursor-pointer hover:bg-blue-600 hover:text-white transition-all"
          nextClassName="py-2 px-4 rounded-md bg-gray-200 text-sm cursor-pointer hover:bg-blue-600 hover:text-white transition-all"
        />
      </div>
    </div>
  );
};

export default DonorList;
