import { useState, useEffect } from "react";
import AddDonor from "./AddDonor";
import DonorTable from "./DonorTable";
import Loading from "../LoadingSpinner";

const ManageDonor = () => {
  const [donorList, setDonorList] = useState([]);
  const [editDonor, setEditDonor] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const storedDonors = JSON.parse(localStorage.getItem("donorList")) || [];
      setDonorList(storedDonors);
      setLoading(false);
    }, 1000);
  }, []);

  const handleAddOrUpdateDonor = (donorData) => {
    let updatedList;
    if (editDonor) {
      updatedList = donorList.map((donor) =>
        donor.email === editDonor.email ? donorData : donor
      );
    } else {
      updatedList = [...donorList, donorData];
    }

    setDonorList(updatedList);
    localStorage.setItem("donorList", JSON.stringify(updatedList));
    setEditDonor(null);
    setShowForm(false);
  };

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-left mb-6 text-blue-700 underline">
        Manage Donor
      </h1>
      <button
        onClick={toggleForm}
        className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 mb-4"
      >
        {showForm ? "Hide Donor Form" : "Add New Donor"}
      </button>

      {showForm && (
        <AddDonor
          onAddOrUpdateDonor={handleAddOrUpdateDonor}
          editDonor={editDonor}
          setEditDonor={setEditDonor}
          setReload={setReload}
        />
      )}

      {loading ? (
        <div className="flex justify-center items-center">
          <Loading />
        </div>
      ) : (
        <DonorTable donorList={donorList} setEditDonor={setEditDonor} reload={reload} />
      )}
    </div>
  );
};

export default ManageDonor;
