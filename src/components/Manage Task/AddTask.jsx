// /* eslint-disable no-unused-vars */
// import React from 'react'

// const AddTask = () => {
//   return (
//     <div>AddTask</div>
//   )
// }

// export default AddTask
/* eslint-disable no-unused-vars *//* eslint-disable no-unused-vars */
import React from 'react';
import { FaUser, FaEnvelope, FaIdCard, FaPhone, FaMapMarkedAlt, FaCalendarAlt, FaBuilding, FaBriefcase, FaDollarSign } from 'react-icons/fa';

const AddTask = () => {
  return (
    <div className="p-8 max-w-screen-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center mb-8 text-gray-800">Create Subscription Package</h1>
      <form className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2">
        
        {/* Plan Name */}
        <div className="relative">
          <label className="block text-sm font-medium mb-2 text-gray-700" htmlFor="planName">Plan Name</label>
          <input
            id="planName"
            type="text"
            placeholder="Enter Plan Name"
            className="px-4 py-3 w-full border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Plan Price */}
        <div className="relative">
          <label className="block text-sm font-medium mb-2 text-gray-700" htmlFor="planPrice">Plan Price</label>
          <input
            id="planPrice"
            type="number"
            placeholder="Enter Plan Price"
            className="px-4 py-3 w-full border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Maximum Users */}
        <div className="relative">
          <label className="block text-sm font-medium mb-2 text-gray-700" htmlFor="maxUsers">Maximum Users</label>
          <input
            id="maxUsers"
            type="number"
            placeholder="Enter Maximum Users"
            className="px-4 py-3 w-full border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Maximum Donors */}
        <div className="relative">
          <label className="block text-sm font-medium mb-2 text-gray-700" htmlFor="maxDonors">Maximum Donors</label>
          <input
            id="maxDonors"
            type="number"
            placeholder="Enter Maximum Donors"
            className="px-4 py-3 w-full border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Maximum Donations */}
        <div className="relative">
          <label className="block text-sm font-medium mb-2 text-gray-700" htmlFor="maxDonations">Maximum Donations</label>
          <input
            id="maxDonations"
            type="number"
            placeholder="Enter Maximum Donations"
            className="px-4 py-3 w-full border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Plan Status */}
        <div className="relative">
          <label className="block text-sm font-medium mb-2 text-gray-700" htmlFor="planStatus">Plan Status</label>
          <select
            id="planStatus"
            className="px-4 py-3 w-full border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        {/* Form 10BE Report */}
        <div className="relative">
          <label className="block text-sm font-medium mb-2 text-gray-700" htmlFor="form10BE">Form 10BE Report</label>
          <select
            id="form10BE"
            className="px-4 py-3 w-full border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>

        {/* Submit Button */}
        <div className="col-span-full">
          <button
            type="submit"
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transform transition duration-300 ease-in-out"
          >
            Create Package
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTask;