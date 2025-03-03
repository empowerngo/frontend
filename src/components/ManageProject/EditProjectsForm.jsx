// components/Form/EditProjectAndPurposeForm.jsx
import { useState, useCallback } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  CircularProgress,
} from "@mui/material";
import { manageProject, managePurpose } from "../../api/masterApi";
import Swal from "sweetalert2";

const EditProjectAndPurposeForm = ({ open, onClose, editItem, fetchData, isProject }) => {
  const [itemName, setItemName] = useState(editItem ? (isProject ? editItem.projectName : editItem.purposeName) : "");
  const [loading, setLoading] = useState(false);

  const handleUpdate = useCallback(async () => {
    setLoading(true);
    try {
      const formData = new FormData(); 
      formData.append("reqType", "u");
      formData.append(isProject ? "projectID" : "purposeID", isProject ? editItem.PROJECT_ID : editItem.PURPOSE_ID);
      formData.append(isProject ? "projectName" : "purposeName", itemName);

      const response = await (isProject ? manageProject(formData, "u") : managePurpose(formData, "u"));
      if (response?.status === "SUCCESS") {
        Swal.fire({
          icon: "success",
          title: isProject ? "Project Updated" : "Purpose Updated",
          text: "Details updated successfully!",
        });
        fetchData();
        onClose();
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: response?.message || "Something went wrong!",
        });
      }
    } catch (error) {
      console.error("Error updating details:", error);
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "An unexpected error occurred.",
      });
    } finally {
      setLoading(false);
    }
  }, [onClose, itemName, editItem, fetchData, isProject]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>{isProject ? "Edit Project" : "Edit Purpose"}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label={isProject ? "Project Name" : "Purpose Name"}
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="error" disabled={loading}>
          Cancel
        </Button>
        <Button onClick={handleUpdate} color="primary" disabled={loading}>
          {loading ? "Updating..." : "Update"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditProjectAndPurposeForm;