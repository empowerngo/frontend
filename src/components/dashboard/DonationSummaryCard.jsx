import { FaDollarSign } from "react-icons/fa";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const DonationsSummaryCard = ({ dailySummary }) => {
  console.log("dailySummary:", dailySummary); // Debugging

  // Ensure dailySummary exists and is an array
  const summaryData = Array.isArray(dailySummary) ? dailySummary[0] : {};

  // Ensure safe data access
  const totalDonations = parseFloat(summaryData?.TodaySum || "0.00");
  const monthToDateSum = parseFloat(summaryData?.MonthToDateSum || "0.00");
  const yearToDateSum = parseFloat(summaryData?.YearToDateSum || "0.00");

  // Sample data for the graph
  const data = [
    { name: "Today", amount: totalDonations },
    { name: "Month", amount: monthToDateSum },
    { name: "Year", amount: yearToDateSum },
  ];

  return (
    <div className="bg-white/80 backdrop-blur-lg shadow-xl rounded-2xl p-6">
      {/* Header */}
      <div className="flex items-center space-x-3 text-blue-700">
        <FaDollarSign className="text-3xl" />
        <h2 className="text-xl font-semibold">Total Donations</h2>
      </div>

      {/* Donation Stats */}
      <div className="mt-4 space-y-2 text-gray-600 text-sm">
        <div className="flex justify-between">
          <span>Total:</span>
          <span className="font-semibold">₹{totalDonations.toFixed(2)}</span>
        </div>

        <div className="flex justify-between">
          <span>Month to Date:</span>
          <span className="font-semibold">₹{monthToDateSum.toFixed(2)}</span>
        </div>

        <div className="flex justify-between">
          <span>Year to Date:</span>
          <span className="font-semibold">₹{yearToDateSum.toFixed(2)}</span>
        </div>
      </div>

      {/* Donation Graph */}
      <div className="mt-6">
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="#4F46E5"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DonationsSummaryCard;
