import { FaDollarSign } from 'react-icons/fa';

const MonthlyDonations = () => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 rounded-md shadow-md text-white h-full flex flex-col justify-between bg-opacity-80 bg-[url('https://www.transparenttextures.com/patterns/diagonal-stripes.png')]">
      <div className="flex items-center space-x-3">
        <FaDollarSign className="text-2xl" />
        <h2 className="text-xl font-medium">Monthly Donations</h2>
      </div>
      <div>
        <p className="text-lg mt-3">Total Donations: ₹50,000</p>
        <p className="text-base mt-2">Received: ₹30,000</p>
        <p className="text-base">Pending: ₹20,000</p>
      </div>
    </div>
  );
};

export default MonthlyDonations;
