import React, { useState } from "react";
import ManageNGOForm from "../Manage Ngo/ManageNgo";
import ManageNGOTable from "../Manage Ngo/ManageNGOTable";
import Loading from "../LoadingSpinner";

const Manage = () => {
  const [ngoList, setNgos] = useState([]);
  const [editData, setEditData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false); // State to toggle form visibility

  const addNGO = (ngo) => {
    setIsLoading(true);
    setTimeout(() => {
      if (editData) {
        setNgos(ngoList.map((item) => (item.email === editData.email ? ngo : item)));
        setEditData(null);
      } else {
        setNgos([...ngoList, ngo]);
      }
      setIsLoading(false);
    }, 1000);
  };

  const toggleForm = () => {
    setShowForm(!showForm); 
  };

  return (
    <div className="p-6">
      <button
        onClick={toggleForm}
        className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 mb-4"
      >
        {showForm ? "Hide NGO Form" : "Add New NGO"}
      </button>

      {isLoading ? (
        <Loading />
      ) : (
        <>
          {showForm && <ManageNGOForm addNGO={addNGO} editData={editData} />}
          <ManageNGOTable ngoList={ngoList} setEditNGO={setEditData} />
        </>
      )}
    </div>
  );
};

export default Manage;
