import { useState, useEffect } from "react";
import AddStaff from "./AddStaff";
import StaffTable from "./StaffTable";
import { hasAccess, validateAccess } from "../../utils/ValidateAccess";
import { useSelector } from "react-redux";
import { registerUser, retrieveUserList } from "../../api/masterApi";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import Decrypt from "../../Decrypt";

const ManageStaff = () => {
  const [staffList, setStaffList] = useState([]);
  const [editStaff, setEditStaff] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showTable, setShowTable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const encryptedUserData = useSelector((state) => state.userData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const usageDetails = useSelector((state) => state.usageDetails);
  const canSubmit = hasAccess(usageDetails, "NUMBER_OF_USERS");

  const fetchUserList = async () => {
    setLoading(true);
    try {
      const response = await retrieveUserList("list");
      console.log(response);
      setShowTable(response?.payload || []);
    } catch (err) {
      console.error("Failed to fetch User data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedStaff = JSON.parse(localStorage.getItem("staffList")) || [];
    setStaffList(storedStaff);
    fetchUserList();
  }, []);

  const handleAddOrUpdateStaff = (staffData) => {
    let updatedList;
    if (editStaff) {
      updatedList = staffList.map((staff) =>
        staff.email === editStaff.email ? staffData : staff
      );
    } else {
      updatedList = [...staffList, staffData];
    }

    setStaffList(updatedList);
    localStorage.setItem("staffList", JSON.stringify(updatedList));
    setEditStaff(null);
    setShowForm(false);
  };

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  const onSubmit = async (data, reset) => {
    try {
      setIsSubmitting(true);
      setLoading(true);
      if (userRole === 1) {
        data.roleCode = 2;
      }

      data.reqType = "s";
      data.ngoID =
        userRole === 1
          ? selectedNgo
          : JSON.parse(Decrypt(encryptedUserData))?.NGO_ID;
      data.userID = JSON.parse(Decrypt(encryptedUserData))?.USER_ID;

      await registerUser(data);

      Swal.fire({
        icon: "success",
        title: editStaff ? "Staff Updated" : "Staff Added",
        text: editStaff
          ? "Staff details updated successfully!"
          : "Staff has been successfully added!",
      });

      fetchUserList();
      reset();
      setEditStaff(null);
      if (handleAddOrUpdateStaff) handleAddOrUpdateStaff();
    } catch (error) {
      console.error("Error registering User:", error);
      toast.error("Error registering User!");
      Swal.fire({
        icon: "fail",
        title: editStaff ? "User update failed" : "User addition failed",
        text: editStaff ? "Failed to update User!" : "Failed to add User",
      });
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      {!canSubmit && (
        <marquee className="text-red-500 font-bold text-lg">
          Please Upgrade your plan to add staff
        </marquee>
      )}

      <h1 className="text-3xl font-bold text-left mb-6 text-blue-700 underline">
        Manage User
      </h1>
      {canSubmit ? (
        <button
          onClick={toggleForm}
          className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 mb-4"
        >
          {showForm ? "Hide Staff Form" : "Add New Staff"}
        </button>
      ) : null}

      {showForm && (
        <AddStaff
          onAddOrUpdateStaff={handleAddOrUpdateStaff}
          editStaff={editStaff}
          setEditStaff={setEditStaff}
          onSubmit={onSubmit}
          loading={loading}
          isSubmitting={isSubmitting}
          userRole={userRole}
          setUserRole={setUserRole}
        />
      )}
      <StaffTable
        staffList={staffList}
        setEditStaff={setEditStaff}
        users={showTable}
        loading={loading}
      />
    </div>
  );
};

export default ManageStaff;
