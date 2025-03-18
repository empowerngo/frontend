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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  IconButton,
  Tooltip,
} from "@mui/material";
import { getDonorData, handleDonorRequest } from "../../api/masterApi";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Swal from "sweetalert2";
import { donorTypes } from "../../utils/constants";
import { useSelector } from "react-redux";
import Decrypt from "../../Decrypt";

const DonorTable = () => {
  const [donorList, setDonorList] = useState([]);
  const [donorMap, setDonorMap] = useState(new Map()); // Added donorMap
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const encryptedUserData = useSelector((state) => state.userData);
  const userData = Decrypt(encryptedUserData);
  let parsedData;

  try {
    parsedData = JSON.parse(userData);
  } catch (error) {
    Swal.fire("Error", "Failed to parse user data.", "error", error);
    return;
  }

  const fetchDonors = async () => {
    setLoading(true);
    let ngoID = parsedData.NGO_ID;
    try {
      const response = await getDonorData({ ngoID }, "list");
      console.log("Donor List - ", response);
      if (response && Array.isArray(response.payload)) {
        setDonorList(response.payload);
        // Build donorMap
        const map = new Map();
        response.payload.forEach((donor) => {
          map.set(donor.donorID, donor);
        });
        setDonorMap(map);
      }
    } catch (error) {
      throw new Error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDonors();
  }, []);

  const filteredDonorList = useMemo(() => {
    if (!Array.isArray(donorList)) {
      return []; // Return an empty array or handle the error appropriately
    }

    if (!searchTerm) {
      return donorList;
    }

    const lowerSearchTerm = searchTerm.toLowerCase();

    return donorList.filter((donor) => {
      // Construct the full name by handling potential null or undefined values
      const firstName = (donor.donorFName || "").toLowerCase();
      const middleName = (donor.donorMName || "").toLowerCase();
      const lastName = (donor.donorLName || "").toLowerCase();
      const fullName = `${firstName} ${middleName} ${lastName}`.trim(); // Trim to remove extra spaces

      const email = (donor.donorEmail || "").toLowerCase();
      const contact = (donor.donorMobile || "").toLowerCase();

      return (
        fullName.includes(lowerSearchTerm) ||
        email.includes(lowerSearchTerm) ||
        contact.includes(lowerSearchTerm)
      );
    });
  }, [donorList, searchTerm]);

  const handleEdit = (donorID) => {
    const donor = donorMap.get(donorID);
    if (donor) {
      setSelectedDonor({ ...donor });
      setOpen(true);
    } else {
      Swal.fire("Error", "Donor not found.", "error");
    }
  };

  const handleClose = () => {
    setOpen(false);
    setViewOpen(false);
    setSelectedDonor(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedDonor((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const updateDonor = async () => {
    if (!selectedDonor || !selectedDonor.donorID) {
      Swal.fire(
        "Error",
        "Donor ID is required for updating donor details.",
        "error"
      );
      return;
    }

    if (!userData) {
      Swal.fire("Error", "No user data found in localStorage.", "error");
      return;
    }

    const { createdAt, ...updatedDonorData } = selectedDonor;
    const updatedDonor = {
      ...updatedDonorData,
      donorNGOID: parsedData.NGO_ID,
    };

    delete updatedDonor.ngoName;

    console.log("updatedDonor ---", updatedDonor);
    console.log("selectedDonor ---", selectedDonor);
    try {
      setModalLoading(true);
      const response = await handleDonorRequest(updatedDonor, "u");
      await fetchDonors();
      handleClose();

      Swal.fire("Success", "Donor details updated successfully!", "success");
    } catch (error) {
      Swal.fire("Error", "Failed to update donor details.", "error", error);
    }
    setModalLoading(false);
  };

  const handleView = (donorID) => {
    const donor = donorMap.get(donorID);
    if (donor) {
      setSelectedDonor({ ...donor });
      setViewOpen(true);
    } else {
      Swal.fire("Error", "Donor not found.", "error");
    }
  };

  return (
    <Paper className="mt-6 p-6">
      <Typography variant="h4" align="center" gutterBottom>
        Donor List
      </Typography>
      <TextField
        label="Search by Name..."
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
                <TableCell align="center">Name</TableCell>
                <TableCell align="center">Email</TableCell>
                <TableCell align="center">Mobile</TableCell>
                <TableCell align="center">Donor Type</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredDonorList.length > 0 ? (
                filteredDonorList.map((donor, index) => (
                  <TableRow key={index}>
                    <TableCell align="center">
                      {`${donor.donorFName} ${donor.donorMName || ""} ${
                        donor.donorLName
                      }`}
                    </TableCell>
                    <TableCell align="center">{donor.donorEmail}</TableCell>
                    <TableCell align="center">{donor.donorMobile}</TableCell>
                    <TableCell align="center">{donor.donorType}</TableCell>
                    <TableCell align="center">
                      <Tooltip title="View">
                        <IconButton
                          color="primary"
                          onClick={() => handleView(donor.donorID)}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                      {parsedData.ROLE_CODE === 3 && 4 ? (
                        ""
                      ) : (
                        <>
                          <Tooltip title="Edit">
                            <IconButton
                              color="secondary"
                              onClick={() => handleEdit(donor.donorID)}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No Donors Found
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
          <Typography
            variant="body1"
            sx={{ fontSize: "1.25rem", fontWeight: "bold" }}
          >
            Edit Donor Details
          </Typography>
        </DialogTitle>
        <DialogContent>
          {selectedDonor && (
            <Box component="form" noValidate sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    margin="dense"
                    label="First Name"
                    name="donorFName"
                    value={selectedDonor.donorFName || ""}
                    onChange={handleChange}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    margin="dense"
                    label="Middle Name"
                    name="donorMName"
                    value={selectedDonor.donorMName || ""}
                    onChange={handleChange}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    margin="dense"
                    label="Last Name"
                    name="donorLName"
                    value={selectedDonor.donorLName || ""}
                    onChange={handleChange}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    margin="dense"
                    label="Mobile"
                    name="donorMobile"
                    value={selectedDonor.donorMobile || ""}
                    onChange={handleChange}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    margin="dense"
                    label="Pan Number"
                    name="donorPAN"
                    value={selectedDonor.donorPAN || ""}
                    onChange={handleChange}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    margin="dense"
                    label="Email"
                    name="donorEmail"
                    value={selectedDonor.donorEmail || ""}
                    onChange={handleChange}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    margin="dense"
                    label="Address"
                    name="donorAddress"
                    value={selectedDonor.donorAddress || ""}
                    onChange={handleChange}
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    margin="dense"
                    label="City"
                    name="donorCity"
                    value={selectedDonor.donorCity || ""}
                    onChange={handleChange}
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    margin="dense"
                    label="State"
                    name="donorState"
                    value={selectedDonor.donorState || ""}
                    onChange={handleChange}
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    margin="dense"
                    label="Country"
                    name="donorCountry"
                    value={selectedDonor.donorCountry || ""}
                    onChange={handleChange}
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    margin="dense"
                    label="Pin Code"
                    name="donorPinCode"
                    value={selectedDonor.donorPinCode || ""}
                    onChange={handleChange}
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    margin="dense"
                    label="Profession"
                    name="donorProfession"
                    value={selectedDonor.donorProfession || ""}
                    onChange={handleChange}
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth margin="dense">
                    <InputLabel>Donor Type</InputLabel>
                    <Select
                      name="donorType"
                      value={selectedDonor.donorType || ""}
                      onChange={handleChange}
                    >
                      {donorTypes.map((type) => (
                        <MenuItem key={type} value={type}>
                          {type}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
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
            onClick={updateDonor}
            variant="contained"
            color="primary"
            disabled={modalLoading}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Modal */}

      <Dialog
        open={viewOpen}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
        disableEnforceFocus
        disableAutoFocus
      >
        <DialogTitle sx={{ textAlign: "center", fontWeight: "bold" }}>
          <Typography
            variant="body1"
            sx={{ fontSize: "1.25rem", fontWeight: "bold" }}
          >
            Donor Details
          </Typography>
        </DialogTitle>
        <DialogContent>
          {modalLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            selectedDonor && (
              <Box
                sx={{
                  mt: 2,
                  p: 2,
                  borderRadius: 2,
                  boxShadow: 2,
                  backgroundColor: "#fafafa",
                }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1">
                      <strong>Name:</strong>{" "}
                      {`${selectedDonor.donorFName} ${
                        selectedDonor.donorMName || ""
                      } ${selectedDonor.donorLName}`}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1">
                      <strong>Address:</strong>{" "}
                      {`${selectedDonor.donorAddress} ${
                        selectedDonor.donorCity || ""
                      } ${selectedDonor.donorState || ""} ${
                        selectedDonor.donorCountry || ""
                      } ${selectedDonor.donorPinCode}`}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1">
                      <strong>Mobile:</strong> {selectedDonor.donorMobile}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1">
                      <strong>Email:</strong> {selectedDonor.donorEmail}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1">
                      <strong>Donor Type:</strong> {selectedDonor.donorType}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1">
                      <strong>PAN:</strong> {selectedDonor.donorPAN}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1">
                      <strong>NGO Name:</strong> {selectedDonor.ngoName}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1">
                      <strong>Profession:</strong>{" "}
                      {selectedDonor.donorProfession}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            )
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", p: 2 }}>
          <Button onClick={handleClose} variant="contained" color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default DonorTable;
