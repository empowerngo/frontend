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
  Divider,
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
  const [plansId, setplansId] = useState("");
  const planDetails = localStorage.getItem("plans");
  const parsedPlan = JSON.parse(planDetails);

  const fallbackImage =
    "data:image/png;base64,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";

  function getPlandetails(id) {
    console.log(parsedPlan, id);

    const selectedPlan = parsedPlan.find((item) => item.planID === id);

    if (selectedPlan) {
      console.log("Selected Plan:", selectedPlan);
      setplansId(selectedPlan);
    } else {
      console.log("Plan not found!");
    }
  }

  function formatDate(date) {
    const formattedDate = new Date(date).toLocaleString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      // hour: "2-digit",
      // minute: "2-digit",
      // second: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata",
    });

    return formattedDate;
  }

  const fetchNGOs = async () => {
    setLoading(true);

    try {
      const response = await retrieveNGOList("list");

      if (response && Array.isArray(response.payload)) {
        setNgoList(response.payload);
        console.log(response.payload);
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
      console.log(ngo);
      setOpen(true);
    } else {
      Swal.fire("Error", "NGO not found.", "error");
    }
  };

  const handleView = (ngoID) => {
    const ngo = ngoMap.get(ngoID);
    console.log(ngo);
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
                    {/* <TableCell align="center">{ngo.planID}</TableCell> */}
                    <TableCell align="center">
                      <Tooltip title="View">
                        <IconButton
                          color="primary"
                          onClick={() => {
                            handleView(ngo.ngoID);
                            getPlandetails(ngo.planID);
                          }}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton
                          color="secondary"
                          onClick={() => {
                            handleEdit(ngo.ngoID);
                            getPlandetails(ngo.planID);
                          }}
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
                      <strong>PAN:</strong> {selectedNGO.ngoPAN}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1">
                      <strong>Email:</strong> {selectedNGO.ngoEmail}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Divider sx={{ mt: 2, mb: 2, borderColor: "#ccc" }} />
                    <Typography variant="subtitle1">
                      <strong>Subscriptions:</strong> {selectedNGO.planName}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1">
                      <strong>Subscriptions Date:</strong>{" "}
                      {formatDate(selectedNGO.subsDate)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1">
                      <strong>Subscriptions Exp. Date:</strong>{" "}
                      {formatDate(selectedNGO.planExpDate)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1">
                      <strong>Subscriptions Status:</strong>{" "}
                      {plansId.planStatus}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    {" "}
                    <Divider sx={{ mt: 2, mb: 2, borderColor: "#ccc" }} />
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
                      <strong>80G Date:</strong> {selectedNGO.reg80GDate}
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
                    {" "}
                    <Divider sx={{ mt: 2, mb: 2, borderColor: "#ccc" }} />
                    <Typography variant="subtitle1">
                      <strong>Contact Person:</strong>{" "}
                      {selectedNGO.contactPerson}
                    </Typography>
                    <Divider sx={{ mt: 2, mb: 2, borderColor: "#ccc" }} />
                  </Grid>
                  <Grid item xs={4} style={gridStyle}>
                    <Typography variant="subtitle1">Logo</Typography>
                    <img
                      src={selectedNGO?.logoURL || fallbackImage}
                      alt="NGO Logo"
                      style={imgStyle}
                    />
                  </Grid>

                  <Grid item xs={4} style={gridStyle}>
                    <Typography variant="subtitle1">Seal</Typography>
                    <img
                      src={
                        selectedNGO?.ngoSealURL === null
                          ? fallbackImage
                          : selectedNGO?.ngoSealURL
                      }
                      alt="NGO Seal"
                      style={imgStyle}
                    />
                  </Grid>

                  <Grid item xs={4} style={gridStyle}>
                    <Typography variant="subtitle1">Signature</Typography>
                    <img
                      src={
                        selectedNGO?.signatureURL === null
                          ? fallbackImage
                          : selectedNGO.signatureURL
                      }
                      alt="NGO Signature"
                      style={imgStyle}
                    />
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
                    label="Subscription Plan"
                    disabled
                    name="ngosubscription"
                    value={plansId.planName || ""}
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
                <Grid item xs={12} sm={6} gap={0}>
                  <TextField
                    type="date"
                    fullWidth
                    margin="dense"
                    label="80G Date"
                    name="ngo80GDate"
                    value={selectedNGO.reg80GDate || ""}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
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
                <Grid item xs={12} sm={12}>
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
                <Grid item xs={12} sm={12}>
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
                <Grid item xs={12} sm={12}>
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
                <Grid item xs={12} sm={12}>
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

const gridStyle = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  alignItems: "center",
};

const imgStyle = {
  width: "100%",
  height: 150,
  objectFit: "contain",
};

export default ManageNGOTable;
