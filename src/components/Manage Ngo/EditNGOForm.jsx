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
import { retrieveNGOList, registerNgo } from "../../api/masterApi";

const EditNGOForm = ({ open, onClose, ngoId }) => {
  const [ngoDetails, setNgoDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState(null);
  const [signaturePreview, setSignaturePreview] = useState(null);

  useEffect(() => {
    if (ngoId) {
      setLoading(true);
      retrieveNGOList("info", ngoId)
        .then((response) => {
          if (response?.payload) {
            const data = response.payload;
            setNgoDetails({
              NGO_ID: data?.NGO_ID || "",
              NGO_NAME: data?.NGO_NAME || "",
              NGO_ADDRESS: data?.NGO_ADDRESS || "",
              NGO_CITY: data?.NGO_CITY || "",
              NGO_STATE: data?.NGO_STATE || "",
              NGO_COUNTRY: data?.NGO_COUNTRY || "",
              NGO_PINCODE: data?.NGO_PINCODE || "",
              NGO_EMAIL: data?.NGO_EMAIL || "",
              NGO_CONTACT: data?.NGO_CONTACT || "",
              AUTHORIZED_PERSON: data?.AUTHORIZED_PERSON || "",
              NGO_80G_NUMBER: data?.NGO_80G_NUMBER || "",
              NGO_12A_NUMBER: data?.NGO_12A_NUMBER || "",
              NGO_CSR_NUMBER: data?.NGO_CSR_NUMBER || "",
              NGO_FCRA_NUMBER: data?.NGO_FCRA_NUMBER || "",
              NGO_PAN: data?.NGO_PAN || "",
              CONTACT_PERSON: data?.CONTACT_PERSON || "",
              NGO_REG_NUMBER: data?.NGO_REG_NUMBER || "",
              LOGO_URL: data?.LOGO_URL || null,
              SIGNATURE_URL: data?.SIGNATURE_URL || null,
            });
            setLogoPreview(data?.LOGO_URL);
            setSignaturePreview(data?.SIGNATURE_URL);
          }
        })
        .catch((error) => console.error("Error fetching NGO details:", error))
        .finally(() => setLoading(false));
    }
  }, [ngoId]);

  const handleChange = (e) => {
    setNgoDetails((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      setNgoDetails((prev) => ({ ...prev, [field]: file }));
      const reader = new FileReader();
      reader.onload = () => {
        if (field === "LOGO_URL") {
          setLogoPreview(reader.result);
        } else if (field === "SIGNATURE_URL") {
          setSignaturePreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!ngoDetails.NGO_NAME || ngoDetails.NGO_NAME.trim() === "") {
      alert("Error: NGO Name is required.");
      return;
    }

    try {
      const formData = new FormData();
      Object.keys(ngoDetails).forEach((key) => {
        if (ngoDetails[key]) {
          formData.append(key, ngoDetails[key]);
        }
      });
      formData.append("reqType", "s");

      const response = await registerNgo(formData);
      if (response?.status === "FAILURE") {
        alert(`Error: ${response.message}`);
      } else {
        alert("NGO details saved successfully!");
        onClose();
      }
    } catch (error) {
      console.error("Error saving NGO details:", error);
      alert("Failed to save NGO details.");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Edit NGO Details</DialogTitle>
      <DialogContent>
        {loading ? (
          <Typography>Loading...</Typography>
        ) : (
          <Grid container spacing={3}>
            {/* Fields */}
            {[
              { label: "NGO Name", name: "NGO_NAME" },
              { label: "Address", name: "NGO_ADDRESS" },
              { label: "City", name: "NGO_CITY" },
              { label: "State", name: "NGO_STATE" },
              { label: "Country", name: "NGO_COUNTRY" },
              { label: "Pincode", name: "NGO_PINCODE" },
              { label: "Email", name: "NGO_EMAIL" },
              { label: "Contact", name: "NGO_CONTACT" },
              { label: "Authorized Person", name: "AUTHORIZED_PERSON" },
              { label: "80G Number", name: "NGO_80G_NUMBER" },
              { label: "12A Number", name: "NGO_12A_NUMBER" },
              { label: "CSR Number", name: "NGO_CSR_NUMBER" },
              { label: "FCRA Number", name: "NGO_FCRA_NUMBER" },
              { label: "PAN", name: "NGO_PAN" },
              { label: "Contact Person", name: "CONTACT_PERSON" },
              { label: "Registration Number", name: "NGO_REG_NUMBER" },
            ].map(({ label, name }) => (
              <Grid item xs={12} md={6} key={name}>
                <TextField
                  label={label}
                  name={name}
                  value={ngoDetails[name] || ""}
                  onChange={handleChange}
                  fullWidth
                  margin="dense"
                  variant="outlined"
                  size="small"
                />
              </Grid>
            ))}

            {/* NGO Logo */}
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>
                NGO Logo
              </Typography>
              {logoPreview && (
                <img
                  src={logoPreview}
                  alt="logoURL"
                  style={{
                    width: "100%",
                    maxHeight: 150,
                    objectFit: "contain",
                    borderRadius: 10,
                    marginBottom: 10,
                  }}
                />
              )}
              <Button variant="contained" component="label" fullWidth style={{ marginTop: 10 }}>
                Update Logo
                <input
                  type="file"
                  name="LOGO_URL"
                  hidden
                  onChange={(e) => handleImageChange(e, "LOGO_URL")}
                />
              </Button>
            </Grid>

            {/* NGO Signature */}
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>
                NGO Signature
              </Typography>
              {signaturePreview && (
                <img
                  src={signaturePreview}
                  alt="signatureURL"
                  style={{
                    width: "100%",
                    maxHeight: 150,
                    objectFit: "contain",
                    borderRadius: 10,
                    marginBottom: 10,
                  }}
                />
              )}
              <Button variant="contained" component="label" fullWidth style={{ marginTop: 10 }}>
                Update Signature
                <input
                  type="file"
                  name="SIGNATURE_URL"
                  hidden
                  onChange={(e) => handleImageChange(e, "SIGNATURE_URL")}
                />
              </Button>
            </Grid>
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

export default EditNGOForm;
