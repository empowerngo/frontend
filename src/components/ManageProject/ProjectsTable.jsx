/* eslint-disable no-unused-vars */
import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
  Box,
  CircularProgress,
  IconButton,
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Swal from "sweetalert2";
import { getPurposes, managePurpose } from "../../api/masterApi";

const ProjectsTable = () => {
  const [projectList, setProjectList] = useState([]);
  const [projectMap, setProjectMap] = useState(new Map()); // Efficient lookup
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  const userData = localStorage.getItem("user");
  let parsedData;

  try {
    parsedData = JSON.parse(userData);
  } catch (error) {
    Swal.fire("Error", "Failed to parse user data.", "error");
    return;
  }

  const fetchProjectPurpose = async () => {
    setLoading(true);
    let ngoID = parsedData.NGO_ID;
    try {
      const response = await getPurposes(ngoID);

  
      if (Array.isArray(response)) {
        setProjectList(response);
      
  
        const map = new Map();
        response.forEach((project) => {
          map.set(project.PROJECT_ID, project);
        });
        setProjectMap(map);
      } else {
        console.error("Unexpected response format", response);
      }
    } catch (error) {
      console.error("Error fetching projects", error);
    }
    setLoading(false);
  };
  

  useEffect(() => {
    fetchProjectPurpose();
    
  }, []);

  const filteredProjectList = useMemo(() => {
    if (!Array.isArray(projectList)) {
      return [];
    }

    if (!searchTerm) {
      return projectList;
    }

    const lowerSearchTerm = searchTerm.toLowerCase();

    return projectList.filter((project) => {
      const projectName = (project.PROJECT_NAME || "").toLowerCase();
      return projectName.includes(lowerSearchTerm);
    });
  }, [projectList, searchTerm]);
 

  

  const handleEdit = (projectID) => {
    const project = projectMap.get(projectID);
    if (project) {
      setSelectedProject({ ...project });
      setOpen(true);
    } else {
      Swal.fire("Error", "Project not found.", "error");
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedProject(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedProject((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const updateProject = async () => {
    if (!selectedProject || !selectedProject.PROJECT_ID) {
      Swal.fire("Error", "Project ID is required for updating details.", "error");
      return;
    }

    if (!userData) {
      Swal.fire("Error", "No user data found in localStorage.", "error");
      return;
    }

    const updatedProject = {
      ...selectedProject,
      ngoID: parsedData.NGO_ID,
    };

    try {
      setModalLoading(true);
      const response = await managePurpose(updatedProject, "u");
      await fetchProjectPurpose();
      handleClose();
      Swal.fire("Success", "Project details updated successfully!", "success");
    } catch (error) {
      Swal.fire("Error", "Failed to update project details.", "error");
    }
    setModalLoading(false);
  };

  return (
    <Paper className="mt-6 p-6">
      <Typography variant="h4" align="center" gutterBottom>
        Project List
      </Typography>
      <TextField
        label="Search Project..."
        variant="outlined"
        size="small"
        fullWidth
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">Project Name</TableCell>
                <TableCell align="center">Purpose Name</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProjectList.length > 0 ? (
                filteredProjectList.map((project, index) => (
                  <TableRow key={index}>
                    <TableCell align="center">{project.PROJECT_NAME}</TableCell>
                    <TableCell align="center">{project.PURPOSE_NAME}</TableCell>
                    <TableCell align="center">
                      <Tooltip title="Edit">
                        <IconButton
                          color="secondary"
                          onClick={() => handleEdit(project.PURPOSE_ID)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          color="error"
                          onClick={() => console.log("Delete Functionality")}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2} align="center">
                    No Projects Found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Edit Modal */}

      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
        disableEnforceFocus
        disableAutoFocus
      >
        <DialogTitle>
          <Typography variant="body1" sx={{ fontSize: "1.25rem", fontWeight: "bold" }}>
            Edit Project Details
          </Typography>
        </DialogTitle>
        <DialogContent>
          {selectedProject && (
            <Box component="form" noValidate sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    margin="dense"
                    label="Project Name"
                    name="PROJECT_NAME"
                    value={selectedProject.PROJECT_NAME || ""}
                    onChange={handleChange}
                    variant="outlined"
                  />
                </Grid>
              </Grid>
              {modalLoading && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                  <CircularProgress size={24} />
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleClose} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={updateProject}
            variant="contained"
            color="primary"
            disabled={modalLoading}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default ProjectsTable;
