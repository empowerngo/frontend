import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { manageProject, managePurpose } from "../../api/masterApi";
import Swal from "sweetalert2";

const AddProjectAndPurposeForm = ({
  onAddOrUpdate,
  editItem,
  setEditItem,
  projects = [],
  isProject,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm();

  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ngoID, setNgoID] = useState(null);
  const [createdBy, setCreatedBy] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData?.NGO_ID) setNgoID(userData.NGO_ID);
    if (userData?.USER_ID) setCreatedBy(userData.USER_ID);
  }, []);

  useEffect(() => {
    if (editItem) {
      setValue(isProject ? "projectName" : "purposeName", isProject ? editItem.projectName : editItem.purposeName);
      if (!isProject) {
        setValue("projectID", editItem.PROJECT_ID || "");
      }
    } else {
      reset();
    }
  }, [editItem, setValue, reset, isProject]);

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      setLoading(true);

      if (!ngoID || !createdBy) {
        throw new Error("Missing NGO ID or Created By details.");
      }

      const formData = new FormData();
      formData.append("ngoID", ngoID);
      formData.append("createdBy", createdBy);
      formData.append("reqType", editItem ? "u" : "s"); 

      if (isProject) {
        formData.append("projectName", data.projectName);
        if (editItem) formData.append("projectID", editItem.PROJECT_ID);
      } else {
        const projectID = data.projectID || editItem?.PROJECT_ID;
        if (!projectID) {
          throw new Error("Project ID is required to add a purpose.");
        }
        formData.append("projectID", projectID);
        formData.append("purposeName", data.purposeName);
        if (editItem) formData.append("purposeID", editItem.PURPOSE_ID);
      }

      if (isProject) {
        await manageProject(formData);
      } else {
        await managePurpose(formData); 
      }

      Swal.fire({
        icon: "success",
        title: editItem ? (isProject ? "Project Updated" : "Purpose Updated") : isProject ? "Project Added" : "Purpose Added",
        text: editItem ? "Details updated successfully!" : "Successfully added!",
      });

      reset();
      setEditItem(null);
      if (onAddOrUpdate) onAddOrUpdate(data.projectID);
    } catch (error) {
      console.error("Error saving:", error);
      toast.error("Error saving: " + error.message);
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 shadow-md rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        {editItem ? (isProject ? "Edit Project" : "Edit Purpose") : isProject ? "Add Project" : "Add Purpose"}
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4 items-center">
  {!isProject && (
    <div>
      {/* <label className="block text-gray-700">Select Project</label> */}
      <select {...register("projectID", { required: "Project selection is required" })} className="border p-2 rounded-lg w-full">
        <option value="">Select Project</option>
        {projects.length > 0 ? (
          projects.map((project) => (
            <option key={project.PROJECT_ID} value={project.PROJECT_ID}>{project.PROJECT_NAME}</option>
          ))
        ) : (
          <option disabled>No projects available</option>
        )}
      </select>
      {errors.projectID && <p className="text-red-500 text-sm">{errors.projectID.message}</p>}
    </div>
  )}

  {/* Aligning Input field and Submit button to the right center */}
  <div className="flex justify-end items-center gap-4">
    <input 
      {...register(isProject ? "projectName" : "purposeName", { required: `${isProject ? "Project" : "Purpose"} name is required` })} 
      placeholder={`Enter ${isProject ? "Project" : "Purpose"} Name`} 
      className="border p-2 rounded-lg w-full" 
    />
    
    <button type="submit" className={`py-2 px-4 rounded-lg text-white ${isProject ? "bg-blue-600 hover:bg-blue-700" : "bg-green-600 hover:bg-green-700"}`} disabled={isSubmitting}>
      {isSubmitting ? "Processing..." : editItem ? "Update" : "Add"}
    </button>
  </div>
</form>
    </div>
  );
};

export default AddProjectAndPurposeForm;
