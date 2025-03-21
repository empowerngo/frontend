import { useState, useEffect } from "react";
import AddPlan from "./AddPlan";
import PlanTable from "./PlanTable";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ManagePlan = () => {
  const [planList, setPlanList] = useState([]);
  const [editPlan, setEditPlan] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const storedPlan = JSON.parse(localStorage.getItem("planList")) || [];
    // console.log("storedPlan - ", storedPlan);
    setPlanList(storedPlan);
  }, []);

  const handleAddOrUpdatePlan = (planData) => {
    let updatedList;
    if (editPlan) {
      updatedList = planList.map((plan) =>
        plan.email === editPlan.planID ? planData : plan
      );
      toast.success("Plan updated successfully!");
    } else {
      updatedList = [...planList, planData];
      toast.success("Plan added successfully!");
    }

    setPlanList(updatedList);
    localStorage.setItem("planList", JSON.stringify(updatedList));
    setEditPlan(null);
    setShowForm(false);
  };

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-left mb-6 text-blue-700 underline">
        Manage Subscription Plans
      </h1>
      <button
        onClick={toggleForm}
        className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 mb-4"
      >
        {showForm ? "Hide Plan Form" : "Add New Plan"}
      </button>

      {showForm && (
        <AddPlan
          onAddOrUpdatePlan={handleAddOrUpdatePlan}
          editPlan={editPlan}
          setEditPlan={setEditPlan}
        />
      )}
      <PlanTable planList={planList} setEditPlan={setEditPlan} />

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};

export default ManagePlan;
