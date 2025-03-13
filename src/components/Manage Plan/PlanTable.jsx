import React, { useState, useEffect, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  TextField,
  Button,
} from "@mui/material";
import EditPlanForm from "./EditPlanForm"; // Import the new component

import { getSubsPlans } from "../../api/masterApi";

const PlanTable = () => {
  const [planList, setPlanList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const fetchPlans = async () => {
    try {
      const response = await getSubsPlans();
      console.log(response);
      localStorage.setItem("plans", JSON.stringify(response.payload));

      setPlanList(response?.payload || []);
    } catch (err) {
      console.error("Failed to fetch User data", err);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const filteredStaff = useMemo(() => {
    if (!Array.isArray(planList) || !searchTerm) {
      return planList;
    }

    const lowerCaseSearchTerm = searchTerm.toLowerCase();

    return planList.filter((plan) => {
      const nameMatch = (plan.planName || "")
        .toLowerCase()
        .includes(lowerCaseSearchTerm);
      const planStatus = (plan.planStatus || "")
        .toLowerCase()
        .includes(lowerCaseSearchTerm);
      // Return true if ANY of the fields match the search term
      return nameMatch || planStatus;
    });
  }, [planList, searchTerm]);

  const handleEdit = (plan) => {
    setSelectedPlan(plan);
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
    setSelectedPlan(null);
  };

  return (
    <Paper className="mt-6 p-6">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Plan List</h2>{" "}
        <Button
          variant="contained"
          color="success"
          onClick={() => fetchPlans()}
        >
          Refresh
        </Button>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <TextField
          label="Search by name..."
          variant="outlined"
          size="small"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
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
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {[
                "ID",
                "Name",
                "Plan Price",
                "Status",
                "No. Of Users",
                // "No. Of Donors",
                "No. Of Donations",
                "FORM10BE Report",
                "CR Date",
                "Actions",
              ].map((heading) => (
                <TableCell key={heading}>
                  <b>{heading}</b>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredStaff.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No staff found.
                </TableCell>
              </TableRow>
            ) : (
              filteredStaff
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((plan, index) => (
                  <TableRow key={index}>
                    <TableCell>{plan.planID}</TableCell>
                    <TableCell>{plan.planName}</TableCell>
                    <TableCell>{plan.planPrice}</TableCell>
                    <TableCell>{plan.planStatus}</TableCell>
                    <TableCell>{plan.numberOfUsers}</TableCell>
                    {/* <TableCell>{plan.numberOfDonors}</TableCell> */}
                    <TableCell>{plan.numberOfDonations}</TableCell>
                    <TableCell>
                      {plan.form10BEReport === 1 ? "Yes" : "No"}
                    </TableCell>
                    <TableCell>
                      {plan.createDate ? plan.createDate : "NA"}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => handleEdit(plan)}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={filteredStaff.length}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={(_, newPage) => setPage(newPage)}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
        rowsPerPageOptions={[5, 10, 25]}
      />
      {/* Render Edit User Form */}
      {editOpen && selectedPlan && (
        <EditPlanForm
          open={editOpen}
          onClose={handleEditClose}
          user={selectedPlan}
        />
      )}
    </Paper>
  );
};

export default PlanTable;
