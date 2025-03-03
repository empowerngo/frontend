/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from 'react';

const LoadingSpinner = ({ message = "Just a moment..." }) => {
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-40 backdrop-blur-sm flex flex-col items-center justify-center z-40">
      {/* Circular Spinner Loader */}
      <div className="relative flex items-center justify-center mb-4">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
      </div>
      
      {/* Loading Message */}
      <div className="text-white text-lg sm:text-xl font-semibold animate-pulse">
        {message}
      </div>
    </div>
  );
};

export default LoadingSpinner;
