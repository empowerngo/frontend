/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import {
  FaPhoneAlt,
  FaRegFileAlt,
  FaUserAlt,
  FaEnvelope,
  FaLock,
  FaBuilding,
  FaMapMarkerAlt
} from "react-icons/fa";
import LeftSide from "../../components/LeftSide";
import bgRight from "../../assets/bgRight.svg"
import { toast } from "react-toastify";
import { registerNgo } from "../../api/masterApi";

// import validationSchema from "./validationSchema";

function SignUp() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    ngoName: "",
    ngoAddress: "",
    ngoCity: "",
    ngoState: "",
    ngoCountry: "",
    ngoPinCode: "",
    ngoEmail: "",
    ngoContact: "",
    ngo80GNumber: "",
    ngo12ANumber: "",
    ngoCSRNumber: "",
    ngoFCRANumber: "",
    ngoPAN: "",
    contactPerson: "",
    ngoRegNumber: "",
    logoURL: "",
    signatureURL: "",
    authorizedPerson: "",
    password: "",
    confirmPassword: "",
    documents: [],
    acceptTerms: false
  });

  const totalSteps = 3;
  const updateSteps = (step) => {
    setCurrentStep(step);
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      updateSteps(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      updateSteps(currentStep - 1);
    }
  };


const handleSubmit = async () => {
  try {
    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "documents") {
        formData[key].forEach((file) => formDataToSend.append("documents", file));
      } else {
        formDataToSend.append(key, formData[key]);
      }
    });

    const response = await registerNgo(formDataToSend);
    toast.success("NGO registered successfully!");
    console.log("Registration success:", response);
  } catch (error) {
    toast.error(error.message || "Registration failed");
    console.error("Registration error:", error);
  }
};


 
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <LeftSide />
      <div
        className="w-full md:w-[70%] p-4 md:p-12 flex flex-col justify-center"
        style={{
          backgroundImage:`url(${bgRight})` ,
          backgroundSize: "cover",
        }}
      >
        <div className="mb-8">
          <div className="flex justify-center items-center">
            {[1, 2, 3].map((step) => (
              <React.Fragment key={step}>
                {step > 1 && (
                  <div className="w-16 h-1 bg-gray-300 mx-2">
                    <div
                      className={`h-full ${
                        currentStep >= step ? "bg-blue-600" : "bg-gray-300"
                      }`}
                    ></div>
                  </div>
                )}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 text-lg flex items-center justify-center rounded-full ${
                      currentStep >= step
                        ? "bg-blue-600 text-white"
                        : "bg-gray-300 text-gray-500"
                    }`}
                  >
                    {step}
                  </div>
                  <span
                    className={`mt-2 text-base ${
                      currentStep === step
                        ? "text-blue-600 font-semibold"
                        : "text-gray-500"
                    }`}
                  >
                    {step === 1
                      ? "Personal Info"
                      : step === 2
                      ? "NGO Documents"
                      : "Confirmation"}
                  </span>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>

        <form className="max-w-3xl mx-auto w-full">
          {currentStep === 1 && (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="relative mb-6">
                  <label
                    htmlFor="fullName"
                    className="text-sm text-gray-700 lg:text-lg"
                  >
                    Full Name
                  </label>
                  <div className="relative mb-6">
                    <FaUserAlt className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg" />
                    <input
                      type="text"
                      name="fullName"
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData({ ...formData, fullName: e.target.value })
                      }
                      placeholder="Full Name"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none block w-full pl-12 p-3"
                      required
                    />
                  </div>
                </div>
                <div className="relative mb-6">
                  <label
                    htmlFor="email"
                    className="text-sm text-gray-700 lg:text-lg"
                  >
                    Email
                  </label>
                  <div className="relative mb-6">
                    <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg" />
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="name@company.com"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none block w-full pl-12 p-3"
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="relative mb-6">
                  <label
                    htmlFor="ngoName"
                    className="text-sm text-gray-700 lg:text-lg"
                  >
                    NGO Name
                  </label>
                  <div className="relative mb-6">
                    <FaBuilding className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg" />
                    <input
                      type="text"
                      name="ngoName"
                      id="ngoName"
                      value={formData.ngoName}
                      onChange={(e) =>
                        setFormData({ ...formData, ngoName: e.target.value })
                      }
                      placeholder="NGO Name"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none block w-full pl-12 p-3"
                      required
                    />
                  </div>
                </div>
                <div className="relative mb-6">
                  <label
                    htmlFor="address"
                    className="text-sm text-gray-700 lg:text-lg"
                  >
                    Address
                  </label>
                  <div className="relative mb-6">
                    <FaMapMarkerAlt className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg" />
                    <input
                      type="text"
                      name="address"
                      id="address"
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      placeholder="Address"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none block w-full pl-12 p-3"
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="relative mb-6">
                  <label
                    htmlFor="phone"
                    className="text-sm text-gray-700 lg:text-lg"
                  >
                    Phone Number
                  </label>
                  <div className="relative mb-6">
                    <FaPhoneAlt className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg" />
                    <input
                      type="tel"
                      name="phone"
                      id="phone"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      placeholder="Phone Number"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none block w-full pl-12 p-3"
                      required
                    />
                  </div>
                </div>
                <div className="relative mb-6">
                  <label
                    htmlFor="city"
                    className="text-sm text-gray-700 lg:text-lg"
                  >
                    City
                  </label>
                  <div className="relative mb-6">
                    <FaMapMarkerAlt className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg" />
                    <select
                      name="city"
                      id="city"
                      value={formData.city}
                      onChange={(e) =>
                        setFormData({ ...formData, city: e.target.value })
                      }
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none block w-full pl-12 p-3"
                      required
                    >
                      <option value="">Choose Your City</option>
                      <option value="Mumbai">Mumbai</option>
                      <option value="Delhi">Delhi</option>
                      <option value="Bangalore">Bangalore</option>
                      <option value="Chennai">Chennai</option>
                      <option value="Kolkata">Kolkata</option>
                      <option value="Hyderabad">Hyderabad</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="relative mb-6">
                <label
                  htmlFor="terms"
                  className="inline-flex items-center text-sm text-gray-700 lg:text-lg"
                >
                  <input
                    type="checkbox"
                    id="terms"
                    name="terms"
                    checked={formData.terms}
                    onChange={(e) =>
                      setFormData({ ...formData, terms: e.target.checked })
                    }
                    className="form-checkbox text-blue-500 rounded-lg w-7 h-7 lg:w-8 lg:h-8"
                  />
                  <span className="ml-2 text-sm lg:text-lg">
                    By signing up, you are creating an EmpowerNGO account, and
                    you agree to{" "}
                    <a
                      href="/terms-of-use"
                      className="text-blue-500 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      EmpowerNGO Terms of Use
                    </a>{" "}
                    and{" "}
                    <a
                      href="/privacy-policy"
                      className="text-blue-500 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      EmpowerNGO Privacy Policy
                    </a>
                    .
                  </span>
                </label>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <div className="relative mb-6">
                <label
                  htmlFor="document1"
                  className="block text-sm text-gray-700 lg:text-lg"
                >
                  Document 1
                </label>
                <div className="relative">
                  <FaRegFileAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg" />
                  <input
                    type="file"
                    name="document1"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      setFormData({
                        ...formData,
                        documents: [...formData.documents, file]
                      });
                    }}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-12 p-3"
                  />
                </div>
              </div>

              <div className="relative mb-6">
                <label
                  htmlFor="document2"
                  className="block text-sm text-gray-700 lg:text-lg"
                >
                  Document 2
                </label>
                <div className="relative">
                  <FaRegFileAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg" />
                  <input
                    type="file"
                    name="document2"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      setFormData({
                        ...formData,
                        documents: [...formData.documents, file]
                      });
                    }}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-12 p-3"
                  />
                </div>
              </div>

              <div className="relative mb-6">
                <label
                  htmlFor="document3"
                  className="block text-sm text-gray-700 lg:text-lg"
                >
                  Document 3
                </label>
                <div className="relative">
                  <FaRegFileAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg" />
                  <input
                    type="file"
                    name="document3"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      setFormData({
                        ...formData,
                        documents: [...formData.documents, file]
                      });
                    }}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-12 p-3"
                  />
                </div>
              </div>
              <div className="flex mb-6 space-x-4">
                <div className="relative flex-1">
                  <label
                    htmlFor="password"
                    className="block text-sm text-gray-700 lg:text-lg"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg" />
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      placeholder="Password"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none block w-full pl-12 p-3"
                    />
                  </div>
                </div>

                <div className="relative flex-1">
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm text-gray-700 lg:text-lg"
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg" />
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          confirmPassword: e.target.value
                        })
                      }
                      placeholder="Confirm Password"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none block w-full pl-12 p-3"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="flex flex-col items-start w-full">
              <div className="mb-6 w-full">
                <h2 className="text-2xl font-bold sm:text-3xl lg:text-5xl text-left">
                  Verify Your Email
                </h2>
              </div>
              <p className="text-left mb-4 text-gray-700 sm:text-lg lg:text-2xl">
                We emailed you a six-digit code to {formData.email}. Enter the
                code below to confirm your email address.
              </p>

              <div className="flex justify-center items-center gap-2 mb-8">
                {[...Array(6)].map((_, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength="1"
                    className="w-20 h-20 text-center text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                    onChange={(e) => {
                      if (e.target.value.length === 1 && index < 5) {
                        e.target.nextSibling.focus();
                      }
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-between items-center">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handlePrevious}
                className="px-6 py-3 bg-gray-300 text-white rounded-lg"
              >
                Previous
              </button>
            )}
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg"
            >
              {currentStep === totalSteps ? "Submit" : "Next"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
