import { useState } from "react";
import { FaDollarSign, FaUsers, FaReceipt } from "react-icons/fa";
import MonthlyDonationsCard from "./MonthlyDonation";
import DonationsSummaryCard from "./DonationSummaryCard";
import ProjectSummary from "./ProjectSummary";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const DonationDashboard = ({ data }) => {
  const [filter, setFilter] = useState("");

  const receiptCount = data?.receiptCount?.[0]?.RECEIPT_COUNT || 0;
  const userCount = data?.userCount?.[0]?.USER_COUNT || 0;

  const filteredDonations = (data?.donationSummary || []).filter((donation) =>
    donation?.PROJECT?.toLowerCase().includes(filter.toLowerCase())
  );

  // Group donations by project and purpose
  const projectData = {};
  filteredDonations.forEach(({ PROJECT, PURPOSE, AMOUNT }) => {
    if (!projectData[PROJECT]) projectData[PROJECT] = {};
    projectData[PROJECT][PURPOSE] =
      (projectData[PROJECT][PURPOSE] || 0) + (parseFloat(AMOUNT) || 0);
  });

  // Transform into chart data
  const chartData = Object.entries(projectData).map(([project, purposes]) => ({
    project,
    ...purposes,
  }));

  return (
    <div className="p-6 min-h-screen">
      {/* Dashboard Header */}
      <h2 className="text-3xl font-semibold text-gray-800 text-center mb-6">
        Donation Dashboard
      </h2>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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

        {/* Donations Card */}
        <DonationsSummaryCard dailySummary={data?.dailySummary} />
        <MonthlyDonationsCard monthlySummary={data?.monthlySummary} />
      </div>
      {/* Bar Chart */}
      <div className="bg-white/80 p-6 backdrop-blur-lg shadow-xl rounded-2xl mt-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          Donation Breakdown by Project & Purpose
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <XAxis dataKey="project" />
            <YAxis domain={[0, "dataMax + 5000"]} />
            <Tooltip />
            <Legend />
            {Object.keys(projectData[Object.keys(projectData)[0]] || {}).map(
              (purpose, index) => (
                <Bar
                  key={index}
                  dataKey={purpose}
                  stackId="a"
                  fill={`hsl(${index * 60}, 70%, 50%)`}
                />
              )
            )}
          </BarChart>
        </ResponsiveContainer>
        <input
          type="text"
          placeholder="Search by project..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border p-3 rounded-md w-full mb-4 shadow-sm"
        />

        {/* Donation Breakdown Table */}
        <div className="bg-white p-6">
          {/* <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Donation Breakdown
          </h3> */}
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
      {/* Search Input */}
    </div>
  );
};

export default DonationDashboard;
