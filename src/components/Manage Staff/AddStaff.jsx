import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import "react-toastify/dist/ReactToastify.css";
import { registerUser, retrieveNGOList } from "../../api/masterApi";
import renderInputField from "../../components/CustomInputField";
import Loading from "../../components/LoadingSpinner";

import { FaUser, FaEnvelope, FaPhone, FaEye, FaEyeSlash } from "react-icons/fa";
import { useSelector } from "react-redux";
import Decrypt from "../../Decrypt";
import { hasAccess } from "../../utils/ValidateAccess";

const AddStaff = ({
  onAddOrUpdateStaff,
  editStaff,
  setEditStaff,
  onSubmit,
  loading,
  isSubmitting,
  userRole,
  setUserRole,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);
  const [ngoList, setNgoList] = useState([]);
  const [selectedNgo, setSelectedNgo] = useState("");
  const encryptedUserData = useSelector((state) => state.userData);

  const usageDetails = useSelector((state) => state.usageDetails);
  const canSubmit = hasAccess(usageDetails, "CA_ACCESS");

  const roleMapping = { "NGO ADMIN": 2, "NGO STAFF": 3, "NGO CA": 4 };

  useEffect(() => {
    const userData = JSON.parse(Decrypt(encryptedUserData));
    if (userData?.USER_ID) setValue("userID", userData.USER_ID);
    if (userData?.NGO_ID) setValue("ngoID", userData.NGO_ID);
    if (userData?.ROLE_CODE) {
      setUserRole(userData.ROLE_CODE);
      setValue("userRole", userData.ROLE_CODE);
    }
  }, [setValue]);

  useEffect(() => {
    if (editStaff) {
      Object.keys(editStaff).forEach((key) => setValue(key, editStaff[key]));
    } else {
      reset();
    }
  }, [editStaff, setValue, reset]);

  useEffect(() => {
    const fetchNGOList = async () => {
      try {
        const reqType = "list";
        const ngos = await retrieveNGOList(reqType);
        // console.log("NGO List API Response:", ngos);
        setNgoList(Array.isArray(ngos.payload) ? ngos.payload : []);
      } catch (error) {
        console.error("Error fetching NGO list:", error);
        setNgoList([]);
      }
    };

    if (userRole === 1) {
      fetchNGOList();
    }
  }, [userRole]);

  return (
    <div className="bg-white p-8 shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">
        {editStaff ? "Edit User" : "Add User"}
      </h2>

      {loading && <Loading />}

      <form
        onSubmit={handleSubmit(onSubmit, reset)}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {renderInputField(
          register,
          errors,
          "First Name",
          "firstName",
          { required: "First name is required" },
          "text",
          "Enter First name",
          FaUser
        )}

        {renderInputField(
          register,
          errors,
          "Last Name",
          "lastName",
          { required: "Last name is required" },
          "text",
          "Enter Last name",
          FaUser
        )}

        <div>
          <label className="block text-gray-700 font-medium mb-2">Role</label>
          {userRole === 1 ? (
            <input
              type="text"
              value="NGO ADMIN"
              readOnly
              className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 shadow-sm"
            />
          ) : (
            <select
              {...register("roleCode", { required: "Role is required" })}
              className="w-full p-2 border border-gray-300 rounded-lg"
              defaultValue={editStaff ? editStaff.roleCode : ""}
            >
              <option value="">Select a role</option>
              {userRole === 2 && (
                <>
                  <option value={roleMapping["NGO STAFF"]}>NGO Staff</option>
                  {canSubmit && (
                    <option value={roleMapping["NGO CA"]}>NGO CA</option>
                  )}
                </>
              )}
              {userRole > 2 && (
                <>
                  <option value={roleMapping["NGO STAFF"]}>NGO Staff</option>
                  {canSubmit && (
                    <option value={roleMapping["NGO CA"]}>NGO CA</option>
                  )}
                  <option value={roleMapping["NGO ADMIN"]}>NGO Admin</option>
                </>
              )}
            </select>
          )}
          {errors.roleCode && (
            <p className="text-red-500 text-sm mt-1">
              {errors.roleCode.message}
            </p>
          )}
        </div>
        {userRole === 1 && (
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              NGO Name
            </label>
            <select
              value={selectedNgo}
              onChange={(e) => setSelectedNgo(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
            >
              <option value="">Select an NGO</option>
              {ngoList.map((ngo) => (
                <option key={ngo.ngoID} value={ngo.ngoID}>
                  {ngo.ngoName}
                </option>
              ))}
            </select>
          </div>
        )}

        {renderInputField(
          register,
          errors,
          "Email Address",
          "email",
          {
            required: "Email is required",
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
              message: "Enter a valid email",
            },
          },
          "email",
          "Enter email",
          FaEnvelope
        )}

        {renderInputField(
          register,
          errors,
          "Phone Number",
          "contactNumber",
          {
            required: "Phone number is required",
            pattern: {
              value: /^[0-9]{10}$/,
              message: "Enter a valid 10-digit phone number",
            },
          },
          "tel",
          "Enter phone number",
          FaPhone
        )}

        <div className="relative">
          <label className="block text-gray-700 font-medium mb-2">
            Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            {...register("password", { required: "Password is required" })}
            className="w-full p-2 border border-gray-300 rounded-lg"
            placeholder="Enter password"
          />
          <span
            className="absolute right-3 top-11 cursor-pointer text-gray-600"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <div className="md:col-span-2 flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Processing..."
              : editStaff
              ? "Update User"
              : "Add User"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddStaff;
