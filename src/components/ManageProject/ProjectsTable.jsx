import { useState, useMemo } from "react";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  IconButton,
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const ProjectAndPurposeTable = ({ 
  items = [], 
  handleDelete, 
  fetchData, 
  isProject 
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [editItem, setEditItem] = useState(null);
  const [editOpen, setEditOpen] = useState(false);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const name = isProject ? item?.projectName || item?.PROJECT_NAME : item?.purposeName;
      return name?.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [items, searchTerm, isProject]);

  const handleEdit = (item) => {
    setEditItem(item);
    setEditOpen(true);
  };

  const handleCloseEdit = () => {
    setEditOpen(false);
    setEditItem(null);
  };

  const handleSaveEdit = async () => {
    await fetchData();
    handleCloseEdit();
  };

  return (
    <Paper sx={{ mt: 6, p: 4, borderRadius: 2, boxShadow: 3 }}>
      <Typography variant="h5" align="center" gutterBottom>
        {isProject ? "Project List" : "Purpose List"}
      </Typography>

      <Box display="flex" gap={2} mb={2}>
        <TextField
          label={isProject ? "Search Project..." : "Search Purpose..."}
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
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f4f4f4" }}>
              {isProject ? (
                <>
                  <TableCell align="center">Project Name</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </>
              ) : (
                <>
                  <TableCell align="center">Project Name</TableCell>
                  <TableCell align="center">Purpose Name</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={isProject ? 2 : 3} align="center">
                  No {isProject ? "projects" : "purposes"} found.
                </TableCell>
              </TableRow>
            ) : (
              filteredItems
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((item, index) => (
                  <TableRow key={index} hover>
                    {isProject ? (
                      <TableCell align="center">{item?.projectName || item?.PROJECT_NAME}</TableCell>
                    ) : (
                      <>
                        <TableCell align="center">{item?.projectName || "N/A"}</TableCell>
                        <TableCell align="center">{item?.purposeName}</TableCell>
                      </>
                    )}
                    <TableCell align="center">
                      <Tooltip title="Edit">
                        <IconButton
                          color="primary"
                          onClick={() => handleEdit(item)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(isProject ? item?.PROJECT_ID : item?.PURPOSE_ID)}
                        >
                          <DeleteIcon fontSize="small" />
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
        count={filteredItems.length}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={(_, newPage) => setPage(newPage)}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
        rowsPerPageOptions={[5, 10, 25]}
      />

      <Dialog open={editOpen} onClose={handleCloseEdit} fullWidth maxWidth="sm">
        <DialogTitle>{isProject ? "Edit Project" : "Edit Purpose"}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Project Name"
            name="projectName"
            value={editItem?.PROJECT_NAME || ""}
            onChange={(e) => setEditItem({ ...editItem, PROJECT_NAME: e.target.value })}
            margin="dense"
          />
          {!isProject && (
            <TextField
              fullWidth
              label="Purpose Name"
              name="purposeName"
              value={editItem?.purposeName || ""}
              onChange={(e) => setEditItem({ ...editItem, purposeName: e.target.value })}
              margin="dense"
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEdit} variant="outlined" color="secondary">Cancel</Button>
          <Button onClick={handleSaveEdit} variant="contained" color="primary">Save</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default ProjectAndPurposeTable;
