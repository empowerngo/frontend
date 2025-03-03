import { useState, useCallback } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
  CircularProgress,
} from "@mui/material";
import { registerUser } from "../../api/masterApi";
import Swal from "sweetalert2";

const EditUserForm = ({ open, onClose, user }) => {
  const [status, setStatus] = useState(user.STATUS || "ACTIVE");
  const [loading, setLoading] = useState(false);

  // Event Handlers
  const handleUpdate = useCallback(async () => {
    setLoading(true);
    try {
      const response = await registerUser({
        reqType: "u",
        userID: user.USER_ID,
        status,
      });

      if (response?.status === "SUCCESS") {
        Swal.fire({
          icon: "success",
          title: "Staff Updated",
          text: "Staff details updated successfully!",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: response?.message || "Something went wrong!",
        });
      }
      onClose(); 
    } catch (error) {
      console.error("Error updating staff details:", error);
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "An unexpected error occurred.",
      });
    } finally {
      setLoading(false);
    }
  }, [onClose, status, user.USER_ID]);

  const handleCancel = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <>
      {loading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.3)",
            zIndex: 9999,
          }}
          aria-busy="true"
          aria-live="polite"
        >
          <CircularProgress color="primary" />
        </div>
      )}
      <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        sx={{
          "& .MuiDialog-paper": {
            width: 400,
            margin: "0 auto",
            display: "flex",
            justifyContent: "center",
          },
        }}
        aria-labelledby="edit-user-title"
      >
        <DialogTitle
          sx={{
            fontWeight: "bold",
            fontSize: "1.25rem",
            textAlign: "center",
            paddingBottom: "10px",
          }}
          id="edit-user-title"
        >
          Edit User Status
        </DialogTitle>
        <DialogContent sx={{ padding: "16px" }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <InputLabel
                htmlFor="status"
                sx={{ marginBottom: "8px", fontWeight: "bold", color: "black" }}
              >
                Status
              </InputLabel>
              <FormControl fullWidth margin="dense">
                <Select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  fullWidth
                  margin="dense"
                >
                  <MenuItem value="ACTIVE">ACTIVE</MenuItem>
                  <MenuItem value="INACTIVE">INACTIVE</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            padding: "8px",
          }}
        >
          <Button
            onClick={handleCancel}
            sx={{
              backgroundColor: "#f44336",
              color: "white",
              marginRight: "8px",
              textTransform: "none",
              fontSize: "1rem",
              padding: "8px 16px",
              "&:hover": {
                backgroundColor: "#d32f2f",
              },
            }}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdate}
            sx={{
              backgroundColor: "#4caf50",
              color: "white",
              textTransform: "none",
              fontSize: "1rem",
              padding: "8px 16px",
              "&:hover": {
                backgroundColor: "#388e3c",
              },
            }}
            disabled={loading}
          >
            {loading ? "Updating..." : "Update"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EditUserForm;
