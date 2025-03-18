import { useState } from "react";
import { FaDollarSign, FaUsers, FaReceipt } from "react-icons/fa";
import MonthlyDonationsCard from "./MonthlyDonation";
import DonationsSummaryCard from "./DonationSummaryCard";

const DonationDashboard = ({ data }) => {
  const [filter, setFilter] = useState("");

  const dailySummary = data?.dailySummary?.[0] || {
    TodaySum: "0.00",
    MonthToDateSum: "0.00",
    YearToDateSum: "0.00",
  };
  const receiptCount = data?.receiptCount?.[0]?.RECEIPT_COUNT || 0;
  const userCount = data?.userCount?.[0]?.USER_COUNT || 0;
  const totalDonations = (data?.donationSummary || []).reduce(
    (sum, d) => sum + parseFloat(d.AMOUNT || 0),
    0
  );
  const filteredDonations = (data?.donationSummary || []).filter((donation) =>
    donation?.PROJECT?.toLowerCase().includes(filter.toLowerCase())
  );
  return (
    <div className="p-6  min-h-screen">
      {/* Dashboard Header */}
      <h2 className="text-3xl font-semibold text-gray-800 text-center mb-6">
        Donation Dashboard
      </h2>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Donations Card */}
        <DonationsSummaryCard dailySummary={data?.dailySummary} />

        <MonthlyDonationsCard monthlySummary={data?.monthlySummary} />

        {/* Receipt Count */}
        <div className="bg-white/80 backdrop-blur-lg shadow-xl rounded-2xl p-6 ">
          <div className="flex items-center space-x-3 mb-3 text-purple-700">
            <FaReceipt className="text-3xl" />
            <h2 className="text-xl font-semibold">Receipt Count</h2>
          </div>
          <p className="text-gray-600 text-sm">
            Total Receipts:{" "}
            <span className="font-semibold">{receiptCount}</span>
          </p>
        </div>

        {/* User Count */}
        <div className="bg-white/80 backdrop-blur-lg shadow-xl rounded-2xl p-6 ">
          <div className="flex items-center space-x-3 mb-3 text-green-700">
            <FaUsers className="text-3xl" />
            <h2 className="text-xl font-semibold">Total Users</h2>
          </div>
          <p className="text-gray-600 text-sm">
            Registered Users: <span className="font-semibold">{userCount}</span>
          </p>
        </div>
      </div>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search by project..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="border p-3 rounded-md w-full mb-4 shadow-sm"
      />

      {/* Donation Breakdown Table */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          Donation Breakdown
        </h3>
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="py-3 px-4 border text-left">Project</th>
              <th className="py-3 px-4 border text-left">Purpose</th>
              <th className="py-3 px-4 border text-left">Amount</th>
            </tr>
          </thead>
          <tbody>
            {filteredDonations.map((donation, index) => (
              <tr key={index} className="border hover:bg-gray-100 transition">
                <td className="py-3 px-4 border">{donation.PROJECT}</td>
                <td className="py-3 px-4 border">{donation.PURPOSE}</td>
                <td className="py-3 px-4 border">₹{donation.AMOUNT}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DonationDashboard;
