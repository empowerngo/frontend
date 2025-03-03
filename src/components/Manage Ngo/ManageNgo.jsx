import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2"; 
import { registerNgo } from "../../api/masterApi";
import { uploadToCloudinary } from "../../utils/helper";
import renderInputField from "../../components/CustomInputField";
import Loading from "../../components/LoadingSpinner";
const RegisterNGO = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue
  } = useForm();
  const [countries, setCountries] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const selectedLogo = watch("logoURL");
  const selectedSignature = watch("signatureURL");
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch("https://restcountries.com/v3.1/all");
        if (!response.ok) throw new Error("Failed to fetch countries");
        const data = await response.json();
        setCountries(data.map((c) => c.name.common).sort());
      } catch (err) {
        console.error("Error fetching countries:", err);
        Swal.fire({
          icon: "error",
          title: "Oops!",
          text: "Error fetching country list!"
        });
      }
    };
    fetchCountries();
  }, []);

  const handleFileUpload = async (file, type) => {
    if (file?.[0]) {
      setUploading(true);
      const uploadedUrl = await uploadToCloudinary(
        file[0],
        type,
        setValue,
        setUploading
      );
      return uploadedUrl;
    }
    return null;
  };

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);

      const logoUrl = await handleFileUpload(selectedLogo, "logoURL");
      const signatureUrl = await handleFileUpload(
        selectedSignature,
        "signatureURL"
      );

      const formData = new FormData();
      formData.append("reqType", "s");
      formData.append("logoURL", logoUrl || "");
      formData.append("signatureURL", signatureUrl || "");

      Object.keys(data).forEach((key) => {
        if (key !== "logoURL" && key !== "signatureURL") {
          formData.append(key, data[key]);
        }
      });

      const response = await registerNgo(formData);
      if (response.statusCode === 409) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "An NGO with this Email or PAN already exists."
        });
        return; 
      }
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "NGO Registered Successfully!"
      });
      reset();
    } catch (error) {
      console.error("Error registering NGO:", error);
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Error registering NGO! Please try again."
      });
    } finally {
      setIsSubmitting(false);
      setUploading(false);
    }
  };

  return (
    <div className="bg-white p-8 shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">
        Register NGO
      </h2>
      {isSubmitting && <Loading />}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-2 gap-4"
      >
        {[
          {
            label: "NGO Name",
            name: "ngoName",
            type: "text",
            placeholder: "Enter NGO Name"
          },
          {
            label: "Registration Number",
            name: "ngoRegNumber",
            type: "text",
            placeholder: "Enter registration number"
          },
          {
            label: "NGO Address",
            name: "ngoAddress",
            type: "text",
            placeholder: "Enter NGO Address"
          },
          {
            label: "City",
            name: "ngoCity",
            type: "text",
            placeholder: "Enter City"
          },
          {
            label: "State",
            name: "ngoState",
            type: "text",
            placeholder: "Enter State"
          },
          {
            label: "Pin Code",
            name: "ngoPinCode",
            type: "text",
            placeholder: "Enter Pin Code"
          },
          {
            label: "Email",
            name: "ngoEmail",
            type: "email",
            placeholder: "Enter your email"
          },
          {
            label: "Contact",
            name: "ngoContact",
            type: "text",
            placeholder: "Enter Contact"
          },
          {
            label: "Authorized Person",
            name: "authorizedPerson",
            type: "text",
            placeholder: "Enter Authorized Person"
          },
          {
            label: "Pan Number",
            name: "ngoPAN",
            type: "text",
            placeholder: "Enter Pan Number"
          },
          {
            label: "Contact Person",
            name: "contactPerson",
            type: "text",
            placeholder: "Enter Contact Person"
          },
          {
            label: "12A Number",
            name: "ngo12ANumber",
            type: "text",
            placeholder: "Enter 12A Number"
          },
          {
            label: "CSR Number",
            name: "ngoCSRNumber",
            type: "text",
            placeholder: "Enter Ngo CSR Number"
          },
          {
            label: "FCRA Number",
            name: "ngoFCRANumber",
            type: "text",
            placeholder: "Enter Ngo FCRA Number"
          },
          {
            label: "80G Number",
            name: "ngo80GNumber",
            type: "text",
            placeholder: "Enter 80G Number"
          }
        ].map((field, index) => (
          <div key={index}>
            {renderInputField(
              register,
              errors,
              field.label,
              field.name,
              { required: `${field.label} is required` },
              field.type,
              field.placeholder
            )}
          </div>
        ))}
        <div className="col-span-1">
          <label className="block text-gray-700 font-medium mb-2">
            Country
          </label>
          <select
            {...register("ngoCountry", { required: "Country is required" })}
            className="w-full p-2 border border-gray-300 rounded-lg"
          >
            <option value="">Select Country</option>
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
          {errors.ngoCountry && (
            <p className="text-red-500 text-sm mt-1">
              {errors.ngoCountry.message}
            </p>
          )}
        </div>
        {[
          { label: "NGO Image (Docs)", name: "logoURL" },
          { label: "NGO Signature (Docs)", name: "signatureURL" }
        ].map((field, index) => (
          <div key={index}>
            <label className="block text-gray-700 font-medium mb-2">
              {field.label}
            </label>
            <input
              type="file"
              {...register(field.name)}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
        ))}
        <div className="col-span-2 flex justify-end">
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
