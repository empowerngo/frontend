import { useState, useEffect } from "react";
import AddProjectAndPurposeForm from "./AddProject";
import ProjectAndPurposeTable from "./ProjectsTable";
import { getProjects, getPurposes } from "../../api/masterApi";

const ManageProjects = () => {
  const [projectList, setProjectList] = useState([]);
  const [editProject, setEditProject] = useState(null);
  const [showProjectForm, setShowProjectForm] = useState(false);

  const [purposeList, setPurposeList] = useState([]);
  const [editPurpose, setEditPurpose] = useState(null);
  const [showPurposeForm, setShowPurposeForm] = useState(false);
  const [ngoID, setNgoID] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData?.NGO_ID) {
      setNgoID(userData.NGO_ID);
      fetchProjects(userData.NGO_ID);
    }
  }, []);

  const fetchProjects = async (ngoID) => {
    try {
      const fetchedProjects = await getProjects(ngoID);
      setProjectList(Array.isArray(fetchedProjects) ? fetchedProjects : []);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const fetchPurposes = async (ngoID, projectID) => {
    try {
      const fetchedPurposes = await getPurposes(ngoID, projectID);
      setPurposeList(Array.isArray(fetchedPurposes) ? fetchedPurposes : []);
    } catch (error) {
      console.error("Error fetching purposes:", error);
    }
  };

  const handleAddOrUpdateProject = () => {
    fetchProjects(ngoID);
    setEditProject(null);
    setShowProjectForm(false);
  };

  const handleAddOrUpdatePurpose = (projectID) => {
    fetchPurposes(ngoID, projectID);
    setEditPurpose(null);
    setShowPurposeForm(false);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-left mb-6 text-blue-700 underline">Manage Projects and Purposes</h1>
      <div className="mb-8">
        <button onClick={() => setShowProjectForm(!showProjectForm)} className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 mb-4">
          {showProjectForm ? "Hide Project Form" : "Add New Project"}
        </button>
        {showProjectForm && <AddProjectAndPurposeForm onAddOrUpdate={handleAddOrUpdateProject} editItem={editProject} setEditItem={setEditProject} isProject={true} />}
        <ProjectAndPurposeTable items={projectList} handleEdit={setEditProject} handleDelete={() => {}} fetchData={fetchProjects} isProject={true} />
      </div>
      <div>
        <button onClick={() => setShowPurposeForm(!showPurposeForm)} className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 mb-4">
          {showPurposeForm ? "Hide Purpose Form" : "Add New Purpose"}
        </button>
        {showPurposeForm && <AddProjectAndPurposeForm onAddOrUpdate={handleAddOrUpdatePurpose} editItem={editPurpose} setEditItem={setEditPurpose} projects={projectList} isProject={false} />}
        <ProjectAndPurposeTable items={purposeList} handleEdit={setEditPurpose} handleDelete={() => {}} fetchData={fetchPurposes} isProject={false} />
      </div>
    </div>
  );
};

export default ManageProjects;
