import { useState } from "react";
import { FaDollarSign } from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const MonthlyDonationsCard = ({ monthlySummary }) => {
  return (
    <div className="bg-white/80 backdrop-blur-lg shadow-xl rounded-2xl p-6">
      {/* Title & Icon */}
      <div className="flex items-center space-x-3 mb-3 text-blue-700">
        <FaDollarSign className="text-3xl" />
        <h2 className="text-xl font-semibold">Monthly Donations</h2>
      </div>

      {/* Graph Section */}
      {monthlySummary?.length > 0 ? (
        <div className="mt-4">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={monthlySummary}
              margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
            >
              <XAxis
                dataKey="DonationMonth"
                tickFormatter={(tick) => `Month ${tick}`}
              />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey="MonthlySum"
                fill="#3182ce"
                radius={[10, 10, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p className="text-gray-500 text-sm mt-3">
          No data available for graph
        </p>
      )}
    </div>
  );
};

export default MonthlyDonationsCard;
