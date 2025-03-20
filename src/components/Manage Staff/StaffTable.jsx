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
  IconButton
} from "@mui/material";
import EditUserForm from "./EditUserForm"; 
import { retrieveUserList } from "../../api/masterApi";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";

const StaffTable = () => {
  const [userList, setUserList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false); 

  
    const fetchUserList = async () => {
      setLoading(true); 
      try {
        const response = await retrieveUserList("list");
        setUserList(response?.payload || []);
      } catch (err) {
        console.error("Failed to fetch User data", err);
      } finally {
        setLoading(false);
      }
    };
    useEffect(() => {
    fetchUserList();
  }, []);


  const filteredStaff = useMemo(() => {
    if (!Array.isArray(userList)) {
      return userList; // Or return [], or handle the error appropriately
    }
  
    if (!searchTerm) {
      return userList;
    }
  
    const lowerSearchTerm = searchTerm.toLowerCase();
  
    return userList.filter((staff) => {
      const name = (staff.NAME || "").toLowerCase();
      const email = (staff.EMAIL || "").toLowerCase();
      const contact = (staff.CONTACT_NUMBER || "").toLowerCase();
  
      return (
        name.includes(lowerSearchTerm) ||
        email.includes(lowerSearchTerm) ||
        contact.includes(lowerSearchTerm)
      );
    });
  }, [userList, searchTerm]);

  const handleEdit = (staff) => {
    setSelectedUser(staff); 
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
    fetchUserList();
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
                "Name",
                "Email",
                "Phone",
                "Role",
                "NGO Name",
                "Created by",
                "Status",
                "Actions"
              ].map((heading) => (
                <TableCell key={heading}>
                  <b>{heading}</b>
                </TableCell>
              ))}
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
                      {/* <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => handleEdit(staff)}
                      >
                        Edit
                      </Button> */}
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
        rowsPerPageOptions={[5, 10, 25]}
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
