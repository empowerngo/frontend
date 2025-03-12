import { useState, useEffect, useMemo, useCallback } from "react";
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
import EditIcon from "@mui/icons-material/Edit";
import { uploadToCloudinary } from "../../utils/helper";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { retrieveNGOList, handleNGORequest } from "../../api/masterApi";
// import EditNGOForm from "./EditNGOForm";
// import ViewNGO from "./ViewNGO";
import Swal from "sweetalert2";

const ManageNGOTable = () => {
  const [ngoList, setNgoList] = useState([]);
  const [ngoMap, setNGOMap] = useState(new Map()); // Added ngoMap
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);
  const [modalLoading, setModalLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedNGO, setSelectedNGO] = useState(null);
  const [seal, setseal] = useState("");
  const [signature, setsignature] = useState("");
  const [logo, setlogo] = useState("");
  const [value, setvalue] = useState("");
  const [uploading, setuploading] = useState(false);

  const fetchNGOs = async () => {
    setLoading(true);

    try {
      const response = await retrieveNGOList("list");

      if (response && Array.isArray(response.payload)) {
        setNgoList(response.payload);
        // Build ngoMap
        const map = new Map();
        response.payload.forEach((ngo) => {
          map.set(ngo.ngoID, ngo);
        });
        setNGOMap(map);
      }
    } catch (error) {
      throw new Error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNGOs();
  }, []);

  const filteredNGOs = useMemo(() => {
    return searchTerm
      ? ngoList.filter((ngo) => {
          const lowerSearchTerm = searchTerm.toLowerCase();
          return (
            (ngo.ngoName &&
              ngo.ngoName.toLowerCase().includes(lowerSearchTerm)) ||
            (ngo.ngoContact &&
              ngo.ngoContact.toLowerCase().includes(lowerSearchTerm)) ||
            (ngo.ngoRegNumber &&
              ngo.ngoRegNumber.toLowerCase().includes(lowerSearchTerm)) ||
            (ngo.ngoCity && ngo.ngoCity.toLowerCase().includes(lowerSearchTerm))
          );
        })
      : ngoList;
  }, [ngoList, searchTerm]);

  const handleEdit = (ngoID) => {
    const ngo = ngoMap.get(ngoID);
    if (ngo) {
      setSelectedNGO({ ...ngo });
      setOpen(true);
    } else {
      Swal.fire("Error", "NGO not found.", "error");
    }
  };

  const handleView = (ngoID) => {
    const ngo = ngoMap.get(ngoID);
    if (ngo) {
      setSelectedNGO({ ...ngo });
      setViewOpen(true);
    } else {
      Swal.fire("Error", "NGO not found.", "error");
    }
  };

  const handleClose = () => {
    setOpen(false);
    setViewOpen(false);
    setSelectedNGO(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedNGO((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileUpload = async (file, type) => {
    console.log(file);
    setuploading(true);
    if (file) {
      console.log(file.name);
      // Correct check
      const uploadedUrl = await uploadToCloudinary(
        file,
        file.name,
        setvalue,
        setuploading
      );
      return uploadedUrl;
    }
    return null;
  };

  const updateNGO = async () => {
    if (!selectedNGO || !selectedNGO.ngoID) {
      Swal.fire(
        "Error",
        "Donor ID is required for updating donor details.",
        "error"
      );
      return;
    }

    const {
      authorizedPerson,
      contactPerson,
      ngo12ANumber,
      ngo80GNumber,
      ngoAddress,
      ngoCSRNumber,
      ngoCity,
      ngoContact,
      ngoCountry,
      ngoEmail,
      ngoFCRANumber,
      ngoName,
      ngoPAN,
      ngoPinCode,
      ngoRegNumber,
      ngoState,
      ngoID,
    } = selectedNGO;
    console.log(selectedNGO);
    const logoURL = await handleFileUpload(logo, "logourl");
    const signatureURL = await handleFileUpload(signature, "signatureurl");
    const sealURL = await handleFileUpload(seal, "sealurl");

    delete selectedNGO.createdAt;
    delete selectedNGO.updatedAt;
    // delete selectedNGO.logoURL;
    // delete selectedNGO.signatureURL;

    const payload = {
      reqType: "u",
      logoURL: logoURL || "",
      signatureURL: signatureURL || "",
      ngoSealURL: sealURL || "",
      authorizedPerson,
      contactPerson,
      ngo12ANumber,
      ngo80GNumber,
      ngoAddress,
      ngoCSRNumber,
      ngoCity,
      ngoContact,
      ngoCountry,
      ngoEmail,
      ngoFCRANumber,
      ngoName,
      ngoPAN,
      ngoPinCode,
      ngoRegNumber,
      ngoState,
      ngoID,
    };

    try {
      setModalLoading(true);
      console.log(payload);
      const response = await handleNGORequest(payload, "u");
      await fetchNGOs();
      handleClose();

      Swal.fire("Success", "NGO details updated successfully!", "success");
    } catch (error) {
      handleClose();
      Swal.fire("Error", "Failed to update NGO details.", "error", error);
    }
    setModalLoading(false);
  };

  return (
    <Paper className="mt-6 p-6">
      <Typography variant="h4" align="center" gutterBottom>
        NGO List
      </Typography>
      <TextField
        label="Search by Name, Contact, city, registration number..."
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
                <TableCell align="center">
                  <b>NGO Name</b>
                </TableCell>
                <TableCell align="center">
                  <b>Registration Number</b>
                </TableCell>
                <TableCell align="center">
                  <b>City</b>
                </TableCell>
                <TableCell align="center">
                  <b>State</b>
                </TableCell>
                <TableCell align="center">
                  <b>Email</b>
                </TableCell>
                <TableCell align="center">
                  <b>Contact</b>
                </TableCell>
                <TableCell align="center">
                  <b>Actions</b>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredNGOs.length > 0 ? (
                filteredNGOs.map((ngo, index) => (
                  <TableRow key={index}>
                    <TableCell align="center">{ngo.ngoName}</TableCell>
                    <TableCell align="center">{ngo.ngoRegNumber}</TableCell>
                    <TableCell align="center">{ngo.ngoCity}</TableCell>
                    <TableCell align="center">{ngo.ngoState}</TableCell>
                    <TableCell align="center">{ngo.ngoEmail}</TableCell>
                    <TableCell align="center">{ngo.ngoContact}</TableCell>
                    <TableCell align="center">
                      <Tooltip title="View">
                        <IconButton
                          color="primary"
                          onClick={() => handleView(ngo.ngoID)}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton
                          color="secondary"
                          onClick={() => handleEdit(ngo.ngoID)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No NGOs Found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

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
            NGO Details
          </Typography>
        </DialogTitle>
        <DialogContent>
          {modalLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            selectedNGO && (
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
                      <strong>NGO Name:</strong> {selectedNGO.ngoName}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1">
                      <strong>Address:</strong>{" "}
                      {`${selectedNGO.ngoAddress} ${
                        selectedNGO.ngoCity || ""
                      } ${selectedNGO.ngoState || ""} ${
                        selectedNGO.ngoCountry || ""
                      } ${selectedNGO.ngoPinCode}`}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1">
                      <strong>Mobile:</strong> {selectedNGO.ngoContact}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1">
                      <strong>Email:</strong> {selectedNGO.ngoEmail}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1">
                      <strong>Registration Number:</strong>{" "}
                      {selectedNGO.ngoRegNumber}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1">
                      <strong>80G Number:</strong> {selectedNGO.ngo80GNumber}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1">
                      <strong>PAN:</strong> {selectedNGO.ngoPAN}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1">
                      <strong>12A Number:</strong> {selectedNGO.ngo12ANumber}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1">
                      <strong>FCRA Number:</strong> {selectedNGO.ngoFCRANumber}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1">
                      <strong>CSR Number:</strong> {selectedNGO.ngoCSRNumber}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1">
                      <strong>Contact Person:</strong>{" "}
                      {selectedNGO.contactPerson}
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
            Edit NGO Details
          </Typography>
        </DialogTitle>
        <DialogContent>
          {selectedNGO && (
            <Box component="form" noValidate sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    margin="dense"
                    label="NGO Name"
                    name="ngoName"
                    value={selectedNGO.ngoName || ""}
                    onChange={handleChange}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    margin="dense"
                    label="Registration Number"
                    name="ngoRegNumber"
                    value={selectedNGO.ngoRegNumber || ""}
                    onChange={handleChange}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    margin="dense"
                    label="Pan Number"
                    name="ngoPAN"
                    value={selectedNGO.ngoPAN || ""}
                    onChange={handleChange}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    margin="dense"
                    label="Email"
                    name="ngoEmail"
                    value={selectedNGO.ngoEmail || ""}
                    onChange={handleChange}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    margin="dense"
                    label="Address"
                    name="ngoAddress"
                    value={selectedNGO.ngoAddress || ""}
                    onChange={handleChange}
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    margin="dense"
                    label="City"
                    name="ngoCity"
                    value={selectedNGO.ngoCity || ""}
                    onChange={handleChange}
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    margin="dense"
                    label="State"
                    name="ngoState"
                    value={selectedNGO.ngoState || ""}
                    onChange={handleChange}
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    margin="dense"
                    label="Country"
                    name="ngoCountry"
                    value={selectedNGO.ngoCountry || ""}
                    onChange={handleChange}
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    margin="dense"
                    label="Pin Code"
                    name="ngoPinCode"
                    value={selectedNGO.ngoPinCode || ""}
                    onChange={handleChange}
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    margin="dense"
                    label="Contact"
                    name="ngoContact"
                    value={selectedNGO.ngoContact || ""}
                    onChange={handleChange}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    margin="dense"
                    label="80G Number"
                    name="ngo80GNumber"
                    value={selectedNGO.ngo80GNumber || ""}
                    onChange={handleChange}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    margin="dense"
                    label="12A Number"
                    name="ngo12ANumber"
                    value={selectedNGO.ngo12ANumber || ""}
                    onChange={handleChange}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    margin="dense"
                    label="CSR Number"
                    name="ngoCSRNumber"
                    value={selectedNGO.ngoCSRNumber || ""}
                    onChange={handleChange}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    margin="dense"
                    label="FCRA Number"
                    name="ngoFCRANumber"
                    value={selectedNGO.ngoFCRANumber || ""}
                    onChange={handleChange}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    margin="dense"
                    label="Contact Person"
                    name="contactPerson"
                    value={selectedNGO.contactPerson || ""}
                    onChange={handleChange}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    margin="dense"
                    label="Authorized Person"
                    name="authorizedPerson"
                    value={selectedNGO.authorizedPerson || ""}
                    onChange={handleChange}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      NGO Logo (Image)
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      className="w-full p-2 border border-gray-300 rounded-lg"
                      name="ngoLogo"
                      onChange={(e) => setlogo(e.target.files[0])}
                    />
                  </div>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      NGO Signature (Image)
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      className="w-full p-2 border border-gray-300 rounded-lg"
                      name="ngoSignature"
                      onChange={(e) => setsignature(e.target.files[0])}
                    />
                  </div>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      NGO Seal (Image)
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      className="w-full p-2 border border-gray-300 rounded-lg"
                      name="ngoSeal"
                      onChange={(e) => setseal(e.target.files[0])}
                    />
                  </div>
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
            onClick={updateNGO}
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

export default ManageNGOTable;
