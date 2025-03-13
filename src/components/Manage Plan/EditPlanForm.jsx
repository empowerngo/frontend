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
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { getSubsPlans, registerPlan } from "../../api/masterApi";

const EditPlanForm = ({ open, onClose, planID, user }) => {
  const [planDetails, setPlanDetails] = useState({
    PLAN_ID: user?.planID || "",
    PLAN_NAME: user?.planName || "",
    PLAN_PRICE: user?.planPrice || "",
    PLAN_STATUS: user?.planStatus || "",
    NUMBER_OF_USERS: user?.numberOfUsers || "",
    NUMBER_OF_DONORS: user?.numberOfDonors || "",
    NUMBER_OF_DONATIONS: user?.numberOfDonations || "",
    planValidity: user?.planValidity || "",
    form10BEMail: user?.form10BEMail || "",
    form10BdData: user?.form10BdData || "",
    caAccess: user?.caAccess || "",
    FORM_10BE_REPORT: user?.form10BEReport === 1 ? "Yes" : "No" || "",
  });
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   if (planID) {
  //     setLoading(true);
  //     getSubsPlans("fetch", planID)
  //       .then((response) => {
  //         if (response?.payload) {
  //           const data = response.payload;
  //           setNgoDetails({
  //             PLAN_ID: data?.PLAN_ID || "",
  //             PLAN_NAME: data?.PLAN_NAME || "",
  //             PLAN_PRICE: data?.PLAN_PRICE || "",
  //             PLAN_STATUS: data?.PLAN_STATUS || "",
  //             NUMBER_OF_USERS: data?.NUMBER_OF_USERS || "",
  //             NUMBER_OF_DONORS: data?.NUMBER_OF_DONORS || "",
  //             NUMBER_OF_DONATIONS: data?.NUMBER_OF_DONATIONS || "",
  //             FORM_10BE_REPORT: data?.FORM_10BE_REPORT || "",
  //           });
  //           setLogoPreview(data?.LOGO_URL);
  //           setSignaturePreview(data?.SIGNATURE_URL);
  //         }
  //       })
  //       .catch((error) => console.error("Error fetching NGO details:", error))
  //       .finally(() => setLoading(false));
  //   }
  // }, [planID]);
  const handleChange = (e) => {
    setPlanDetails((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    console.log("planDetails before appending:", planDetails);

    if (planDetails.PLAN_NAME.trim() === "") {
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
      console.log(formData);
      formData.append("reqType", "u");

      // const response = await registerPlan(formData);
      // console.log("response -- ", response);
      // if (response?.status === "FAILURE") {
      //   alert(`Error: ${response.message}`);
      // } else {
      //   alert("Plan details saved successfully!");
      //   onClose();
      // }
    } catch (error) {
      console.error("Error saving Plan details:", error);
      alert("Failed to save Plan details.");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Plan Details</DialogTitle>
      <DialogContent>
        {loading ? (
          <Typography>Loading...</Typography>
        ) : (
          <Grid container spacing={3}>
            {[
              { label: "Plan Name", name: "PLAN_NAME" },
              { label: "Plan Price", name: "PLAN_PRICE" },
              { label: "Status", name: "PLAN_STATUS" },
              { label: "No. Of Users", name: "NUMBER_OF_USERS" },
              { label: "No. Of Donations", name: "NUMBER_OF_DONATIONS" },
              { label: "Plan Validity", name: "planValidity" },
              { label: "Form 10 BE?", name: "FORM_10BE_REPORT" },
              { label: "Form 10 BE Mail?", name: "form10BEMail" },
              { label: "Form 10 Bd?", name: "form10BdData" },
              { label: "CA Access?", name: "caAccess" },
            ].map(({ label, name }) => (
              <Grid
                item
                xs={12}
                md={
                  [
                    "FORM_10BE_REPORT",
                    "form10BEMail",
                    "form10BdData",
                    "caAccess",
                  ].includes(name)
                    ? 6
                    : 6
                }
                key={name}
              >
                {[
                  "FORM_10BE_REPORT",
                  "form10BEMail",
                  "form10BdData",
                  "caAccess",
                ].includes(name) ? (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={!!planDetails[name]} // Convert 1/0 to true/false
                        onChange={(e) =>
                          handleChange({
                            target: { name, value: e.target.checked ? 1 : 0 },
                          })
                        }
                        disabled
                      />
                    }
                    label={label}
                  />
                ) : (
                  <Grid item xs={12} md={6} key={name}>
                    <Typography variant="subtitle2" color="textSecondary">
                      {label}
                    </Typography>
                    <Typography variant="body1" color="textPrimary">
                      {planDetails[name] || "N/A"}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            ))}
          </Grid>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary" variant="outlined">
          Cancel
        </Button>
        {/* <Button onClick={handleSave} color="primary" variant="contained">
          Save
        </Button> */}
      </DialogActions>
    </Dialog>
  );
};

export default EditPlanForm;
