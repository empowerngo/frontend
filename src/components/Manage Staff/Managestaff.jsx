import { useState, useEffect } from "react";
import AddStaff from "./AddStaff";
import StaffTable from "./StaffTable";
import { hasAccess, validateAccess } from "../../utils/ValidateAccess";
import { useSelector } from "react-redux";

const ManageStaff = () => {
  const [staffList, setStaffList] = useState([]);
  const [editStaff, setEditStaff] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const usageDetails = useSelector((state) => state.usageDetails);
  const canSubmit = hasAccess(usageDetails, "NUMBER_OF_USERS");

  useEffect(() => {
    const storedStaff = JSON.parse(localStorage.getItem("staffList")) || [];
    setStaffList(storedStaff);
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
        />
      )}
      <StaffTable staffList={staffList} setEditStaff={setEditStaff} />
    </div>
  );
};

export default ManageStaff;
