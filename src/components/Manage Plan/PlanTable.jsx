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

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await getSubsPlans();
        setPlanList(response?.payload || []);
      } catch (err) {
        console.error("Failed to fetch User data", err);
      }
    };
    fetchPlans();
  }, []);

  const filteredStaff = useMemo(() => {
    if (!Array.isArray(planList) || !searchTerm) {
        return planList;
    }

    const lowerCaseSearchTerm = searchTerm.toLowerCase();

    return planList.filter((plan) => {
        const nameMatch = (plan.PLAN_NAME || "").toLowerCase().includes(lowerCaseSearchTerm);
        const planStatus = (plan.STATUS || "").toLowerCase().includes(lowerCaseSearchTerm);
        // Return true if ANY of the fields match the search term
        return nameMatch || planStatus ;
    });
}, [planList, searchTerm]);

  const handleEdit = (plan) => {
    setSelectedPlan(plan); // Pass full staff object for editing
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
    setSelectedPlan(null);
  };

  return (
    <Paper className="mt-6 p-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Plan List</h2>
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
              {["ID","Name", "Plan Price", "Status", "No. Of Users", "No. Of Donors", "No. Of Donations", "FORM10BE Report", "CR Date", "Actions"].map((heading) => (
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
              filteredStaff.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((plan, index) => (
                <TableRow key={index}>
                  <TableCell>{plan.PLAN_ID}</TableCell>
                  <TableCell>{plan.PLAN_NAME}</TableCell>
                  <TableCell>{plan.PLAN_PRICE}</TableCell>
                  <TableCell>{plan.PLAN_STATUS}</TableCell>
                  <TableCell>{plan.NUMBER_OF_USERS}</TableCell>
                  <TableCell>{plan.NUMBER_OF_DONORS}</TableCell>
                  <TableCell>{plan.NUMBER_OF_DONATIONS}</TableCell>
                  <TableCell>{plan.FORM_10BE_REPORT}</TableCell>
                  <TableCell>{plan.CREATED_AT}</TableCell>
                  <TableCell>
                    <Button variant="contained" color="primary" size="small" onClick={() => handleEdit(plan)}>
                      Edit
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
        <EditPlanForm open={editOpen} onClose={handleEditClose} user={selectedPlan} />
      )}
    </Paper>
  );
};

export default PlanTable;
