import { FaDollarSign } from "react-icons/fa";

const DonationsSummaryCard = ({ dailySummary }) => {
  // console.log("dailySummary:", dailySummary); // Debugging

  // Ensure dailySummary exists and is an array
  const summaryData = Array.isArray(dailySummary) ? dailySummary[0] : {};

  // Ensure safe data access
  const totalDonations = parseFloat(summaryData?.TodaySum || "0.00");
  const monthToDateSum = parseFloat(summaryData?.MonthToDateSum || "0.00");
  const yearToDateSum = parseFloat(summaryData?.YearToDateSum || "0.00");

  return (
    <div className="bg-white/80 backdrop-blur-lg shadow-xl rounded-2xl p-6">
      {/* Header */}
      <div className="flex items-center space-x-3 text-blue-700 mb-4">
        <FaDollarSign className="text-3xl" />
        <h2 className="text-xl font-semibold">Total Donations</h2>
      </div>

      {/* Donation Stats Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded-lg">
          <thead>
            <tr className="bg-gray-200 text-gray-700 text-left">
              <th className="py-2 px-4 border-b">Category</th>
              <th className="py-2 px-4 border-b">Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-2 px-4">Total</td>
              <td className="py-2 px-4 font-semibold">
                {totalDonations.toFixed(2)}
              </td>
            </tr>
            <tr className="border-b">
              <td className="py-2 px-4">Month to Date</td>
              <td className="py-2 px-4 font-semibold">
                {monthToDateSum.toFixed(2)}
              </td>
            </tr>
            <tr>
              <td className="py-2 px-4">Year to Date</td>
              <td className="py-2 px-4 font-semibold">
                {yearToDateSum.toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DonationsSummaryCard;
