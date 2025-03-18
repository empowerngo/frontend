import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import { State, City, Country } from "country-state-city";
import {
  FaUser,
  FaMapMarkerAlt,
  FaCity,
  FaGlobe,
  FaPhone,
  FaEnvelope,
  FaBriefcase,
  FaIdCard,
} from "react-icons/fa";

import renderInputField from "../CustomInputField";
import { handleDonorRequest } from "../../api/masterApi";
import { validateField } from "./validation";
import Loading from "../LoadingSpinner";

// const DonorForm = () => {
//   const [loading, setLoading] = useState(false);
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset
//   } = useForm();

const DonorForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm({
    mode: "onBlur", // Trigger validation on blur
  });
  const [loading, setLoading] = useState(false);
  const [stateData, setStateData] = useState([]);
  const [cityData, setCityData] = useState([]);
  const selectedCountry = watch("donorCountry");
  const selectedState = watch("donorState");

  const countryData = Country.getAllCountries().map((country) => ({
    value: country.isoCode,
    displayValue: country.name,
  }));

  // Update States when country changes
  useEffect(() => {
    if (selectedCountry) {
      console.log(selectedCountry);
      const states = State.getStatesOfCountry(selectedCountry).map((state) => ({
        value: state.isoCode,
        displayValue: state.name,
      }));
      setStateData(states);
      setValue("donorState", ""); // Reset state selection
      setCityData([]); // Reset cities
    } else {
      setStateData([]);
    }
  }, [selectedCountry, setValue]);

  // Update Cities when state changes
  useEffect(() => {
    if (selectedState) {
      const cities = City.getCitiesOfState(selectedCountry, selectedState).map(
        (city) => ({
          value: city.isoCode,
          displayValue: city.name,
        })
      );
      setCityData(cities);
      setValue("donorCity", ""); // Reset city selection
    } else {
      setCityData([]);
    }
  }, [selectedState, selectedCountry, setValue]);

  const onSubmit = async (formData) => {
    try {
      console.log("Submitting form...");
      setLoading(true);

      const userData = JSON.parse(localStorage.getItem("user"));
      if (!userData?.NGO_ID) {
        console.log("NGO_ID not found");
        toast.error("NGO_ID not found. Please login again.");
        setLoading(false);
        return;
      }
      const { donorMName, ...filteredData } = formData;
      const data = { ...filteredData, donorNGOID: userData.NGO_ID };
      const reqType = "s";
      const response = await handleDonorRequest(data, reqType);
      console.log("Donor API Response:", response);
      Swal.fire({
        title: "Success!",
        text: "Donor added successfully!",
        icon: "success",
        confirmButtonText: "OK",
      });
      reset();
    } catch (error) {
      console.error("Error submitting donor data:", error);
      toast.error(
        `Error: ${
          error.response?.data?.message || "Failed to submit donor details"
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-8xl mx-auto bg-white p-6 md:p-10 rounded-xl shadow-xl border border-gray-200">
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
      <h2 className="text-sm md:text-4xl font-bold text-gray-900 mb-6 md:mb-8 uppercase text-left">
        Donor Information
      </h2>
      {loading && <Loading />}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {renderInputField(
            register,
            errors,
            "First Name",
            "donorFName",
            validateField("donorFName"),
            "text",
            "Enter first name",
            FaUser
          )}
          {renderInputField(
            register,
            errors,
            "Middle Name",
            "donorMName",
            {},
            "text",
            "Enter middle name",
            FaUser
          )}
          {renderInputField(
            register,
            errors,
            "Last Name",
            "donorLName",
            validateField("donorLName"),
            "text",
            "Enter last name",
            FaUser
          )}
          {renderInputField(
            register,
            errors,
            "Address",
            "donorAddress",
            validateField("donorAddress"),
            "text",
            "Enter address",
            FaMapMarkerAlt
          )}
          {renderInputField(
            register,
            errors,
            "Country",
            "donorCountry",
            validateField("donorCountry"),
            "select", // ✅ Changed from "text" to "select"
            "Select Country",
            FaGlobe,
            { options: countryData }, // ✅ Pass the fetched country list as dropdown options
            { defaultValue: "India" }
          )}
          {renderInputField(
            register,
            errors,
            "State",
            "donorState",
            validateField("donorState"),
            "select",
            "Enter State",
            FaGlobe,
            { options: stateData },
            { defaultValue: "Maharashtra" }
          )}{" "}
          {renderInputField(
            register,
            errors,
            "City",
            "donorCity",
            validateField("donorCity"),
            "select",
            "Enter City",
            FaCity,
            { options: cityData }
          )}
          {renderInputField(
            register,
            errors,
            "Pincode",
            "donorPinCode",
            validateField("donorPinCode"),
            "text",
            "Enter pincode",
            FaMapMarkerAlt
          )}
          {renderInputField(
            register,
            errors,
            "Mobile",
            "donorMobile",
            validateField("donorMobile"),
            "tel",
            "Enter mobile number",
            FaPhone
          )}
          {renderInputField(
            register,
            errors,
            "Email",
            "donorEmail",
            validateField("donorEmail"),
            "email",
            "Enter email",
            FaEnvelope
          )}
          {renderInputField(
            register,
            errors,
            "PAN Number",
            "donorPAN",
            validateField("donorPAN"),
            "text",
            "Enter PAN number",
            FaIdCard
          )}
          {renderInputField(
            register,
            errors,
            "Profession",
            "donorProfession",
            validateField("donorProfession"),
            "text",
            "Enter profession",
            FaBriefcase
          )}
          {renderInputField(
    register,
    errors,
    "Donor Type",
    "donorType",
    validateField("donorType"),
    "select",
    "Select Donor Type",
    FaBriefcase,
    {
        options: [
            { value: "Individual", displayValue: "Individual" },
            { value: "Corporate", displayValue: "Corporate" },
            { value: "Group", displayValue: "Group" },
            { value: "NGO", displayValue: "NGO" },
        ],
    },
    { // Add this object to pass register options
        defaultValue: "Individual"
    }
)}
        </div>
        <div className="flex justify-center md:justify-end">
          {/* <CustomButton type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </CustomButton> */}
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DonorForm;
