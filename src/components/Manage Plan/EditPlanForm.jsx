import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  Typography,
} from "@mui/material";
import { getSubsPlans, registerPlan } from "../../api/masterApi";

const EditPlanForm = ({ open, onClose, planID }) => {
  const [planDetails, setPlanDetails] = useState({});
  const [loading, setLoading] = useState(false);

  const [signaturePreview, setSignaturePreview] = useState(null);

  useEffect(() => {
    if (planID) {
      setLoading(true);
      getSubsPlans("fetch", planID)
        .then((response) => {
          if (response?.payload) {
            const data = response.payload;
            setNgoDetails({
              PLAN_ID: data?.PLAN_ID || "",
              PLAN_NAME: data?.PLAN_NAME || "",
              PLAN_PRICE: data?.PLAN_PRICE || "",
              PLAN_STATUS: data?.PLAN_STATUS || "",
              NUMBER_OF_USERS: data?.NUMBER_OF_USERS || "",
              NUMBER_OF_DONORS: data?.NUMBER_OF_DONORS || "",
              NUMBER_OF_DONATIONS: data?.NUMBER_OF_DONATIONS || "",
              FORM_10BE_REPORT: data?.FORM_10BE_REPORT || "",

            });
            setLogoPreview(data?.LOGO_URL);
            setSignaturePreview(data?.SIGNATURE_URL);
          }
        })
        .catch((error) => console.error("Error fetching NGO details:", error))
        .finally(() => setLoading(false));
    }
  }, [planID]);

  const handleChange = (e) => {
    setPlanDetails((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

    const handleSave = async () => {
    if (!planDetails.NGO_NAME || planDetails.PLAN_NAME.trim() === "") {
      alert("Error: Plan Name is required.");
      return;
    }

    try {
      const formData = new FormData();
      Object.keys(planDetails).forEach((key) => {
        if (planDetails[key]) {
          formData.append(key, planDetails[key]);
        }
      });
      formData.append("reqType", "u");

      const response = await registerPlan(formData);
      console.log("response -- ", response)
      if (response?.status === "FAILURE") {
        alert(`Error: ${response.message}`);
      } else {
        alert("Plan details saved successfully!");
        onClose();
      }
    } catch (error) {
      console.error("Error saving Plan details:", error);
      alert("Failed to save Plan details.");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Edit Plan Details</DialogTitle>
      <DialogContent>
        {loading ? (
          <Typography>Loading...</Typography>
        ) : (
          <Grid container spacing={3}>
            {/* Fields */}
            {[
              { label: "Plan Name", name: "PLAN_NAME" },
              { label: "Plan Price", name: "PLAN_PRICE" },
              { label: "Status", name: "PLAN_STATUS" },
              { label: "State", name: "NGO_STATE" },
              { label: "No. Of Users", name: "NUMBER_OF_USERS" },
              { label: "No. Of Donors", name: "NUMBER_OF_DONORS" },
              { label: "No. Of Donations", name: "NUMBER_OF_DONATIONS" },
              { label: "Form 10 BE?", name: "FORM_10BE_REPORT" },
            ].map(({ label, name }) => (
              <Grid item xs={12} md={6} key={name}>
                <TextField
                  label={label}
                  name={name}
                  value={planDetails[name] || ""}
                  onChange={handleChange}
                  fullWidth
                  margin="dense"
                  variant="outlined"
                  size="small"
                />
              </Grid>
            ))}
          </Grid>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary" variant="outlined">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary" variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditPlanForm;
