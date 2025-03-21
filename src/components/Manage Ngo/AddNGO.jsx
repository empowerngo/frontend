import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { handleNGORequest } from "../../api/masterApi";
import { uploadToCloudinary } from "../../utils/helper";
import renderInputField from "../CustomInputField";
import Loading from "../LoadingSpinner";
import { validateField } from "./validation";
import { ToastContainer, toast } from "react-toastify";
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
const RegisterNGO = () => {
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
  const [countries, setCountries] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const selectedCountry = watch("ngoCountry");
  const selectedState = watch("ngoState");
  const selectedLogo = watch("logourl");
  const selectedSignature = watch("signatureurl");
  const selectedSeal = watch("sealurl");
  const [subscriptionData, setSubscriptionData] = useState([]);

  // State variables for dynamic dropdowns
  const [stateData, setStateData] = useState([]);
  const [cityData, setCityData] = useState([]);

  const countryData = Country.getAllCountries().map((country) => ({
    value: country.isoCode,
    displayValue: country.name,
  }));

  useEffect(() => {
    const planData = localStorage.getItem("plans");
    let parsedData = JSON.parse(planData).map((plan) => ({
      value: String(plan.planID),
      displayValue: plan.planName,
    }));
    // console.log(parsedData);
    setSubscriptionData(parsedData);
  }, []);

  // Update States when country changes
  useEffect(() => {
    if (selectedCountry) {
      // console.log(selectedCountry);
      const states = State.getStatesOfCountry(selectedCountry).map((state) => ({
        value: state.isoCode,
        displayValue: state.name,
      }));
      setStateData(states);
      setValue("ngoState", ""); // Reset state selection
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
          value: city.stateCode,
          displayValue: city.name,
        })
      );
      // console.log(cities);
      setCityData(cities);
      setValue("ngoCity", ""); // Reset city selection
    } else {
      setCityData([]);
    }
  }, [selectedState, selectedCountry, setValue]);

  const handleFileUpload = async (file, type) => {
    if (file && file.length > 0) {
      // Correct check
      setUploading(true);
      const uploadedUrl = await uploadToCloudinary(
        file[0],
        type,
        setValue,
        setUploading
      );
      // console.log(uploadedUrl);
      return uploadedUrl;
    }
    return null;
  };

  const validateImage = (file) => {
    if (!file || file.length === 0) {
      return "Image is required";
    }
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(file[0].type)) {
      return "Only JPG, JPEG, and PNG formats are allowed";
    }
    if (file[0].size > 2 * 1024 * 1024) {
      return "File size should not exceed 2MB";
    }
    return true;
  };

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      const {
        authorizedPerson,
        contactPerson,
        ngo12ANumber,
        ngo80GNumber,
        ngoAddress,
        ngoCSRNumber,
        ngoCity,
        subscriptionp,
        ngoContact,
        ngoCountry,
        ngoEmail,
        ngoFCRANumber,
        ngoName,
        ngoPAN,
        ngoPinCode,
        ngoRegNumber,
        ngoState,
        ngo80GDate,
      } = data;

      const logoURL = await handleFileUpload(selectedLogo, "logourl");
      const signatureURL = await handleFileUpload(
        selectedSignature,
        "signatureurl"
      );
      const sealURL = await handleFileUpload(selectedSeal, "sealurl");

      const payload = {
        reqType: "s",
        logoURL: logoURL || "",
        signatureURL: signatureURL || "",
        ngoSealURL: sealURL || "",
        planID: subscriptionp,
        ngoCity,
        authorizedPerson,
        contactPerson,
        ngo12ANumber,
        ngo80GNumber,
        ngoAddress,
        ngoCSRNumber,
        ngoContact,
        ngoCountry,
        ngoEmail,
        ngoFCRANumber,
        ngoName,
        ngoPAN,
        ngoPinCode,
        ngoRegNumber,
        ngoState,
        reg80GDate: ngo80GDate,
      };

      const response = await handleNGORequest(payload, "s");
      if (response.statusCode === 409) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "An NGO with this Email or PAN already exists.",
        });
        return;
      }
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "NGO Registered Successfully!",
      });
      reset();
    } catch (error) {
      console.error("Error registering NGO:", error);
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Error registering NGO! Please try again.",
      });
    } finally {
      setIsSubmitting(false);
      setUploading(false);
    }
  };

  return (
    <div className="w-full max-w-8xl mx-auto bg-white p-6 md:p-10 rounded-xl shadow-xl border border-gray-200">
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
      <h2 className="text-sm md:text-4xl font-bold text-gray-700 mb-6 md:mb-8 uppercase text-left">
        Register NGO
      </h2>
      {isSubmitting && <Loading />}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {renderInputField(
            register,
            errors,
            "NGO Name",
            "ngoName",
            validateField("ngoName"),
            "text",
            "Enter NGO Name",
            FaUser
          )}
          {renderInputField(
            register,
            errors,
            "Registration Number",
            "ngoRegNumber",
            validateField("ngoRegNumber"),
            "text",
            "Enter Registration Number",
            FaIdCard
          )}
          {renderInputField(
            register,
            errors,
            "NGO Address",
            "ngoAddress",
            validateField("ngoAddress"),
            "text",
            "Enter NGO Address",
            FaMapMarkerAlt
          )}
          {renderInputField(
            register,
            errors,
            "Country",
            "ngoCountry",
            validateField("ngoCountry"),
            "select",
            "Select Country",
            FaGlobe,
            { options: countryData }
          )}
          {renderInputField(
            register,
            errors,
            "State",
            "ngoState",
            validateField("ngoState"),
            "select",
            "Enter State",
            FaGlobe,
            { options: stateData }
          )}{" "}
          {renderInputField(
            register,
            errors,
            "City",
            "ngoCity",
            validateField("ngoCity"),
            "select",
            "Enter City",
            FaCity,
            { options: cityData }
          )}
          {renderInputField(
            register,
            errors,
            "Subscription",
            "subscriptionp",
            validateField("subscriptionp"),
            "select",
            "Select Subscription Plan",
            FaCity,
            { options: subscriptionData }
          )}
          {renderInputField(
            register,
            errors,
            "Pin Code",
            "ngoPinCode",
            validateField("ngoPinCode"),
            "text",
            "Enter Pin Code",
            FaMapMarkerAlt
          )}
          {renderInputField(
            register,
            errors,
            "Email",
            "ngoEmail",
            validateField("ngoEmail"),
            "email",
            "Enter Email",
            FaEnvelope
          )}
          {renderInputField(
            register,
            errors,
            "Contact",
            "ngoContact",
            validateField("ngoContact"),
            "tel", // Use "tel" for better mobile support
            "Enter Contact",
            FaPhone
            // {},
            // {
            //   onKeyDown: (e) => {
            //     if (
            //       !/[0-9]/.test(e.key) &&
            //       e.key !== "Backspace" &&
            //       e.key !== "Tab"
            //     ) {
            //       e.preventDefault(); // Blocks non-numeric characters
            //     }
            //   },
            //   onInput: (e) => {
            //     e.target.value = e.target.value.replace(/\D/g, ""); // Removes any non-numeric characters dynamically
            //   },
            // }
          )}
          {renderInputField(
            register,
            errors,
            "Authorized Person",
            "authorizedPerson",
            validateField("ngoRegauthorizedPersonNumber"),
            "text",
            "Enter Authorized Person",
            FaUser
          )}
          {renderInputField(
            register,
            errors,
            "PAN Number",
            "ngoPAN",
            validateField("ngoPAN"),
            "text",
            "Enter PAN Number",
            FaIdCard
          )}
          {renderInputField(
            register,
            errors,
            "Contact Person",
            "contactPerson",
            validateField("contactPerson"),
            "text",
            "Enter Contact Person",
            FaUser
          )}
          {renderInputField(
            register,
            errors,
            "12A Number",
            "ngo12ANumber",
            validateField("ngo12ANumber"),
            "text",
            "Enter 12A Number",
            FaIdCard
          )}
          {renderInputField(
            register,
            errors,
            "CSR Number",
            "ngoCSRNumber",
            validateField("ngoCSRNumber"),
            "text",
            "Enter CSR Number",
            FaBriefcase
          )}
          {renderInputField(
            register,
            errors,
            "FCRA Number",
            "ngoFCRANumber",
            validateField("ngoFCRANumber"),
            "text",
            "Enter FCRA Number",
            FaBriefcase
          )}
          {renderInputField(
            register,
            errors,
            "80G Number",
            "ngo80GNumber",
            validateField("ngo80GNumber"),
            "text",
            "Enter 80G Number",
            FaBriefcase
          )}
          {renderInputField(
            register,
            errors,
            "80G Date",
            "ngo80GDate",
            validateField("ngo80GDate"),
            "date",
            "Enter 80G Date",
            FaBriefcase
          )}
          {/* Add file input fields for logo and signature */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              NGO Logo
            </label>
            <input
              type="file"
              accept="image/*"
              {...register("logourl", {
                validate: validateImage,
              })}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
            {errors.logourl && (
              <p className="text-red-500 text-sm">{errors.logourl.message}</p>
            )}
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              NGO Signature
            </label>
            <input
              type="file"
              accept="image/*"
              {...register("signatureurl", {
                validate: validateImage,
              })}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
            {errors.signatureurl && (
              <p className="text-red-500 text-sm">
                {errors.signatureurl.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              NGO Seal
            </label>
            <input
              type="file"
              accept="image/*"
              {...register("sealurl", {
                validate: validateImage,
              })}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
            {errors.sealurl && (
              <p className="text-red-500 text-sm">{errors.sealurl.message}</p>
            )}
          </div>
        </div>

        <div className="flex justify-center md:justify-end">
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Registering..." : "Register NGO"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterNGO;
