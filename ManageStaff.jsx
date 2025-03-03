<<<<<<< HEAD
import { useState, useEffect } from "react";
import AddStaff from "./AddStaff";
import StaffTable from "./StaffTable";

const ManageStaff = () => {
  const [staffList, setStaffList] = useState([]);
  const [editStaff, setEditStaff] = useState(null); 

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
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-left mb-6 text-blue-700 underline">Manage User</h1>
      <AddStaff onAddOrUpdateStaff={handleAddOrUpdateStaff} editStaff={editStaff} setEditStaff={setEditStaff} />
      <StaffTable staffList={staffList} setEditStaff={setEditStaff} />
    </div>
  );
};

export default ManageStaff;
=======
import { useState, useEffect } from "react";
import AddStaff from "./AddStaff";
import StaffTable from "./StaffTable";

const ManageStaff = () => {
  const [staffList, setStaffList] = useState([]);
  const [editStaff, setEditStaff] = useState(null); 

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
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-left mb-6 text-blue-700 underline">Manage User</h1>
      <AddStaff onAddOrUpdateStaff={handleAddOrUpdateStaff} editStaff={editStaff} setEditStaff={setEditStaff} />
      <StaffTable staffList={staffList} setEditStaff={setEditStaff} />
    </div>
  );
};

export default ManageStaff;
>>>>>>> 1b501a74b4f69fbfed1fb83df690f526d6a2d50e
