import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { registerPlan, getSubsPlans } from "../../api/masterApi";
import renderInputField from "../../components/CustomInputField";
import Loading from "../../components/LoadingSpinner";
import Swal from "sweetalert2";
import { FaUser, FaEnvelope, FaPhone, FaEye, FaEyeSlash } from "react-icons/fa";

const AddPlan = ({ onAddOrUpdatePlan, editPlan, setEditPlan }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm();

  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [planList, setPlanList] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState("");

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData?.USER_ID) setValue("userID", userData.USER_ID);
    // if (userData?.NGO_ID) setValue("ngoID", userData.NGO_ID);
    // if (userData?.ROLE_CODE) {
    //   setUserRole(userData.ROLE_CODE);
    //   setValue("userRole", userData.ROLE_CODE);
    // }
  }, [setValue]);

  useEffect(() => {
    if (editPlan) {
      Object.keys(editPlan).forEach((key) => setValue(key, editPlan[key]));
    } else {
      reset();
    }
  }, [editPlan, setValue, reset]);
  useEffect(() => {
    const fetchPlanList = async () => {
      try {
        const plans = await getSubsPlans(); // Correct format
        console.log("Plan List API Response:", plans); // Debugging
        setPlanList(Array.isArray(plans.payload) ? plans.payload : []); // Use ngos.payload
      } catch (error) {
        console.error("Error fetching Plan list:", error);
        setPlanList([]); // Prevent crash
      }
    };

    if (userRole === 1) {
      fetchPlanList();
    }
  }, [userRole]);

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      setLoading(true);
      data.reqType = "s";
      data.planID =
        userRole === 1
          ? selectedPlan
          : JSON.parse(localStorage.getItem("plan"))?.PLAN_ID;
      // data.userID = JSON.parse(localStorage.getItem("user"))?.USER_ID;

      await registerPlan(data);

      Swal.fire({
        icon: "success",
        title: editPlan ? "Plan Updated" : "Plan Added",
        text: editPlan
          ? "Plan details updated successfully!"
          : "Plan has been successfully added!",
      });

      reset();
      setEditPlan(null);
      if (onAddOrUpdatePlan) onAddOrUpdatePlan();
    } catch (error) {
      console.error("Error registering Plan:", error);
      toast.error("Error registering Plan!");
      Swal.fire({
        icon: "fail",
        title: editPlan ? "Plan update failed" : "Plan addition failed",
        text: editPlan ? "Failed to update Plan!" : "Failed to add Plan",
      });
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">
        {editPlan ? "Edit" : "Add"}
      </h2>

      {loading && <Loading />}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {renderInputField(
          register,
          errors,
          "Plan Name",
          "planName",
          { required: "Plan name is required" },
          "text",
          "Enter Plan name",
          FaUser
        )}

        {renderInputField(
          register,
          errors,
          "Plan Price (₹)", // Added currency symbol
          "planPrice",
          {
            required: "Plan price is required",
            validate: (value) => {
              const num = Number(value); // Attempt to convert to a number

              if (isNaN(num)) {
                return "Plan price must be a number.";
              }

              if (num <= 0) {
                return "Plan price must be greater than zero.";
              }

              return true; // Validation passed
            },
          },
          "text", // Or "number" if you prefer a number input (see below)
          "Enter Plan price",
          FaUser
        )}

        {renderInputField(
          register,
          errors,
          "Number of Users",
          "numberOfUsers",
          { required: "Number of users is required", min: 1 },
          "number",
          "",
          null
        )}
        {/* {renderInputField(
          register,
          errors,
          "Number of Donors",
          "numberOfDonors",
          { required: "Number of donors is required", min: 0 },
          "number",
          "",
          null
        )} */}
        {renderInputField(
          register,
          errors,
          "Number of Donations",
          "numberOfDonations",
          { required: "Number of donations is required", min: 0 },
          "number",
          "",
          null
        )}
        {renderInputField(
          register,
          errors,
          "Number of Projects",
          "numberOfProjects",
          { required: "Number of Projects is required", min: 0 },
          "number",
          "",
          null
        )}
        {renderInputField(
          register,
          errors,
          "Plan Validity",
          "planValidity",
          { required: "Number of days is required", min: 1 },
          "number",
          "",
          null
        )}
        {renderInputField(
          register,
          errors,
          "10BE Mail",
          "form10BEMail",
          {},
          "checkbox",
          "",
          null
        )}
        {renderInputField(
          register,
          errors,
          "10Bd",
          "form10BdData",
          {},
          "checkbox",
          "",
          null
        )}
        {renderInputField(
          register,
          errors,
          "CA Access",
          "caAccess",
          {},
          "checkbox",
          "",
          null
        )}

        <div className="md:col-span-2 flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Processing..."
              : editPlan
              ? "Update Plan"
              : "Add Plan"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPlan;
