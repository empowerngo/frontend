import { FaUsers, FaExclamationTriangle, FaBan } from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const SuperAdminDashboard = ({ data }) => {
  // console.log("Dashboard Data:", data);

  if (!data) {
    return <p>Loading data...</p>;
  }

  const activeNGOs = data.activeNGOs?.[0]?.ActiveNGOsCount || 0;
  const expiringNGOs = data.expiringNGOs || [];
  const expiredNGOs = data.expiredNGOs || [];
  const receiptLimitNGOs = data.receiptLimitNGOs || [];

  const graphData = [
    { name: "Active", count: activeNGOs },
    { name: "Expiring", count: expiringNGOs.length },
    { name: "Expired", count: expiredNGOs.length },
  ];

  // Scroll Function
  const handleScroll = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="p-6 min-h-screen">
      {/* Dashboard Header */}
      <h2 className="text-3xl font-semibold text-gray-800 text-center mb-6">
        Super Admin Dashboard
      </h2>
      {/* Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div
            className="bg-yellow-100 shadow-lg p-6 rounded-xl cursor-pointer hover:bg-yellow-200"
            onClick={() => handleScroll("expiring-ngos")}
          >
            <div className="flex items-center space-x-3 text-yellow-700">
              <FaExclamationTriangle className="text-3xl" />
              <h2 className="text-lg font-semibold">Expiring Soon</h2>
            </div>
            <p className="text-xl font-bold">{expiringNGOs.length}</p>
          </div>

          <div
            className="bg-red-100 shadow-lg p-6 rounded-xl cursor-pointer hover:bg-red-200"
            onClick={() => handleScroll("expired-ngos")}
          >
            <div className="flex items-center space-x-3 text-red-700">
              <FaBan className="text-3xl" />
              <h2 className="text-lg font-semibold">Expired NGOs</h2>
            </div>
            <p className="text-xl font-bold">{expiredNGOs.length}</p>
          </div>
          <div
            className="bg-green-100 shadow-lg p-6 rounded-xl cursor-pointer hover:bg-green-200"
            onClick={() => handleScroll("active-ngos")}
          >
            <div className="flex items-center space-x-3 text-green-700">
              <FaUsers className="text-3xl" />
              <h2 className="text-lg font-semibold">Active NGOs</h2>
            </div>
            <p className="text-xl font-bold">{activeNGOs}</p>
          </div>

          <div
            className="bg-yellow-100 p-4 rounded-lg shadow-md cursor-pointer hover:bg-yellow-200"
            onClick={() => handleScroll("receipt-limit-ngos")}
          >
            <div className="flex items-center space-x-3 text-yellow-700">
              <FaExclamationTriangle className="text-3xl" />
              <h2 className="text-lg font-semibold">
                NGOs Approaching Receipt Limit
              </h2>
            </div>
            <p className="text-xl font-bold">{receiptLimitNGOs.length}</p>
          </div>
          {/* Graph Section */}
        </div>
        <div className="mb-6 w-ful">
          <div className="bg-white shadow-xl p-6 rounded-xl  w-full ">
            <h2 className="text-lg font-semibold mb-3">NGO Status Overview</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={graphData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#4F46E5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {" "}
        {expiringNGOs.length > 0 && (
          <div
            id="expiring-ngos"
            className="bg-white shadow-xl p-6 rounded-xl "
          >
            <h2 className="text-lg font-semibold mb-3">Expiring NGOs</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2 text-left">NGO Name</th>
                    <th className="border p-2 text-left">Contact</th>
                    <th className="border p-2 text-left">Contact Person</th>
                    <th className="border p-2 text-left">Expiry Date</th>
                  </tr>
                </thead>
                <tbody>
                  {expiringNGOs.map((ngo, index) => (
                    <tr key={index} className="border-b">
                      <td className="border p-2">{ngo.NGO_NAME}</td>
                      <td className="border p-2">{ngo.NGO_CONTACT}</td>
                      <td className="border p-2">{ngo.CONTACT_PERSON}</td>
                      <td className="border p-2">
                        {new Date(ngo.EXPIRY_DATE).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {/* Expired NGOs Table */}
        {expiredNGOs.length > 0 && (
          <div id="expired-ngos" className="bg-white shadow-xl p-6 rounded-xl">
            <h2 className="text-lg font-semibold mb-3 text-red-600">
              Expired NGOs
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2 text-left">NGO Name</th>
                    <th className="border p-2 text-left">Contact</th>
                    <th className="border p-2 text-left">Contact Person</th>
                    <th className="border p-2 text-left">Expiry Date</th>
                  </tr>
                </thead>
                <tbody>
                  {expiredNGOs.map((ngo, index) => (
                    <tr key={index} className="border-b">
                      <td className="border p-2">{ngo.NGO_NAME}</td>
                      <td className="border p-2">{ngo.NGO_CONTACT}</td>
                      <td className="border p-2">{ngo.CONTACT_PERSON}</td>
                      <td className="border p-2">
                        {new Date(ngo.EXPIRY_DATE).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      {/* Expiring NGOs Table */}
    </div>
  );
};

export default SuperAdminDashboard;
