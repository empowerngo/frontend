import { useState } from "react";
import { FaDollarSign } from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const ProjectSummary = ({ monthlySummary, projectBreakdown }) => {
  // Define all months in the fiscal year order
  const fiscalMonths = [
    { id: 4, name: "April 2024" },
    { id: 5, name: "May 2024" },
    { id: 6, name: "June 2024" },
    { id: 7, name: "July 2024" },
    { id: 8, name: "August 2024" },
    { id: 9, name: "September 2024" },
    { id: 10, name: "October 2024" },
    { id: 11, name: "November 2024" },
    { id: 12, name: "December 2024" },
    { id: 1, name: "January 2025" },
    { id: 2, name: "February 2025" },
    { id: 3, name: "March 2025" },
  ];

  // Create a complete dataset ensuring all months exist, filling missing months with zero values
  const dataMap = new Map(
    monthlySummary?.map((item) => [
      item.DonationMonth,
      parseFloat(item.MonthlySum) || 0,
    ])
  );

  const completeData = fiscalMonths.map((month) => ({
    DonationMonth: month.name,
    MonthlySum: dataMap.get(month.id) || 0,
  }));

  return (
    <div className="bg-white/80 backdrop-blur-lg shadow-xl rounded-2xl p-6">
      {/* Title & Icon */}
      <div className="flex items-center space-x-3 mb-3 text-blue-700">
        <FaDollarSign className="text-3xl" />
        <h2 className="text-xl font-semibold">Monthly Donations</h2>
      </div>

      {/* Graph Section */}
      <div className="mt-4">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart
            data={completeData}
            margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
          >
            <XAxis dataKey="DonationMonth" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="MonthlySum" fill="#3182ce" radius={[10, 10, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Donation Breakdown Table */}
      <div className="bg-white p-6 rounded-lg shadow-md mt-6">
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
            {projectBreakdown.map((donation, index) => (
              <tr key={index} className="border hover:bg-gray-100 transition">
                <td className="py-3 px-4 border">{donation.PROJECT}</td>
                <td className="py-3 px-4 border">{donation.PURPOSE}</td>
                <td className="py-3 px-4 border">₹{donation.AMOUNT}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Project-wise Stacked Bar Graph */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          Project-wise Donation Breakdown
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={projectBreakdown}
            margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
          >
            <XAxis dataKey="PROJECT" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="AMOUNT" stackId="a" fill="#3182ce" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProjectSummary;
