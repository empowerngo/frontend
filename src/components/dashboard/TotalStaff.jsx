import { FaUsers } from 'react-icons/fa';

const TotalStaff = () => {
  return (
    <div className="bg-gradient-to-r from-green-600 to-green-800 p-6 rounded-md shadow-md text-white h-full flex flex-col justify-between bg-opacity-80 bg-[url('https://www.transparenttextures.com/patterns/diagonal-stripes.png')]">
      <div className="flex items-center space-x-3">
        <FaUsers className="text-2xl" />
        <h2 className="text-xl font-medium">Total Staff</h2>
      </div>
      <div>
        <p className="text-lg mt-3">Total Staff Members: 120</p>
      </div>
    </div>
  );
};

export default TotalStaff;
