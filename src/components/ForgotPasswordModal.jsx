/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";

const ForgotPasswordModal = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleSubmit = () => {
    if (email) {
      setIsSubmitted(true);

      // Simulate progress bar
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setIsSubmitted(false);
              setProgress(0);
              onSuccess(email); // Notify parent component
            }, 1000);
            return 100;
          }
          return prev + 10;
        });
      }, 300);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-10">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6 lg:max-w-lg xl:max-w-xl">
        {!isSubmitted ? (
          <>
            <h2 className="text-2xl font-semibold text-blue-600 text-center mb-4 lg:text-3xl xl:text-4xl">
              Forgot Password
            </h2>
            <p className="text-gray-600 text-center mb-6 lg:text-lg xl:text-xl">
              Enter your registered email, and we will send your login
              credentials to your inbox.
            </p>
            <div>
              <label
                htmlFor="forgot-email"
                className="block text-sm text-gray-700 lg:text-lg xl:text-xl"
              >
                Email
              </label>
              <input
                type="email"
                id="forgot-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 lg:text-lg xl:text-xl lg:px-6 lg:py-3"
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={onClose}
                className="py-2 px-4 rounded-lg border border-red-500 text-red-500 hover:bg-red-500 hover:text-white focus:outline-none lg:text-lg xl:text-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="py-2 px-4 rounded-lg border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white focus:outline-none lg:text-lg xl:text-xl"
              >
                Submit
              </button>
            </div>
          </>
        ) : (
          <div className="text-center">
            <div className="animate-bounce mb-4">
              <svg
                className="w-12 h-12 text-green-500 mx-auto"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-green-600 mb-2 lg:text-2xl xl:text-3xl">
              Success!
            </h2>
            <p className="text-gray-600 mb-4 lg:text-lg xl:text-xl">
              An email has been sent to{" "}
              <span className="text-blue-600 font-semibold">{email}</span> with
              your login credentials. Please check your inbox for further
              instructions.
            </p>
            <div className="relative h-2 w-full bg-gray-300 rounded-full">
              <div
                className="absolute top-0 left-0 h-2 bg-green-500 rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
