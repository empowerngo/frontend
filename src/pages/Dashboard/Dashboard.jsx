import MonthlyDonations from "../../components/dashboard/MonthlyDonations";
import TotalStaff from "../../components/dashboard/TotalStaff";
import DonorList from "../../components/dashboard/DonorList";

const Dashboard = () => {
  return (
    <div className="flex bg-gray-100 min-h-screen p-4">
      <div className="flex-grow p-6">
        <h1 className="text-2xl font-semibold text-blue-700 mb-6">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-4 rounded-lg shadow-md">
          <div className="p-4 rounded-lg bg-gray-50 shadow-sm">
            <MonthlyDonations />
          </div>
          <div className="p-4 rounded-lg bg-gray-50 shadow-sm">
            <TotalStaff />
          </div>
        </div>
        <div className="mt-6 p-4 rounded-lg shadow-md bg-white">
          <DonorList />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
