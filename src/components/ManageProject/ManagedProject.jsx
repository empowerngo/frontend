import { useState, useEffect } from "react";
import ProjectForm from "./AddProject";
import ProjectsTable from "./ProjectsTable";
import { getProjects, getPurposes } from "../../api/masterApi";
import { useSelector } from "react-redux";
import Decrypt from "../../Decrypt";

const ManageProjects = () => {
  const encryptedUserData = useSelector((state) => state.userData);
  const [projectList, setProjectList] = useState([]);
  const [editProject, setEditProject] = useState(null);
  const [showProjectForm, setShowProjectForm] = useState(false);

  const [purposeList, setPurposeList] = useState([]);
  const [editPurpose, setEditPurpose] = useState(null);
  const [showPurposeForm, setShowPurposeForm] = useState(false);
  const [ngoID, setNgoID] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(Decrypt(encryptedUserData));
    if (userData?.NGO_ID) {
      setNgoID(userData.NGO_ID);
    }
  }, []);

  useEffect(() => {
    if (ngoID) {
      fetchProjects(ngoID);
    }
  }, [ngoID]);

  const fetchProjects = async (ngoID) => {
    if (!ngoID) return;
    try {
      const fetchedProjects = await getProjects(ngoID);
      setProjectList(Array.isArray(fetchedProjects) ? fetchedProjects : []);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const fetchPurposes = async (ngoID, projectID) => {
    if (!ngoID || !projectID) return;
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
    if (!projectID) return;
    fetchPurposes(ngoID, projectID);
    setEditPurpose(null);
    setShowPurposeForm(false);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-left mb-6 text-blue-700 underline">
        Manage Projects and Purposes
      </h1>

      <div className="mb-8 border p-4 rounded-lg shadow-md bg-gray-100">
        <h2 className="text-xl font-semibold mb-4">Add Project and Purpose</h2>
        <button
          onClick={() => setShowProjectForm(!showProjectForm)}
          className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 mb-4"
        >
          {showProjectForm ? "Hide Project Form" : "Add Project"}
        </button>

        {showProjectForm && (
          <>
            <ProjectForm
              onAddOrUpdate={handleAddOrUpdateProject}
              editItem={editProject}
              setEditItem={setEditProject}
              isProject={true}
            />
            <button
              onClick={() => setShowPurposeForm(!showPurposeForm)}
              className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 mt-4"
            >
              {showPurposeForm ? "Hide Purpose Form" : "Add Purpose"}
            </button>
            {showPurposeForm && (
              <ProjectForm
                onAddOrUpdate={handleAddOrUpdatePurpose}
                editItem={editPurpose}
                setEditItem={setEditPurpose}
                projects={projectList}
                isProject={false}
              />
            )}
          </>
        )}
      </div>

      <div>
        <ProjectsTable
          items={purposeList}
          handleEdit={setEditPurpose}
          handleDelete={() => {}}
          fetchData={(projectID) => fetchPurposes(ngoID, projectID)}
          isProject={false}
        />
      </div>
    </div>
  );
};

export default ManageProjects;
