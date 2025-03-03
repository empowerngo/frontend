import { useState, useEffect, useMemo, useCallback } from "react";
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
  IconButton,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { retrieveNGOList } from "../../api/masterApi";
import EditNGOForm from "./EditNGOForm";
import ViewNGO from "./ViewNGO";

const ManageNGOTable = () => {
  const [ngoList, setNgoList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedNGO, setSelectedNGO] = useState(null);

  const fetchNGOs = useCallback(async () => {
    try {
      setLoading(true);
      const response = await retrieveNGOList("list");
      if (response?.payload && Array.isArray(response.payload)) {
        setNgoList(response.payload);
      } else {
        setNgoList([]);
      }
    } catch (err) {
      setError("Failed to fetch NGO data",err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNGOs();
  }, [fetchNGOs]);

  const filteredNGOs = useMemo(() => {
    return searchTerm
      ? ngoList.filter((ngo) =>
          (ngo.NGO_NAME || "").toLowerCase().includes(searchTerm.toLowerCase())
        )
      : ngoList;
  }, [ngoList, searchTerm]);

  const handleEdit = useCallback((ngo) => {
    setSelectedNGO(ngo.NGO_ID);
    setEditOpen(true);
  }, []);

  const handleView = useCallback((ngo) => {
    setSelectedNGO(ngo.NGO_ID);
    setViewOpen(true);
  }, []);

  const handleEditClose = useCallback(() => {
    setEditOpen(false);
    setSelectedNGO(null);
  }, []);

  const handleViewClose = useCallback(() => {
    setViewOpen(false);
    setSelectedNGO(null);
  }, []);

  const handleChangePage = useCallback((_, newPage) => {
    setPage(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback((event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }, []);

  return (
    <Paper className="mt-6 p-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800">NGO List</h2>

      {loading ? (
        <div className="flex justify-center items-center">
          <CircularProgress />
        </div>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          <div className="flex items-center gap-2 mb-4">
            <TextField
              label="Search by name..."
              variant="outlined"
              size="small"
              fullWidth
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <TableContainer sx={{ overflowX: "auto", maxWidth: "100%" }}>
            <Table sx={{ minWidth: "150px" }}>
              <TableHead>
                <TableRow>
                  <TableCell><b>NGO Name</b></TableCell>
                  <TableCell><b>Registration Number</b></TableCell>
                  <TableCell><b>City</b></TableCell>
                  <TableCell><b>State</b></TableCell>
                  <TableCell><b>Email</b></TableCell>
                  <TableCell><b>Contact</b></TableCell>
                  <TableCell><b>Actions</b></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredNGOs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      No NGOs found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredNGOs
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((ngo) => (
                      <TableRow key={ngo.NGO_ID}>
                        <TableCell>{ngo.NGO_NAME || "N/A"}</TableCell>
                        <TableCell>{ngo.NGO_REG_NUMBER || "N/A"}</TableCell>
                        <TableCell>{ngo.NGO_CITY || "N/A"}</TableCell>
                        <TableCell>{ngo.NGO_STATE || "N/A"}</TableCell>
                        <TableCell>{ngo.NGO_EMAIL || "N/A"}</TableCell>
                        <TableCell>{ngo.NGO_CONTACT || "N/A"}</TableCell>
                        <TableCell>
                          <Tooltip title="View">
                            <IconButton color="primary" onClick={() => handleView(ngo)}>
                              <VisibilityIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit">
                            <IconButton color="secondary" onClick={() => handleEdit(ngo)}>
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={filteredNGOs.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </>
      )}

      {editOpen && selectedNGO && (
        <EditNGOForm open={editOpen} onClose={handleEditClose} ngoId={selectedNGO} />
      )}

      {viewOpen && selectedNGO && (
        <ViewNGO open={viewOpen} onClose={handleViewClose} ngoId={selectedNGO} />
      )}
    </Paper>
  );
};

export default ManageNGOTable;
