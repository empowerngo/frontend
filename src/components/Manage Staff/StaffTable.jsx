import { useState, useEffect, useMemo } from "react";
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
  CircularProgress,
  IconButton,
  TableSortLabel,
} from "@mui/material";
import EditUserForm from "./EditUserForm";
import EditIcon from "@mui/icons-material/Edit";

const StaffTable = ({ users, loading }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("NAME");

  const filteredStaff = useMemo(() => {
    if (!Array.isArray(users)) return [];

    let filtered = users;
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filtered = users.filter((staff) =>
        [staff.NAME, staff.EMAIL, staff.CONTACT_NUMBER]
          .map((field) => (field || "").toLowerCase())
          .some((value) => value.includes(lowerSearchTerm))
      );
    }

    return filtered.sort((a, b) => {
      if (a[orderBy] < b[orderBy]) return order === "asc" ? -1 : 1;
      if (a[orderBy] > b[orderBy]) return order === "asc" ? 1 : -1;
      return 0;
    });
  }, [users, searchTerm, order, orderBy]);

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleEdit = (staff) => {
    setSelectedUser(staff);
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
    setSelectedUser(null);
  };

  return (
    <Paper className="mt-6 p-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800">User List</h2>
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
            <TableRow className="bg-gray-100">
              {[
                "NAME",
                "EMAIL",
                "CONTACT_NUMBER",
                "ROLE_NAME",
                "NGO_NAMES",
                "CREATED_BY_NAME",
                "USER_STATUS",
              ].map((heading) => (
                <TableCell key={heading}>
                  <TableSortLabel
                    active={orderBy === heading}
                    direction={orderBy === heading ? order : "asc"}
                    onClick={() => handleSort(heading)}
                  >
                    <b>{heading.replace("_", " ")}</b>
                  </TableSortLabel>
                </TableCell>
              ))}
              <TableCell>
                <b>Actions</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <CircularProgress size={24} />
                </TableCell>
              </TableRow>
            ) : filteredStaff.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No staff found.
                </TableCell>
              </TableRow>
            ) : (
              filteredStaff
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((staff, index) => (
                  <TableRow key={index}>
                    <TableCell>{staff.NAME}</TableCell>
                    <TableCell>{staff.EMAIL}</TableCell>
                    <TableCell>{staff.CONTACT_NUMBER}</TableCell>
                    <TableCell>{staff.ROLE_NAME}</TableCell>
                    <TableCell>{staff.NGO_NAMES}</TableCell>
                    <TableCell>{staff.CREATED_BY_NAME}</TableCell>
                    <TableCell>{staff.USER_STATUS}</TableCell>
                    <TableCell>
                      <IconButton
                        color="secondary"
                        onClick={() => handleEdit(staff)}
                      >
                        <EditIcon />
                      </IconButton>
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
        rowsPerPageOptions={[10, 20, 50, 100]}
      />
      {editOpen && selectedUser && (
        <EditUserForm
          open={editOpen}
          onClose={handleEditClose}
          user={selectedUser}
        />
      )}
    </Paper>
  );
};

export default StaffTable;
