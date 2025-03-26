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
  TableSortLabel,
  TablePagination,
} from "@mui/material";
import { validateField } from "./validation";
import { getDonorData, handleDonorRequest } from "../../api/masterApi";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Swal from "sweetalert2";
import { donorTypes } from "../../utils/constants";
import { useSelector } from "react-redux";
import Decrypt from "../../Decrypt";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

const DonorTable = ({reload}) => {
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
  const [errors, setErrors] = useState({});
  const [submitValid, setSubmitValid] = useState(false);
  const [orderBy, setOrderBy] = useState("donorFName");
  const [order, setOrder] = useState("asc");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
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
  }, [reload]);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedFilteredDonorList = useMemo(() => {
    return donorList
      .filter((donor) => {
        const fullName = `${donor.donorFName} ${donor.donorMName || ""} ${
          donor.donorLName
        }`.toLowerCase();
        return fullName.includes(searchTerm.toLowerCase());
      })
      .sort((a, b) => {
        if (orderBy === "srNo") {
          return order === "asc" ? a.srNo - b.srNo : b.srNo - a.srNo;
        } else {
          return order === "asc"
            ? a[orderBy]?.localeCompare(b[orderBy])
            : b[orderBy]?.localeCompare(a[orderBy]);
        }
      });
  }, [donorList, searchTerm, orderBy, order]);

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Pagination Logic
  const indexOfLastRow = page * rowsPerPage + rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = sortedFilteredDonorList.slice(
    indexOfFirstRow,
    indexOfLastRow
  );

  const filteredDonorList = useMemo(() => {
    if (!Array.isArray(donorList)) {
      return []; // Return an empty array or handle the error appropriately
    }

    if (!searchTerm) {
      return donorList;
    }

    const lowerSearchTerm = searchTerm.toLowerCase();

    return donorList.filter((donor) => {
      const firstName = (donor.donorFName || "").toLowerCase();
      const middleName = (donor.donorMName || "").toLowerCase();
      const lastName = (donor.donorLName || "").toLowerCase();
      const fullName = `${firstName} ${middleName} ${lastName}`.trim();

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

    // Update the selected donor data
    setSelectedDonor((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Validate the field in real-time
    const validation = validateField(name);
    let errorMessage = "";

    if (validation.required && !value.trim()) {
      errorMessage = validation.required;
    } else if (
      validation.pattern &&
      !new RegExp(validation.pattern.value).test(value)
    ) {
      errorMessage = validation.pattern.message;
    } else if (
      validation.minLength &&
      value.length < validation.minLength.value
    ) {
      errorMessage = validation.minLength.message;
    } else if (
      validation.maxLength &&
      value.length > validation.maxLength.value
    ) {
      errorMessage = validation.maxLength.message;
    }

    // Update the errors state
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMessage,
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

    // Validate all fields
    let newErrors = {};
    Object.keys(selectedDonor).forEach((field) => {
      const validation = validateField(field);
      if (validation.required && !selectedDonor[field]?.trim()) {
        newErrors[field] = validation.required;
      } else if (
        validation.pattern &&
        !new RegExp(validation.pattern.value).test(selectedDonor[field])
      ) {
        newErrors[field] = validation.pattern.message;
      } else if (
        validation.minLength &&
        selectedDonor[field]?.length < validation.minLength.value
      ) {
        newErrors[field] = validation.minLength.message;
      } else if (
        validation.maxLength &&
        selectedDonor[field]?.length > validation.maxLength.value
      ) {
        newErrors[field] = validation.maxLength.message;
      }
    });

    // If there are validation errors, stop the update and show errors
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      Swal.fire(
        "Error",
        "Please fix the validation errors before updating.",
        "error"
      );

      return;
    }

    // Proceed with updating donor details if no errors
    const { createdAt, ...updatedDonorData } = selectedDonor;
    const updatedDonor = {
      ...updatedDonorData,
      donorNGOID: parsedData.NGO_ID,
    };

    delete updatedDonor.ngoName;

    try {
      setModalLoading(true);
      const response = await handleDonorRequest(updatedDonor, "u");
      await fetchDonors();
      setSelectedDonor(null);
      handleClose();

      setSelectedDonor(null);
      setOpen(false);

      Swal.fire("Success", "Donor details updated successfully!", "success");
    } catch (error) {
      Swal.fire("Error", "Failed to update donor details.", "error");
    }
    setModalLoading(false);
  };

  const handleValidation = (event) => {
    const { name, value } = event.target;
    const validation = validateField(name);

    let errorMessage = "";

    if (validation.required && !value.trim()) {
      errorMessage = validation.required;
    } else if (
      validation.pattern &&
      !new RegExp(validation.pattern.value).test(value)
    ) {
      errorMessage = validation.pattern.message;
    } else if (
      validation.minLength &&
      value.length < validation.minLength.value
    ) {
      errorMessage = validation.minLength.message;
    } else if (
      validation.maxLength &&
      value.length > validation.maxLength.value
    ) {
      errorMessage = validation.maxLength.message;
    }

    setErrors((prevErrors) => ({ ...prevErrors, [name]: errorMessage }));
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
      <div className="w-full">
        <div className="flex gap-2">
          <TextField
            label="Search by Name..."
            variant="outlined"
            size="small"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-4"
          />
          <Button
            variant="contained"
            color="secondary"
            onClick={() => setSearchTerm("")}
            disabled={!searchTerm}
          >
            Clear
          </Button>
        </div>
      </div>

      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {[
                  { label: "Sr. No.", field: "srNo" },
                  { label: "Name", field: "donorFName" },
                  { label: "Email", field: "donorEmail" },
                  { label: "Mobile", field: "donorMobile" },
                ].map(({ label, field }) => (
                  <TableCell key={field}>
                    <TableSortLabel
                      active={orderBy === field}
                      direction={orderBy === field ? order : "asc"}
                      onClick={() => handleRequestSort(field)}
                    >
                      {label}
                    </TableSortLabel>
                  </TableCell>
                ))}
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedFilteredDonorList
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((donor, index) => (
                  <TableRow key={index}>
                    <TableCell>{indexOfFirstRow + index + 1}</TableCell>
                    <TableCell>{`${donor.donorFName} ${
                      donor.donorMName || ""
                    } ${donor.donorLName}`}</TableCell>
                    <TableCell>{donor.donorEmail}</TableCell>
                    <TableCell>{donor.donorMobile}</TableCell>
                    <TableCell>
                      <Tooltip title="View">
                        <IconButton color="primary">
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton color="secondary">
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <TablePagination
        component="div"
        count={sortedFilteredDonorList.length}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[10, 20, 50]}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Edit Modal */}

      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
        disableEnforceFocus
        disableAutoFocus
        style={{
          zIndex: "1",
        }}
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
                    onBlur={handleValidation}
                    error={!!errors.donorMobile}
                    helperText={errors.donorMobile}
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
                    onBlur={handleValidation}
                    error={!!errors.donorPAN} // If there's an error, highlight field
                    helperText={errors.donorPAN} // Show validation message
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    margin="dense"
                    label="ADHAAR"
                    name="donorAdhar"
                    value={selectedDonor.donorAdhar || ""}
                    onChange={handleChange}
                    onBlur={handleValidation}
                    error={!!errors.donorAdhar}
                    helperText={errors.donorAdhar}
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
                    onBlur={handleValidation}
                    error={!!errors.donorEmail}
                    helperText={errors.donorEmail}
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
                <Grid item xs={12} sm={6}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <FormControl fullWidth margin="dense">
                      <DatePicker
                        label="Donor DOB"
                        value={
                          selectedDonor.donorDOB
                            ? dayjs(selectedDonor.donorDOB)
                            : null
                        }
                        onChange={(newValue) => {
                          handleChange({
                            target: {
                              name: "donorDOB",
                              value: newValue ? newValue.toISOString() : null,
                            },
                          });
                        }}
                        renderInput={(params) => <TextField {...params} />} // Use the default TextField or your custom one
                      />
                    </FormControl>
                  </LocalizationProvider>
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
            disabled={submitValid}
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
                      <strong>ADHAAR:</strong> {selectedDonor.donorAdhar}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1">
                      <strong>D.O.B:</strong> {selectedDonor.donorDOB}
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
