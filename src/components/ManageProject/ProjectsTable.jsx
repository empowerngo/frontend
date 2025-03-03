// components/Table/ProjectAndPurposeTable.jsx
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
  CircularProgress,
} from "@mui/material";
import { FaEdit, FaTrash } from "react-icons/fa";
import EditProjectAndPurposeForm from "./EditProjectsForm";

const ProjectAndPurposeTable = ({ items = [], handleDelete, fetchData, isProject }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const handleEdit = (item) => {
    setEditItem(item);
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
    setEditItem(null);
  };

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const name = isProject ? item?.projectName || item?.PROJECT_NAME : item?.purposeName;
      return name?.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [items, searchTerm, isProject]);

  return (
    <Paper className="mt-6 p-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800 text-center">
        {isProject ? "Project List" : "Purpose List"}
      </h2>

      {/* Search Input */}
      <div className="flex items-center gap-2 mb-4">
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
      </div>

      {/* Table */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow className={isProject ? "font-bold mb-4 text-black " : "bg-green-600 text-white"}>
              {isProject ? (
                <>
                  <TableCell>Project Name</TableCell>
                  <TableCell>Actions</TableCell>
                </>
              ) : (
                <>
                  <TableCell>Project Name</TableCell>
                  <TableCell>Purpose Name</TableCell>
                  <TableCell>Actions</TableCell>
                </>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={isProject ? 2 : 3} align="center">
                  <CircularProgress size={24} />
                </TableCell>
              </TableRow>
            ) : filteredItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={isProject ? 2 : 3} align="center">
                  No {isProject ? "projects" : "purposes"} found.
                </TableCell>
              </TableRow>
            ) : (
              filteredItems
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((item, index) => (
                  <TableRow key={index}>
                    {isProject ? (
                      <TableCell>{item?.projectName || item?.PROJECT_NAME}</TableCell>
                    ) : (
                      <>
                        <TableCell>{item?.projectName || "N/A"}</TableCell>
                        <TableCell>{item?.purposeName}</TableCell>
                      </>
                    )}
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => handleEdit(item)}
                      >
                        <FaEdit size={18} />
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        size="small"
                        onClick={() => handleDelete(isProject ? item?.PROJECT_ID : item?.PURPOSE_ID)}
                      >
                        <FaTrash size={18} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
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

      {/* Edit Form */}
      {editOpen && editItem && (
        <EditProjectAndPurposeForm
          open={editOpen}
          onClose={handleEditClose}
          editItem={editItem}
          fetchData={fetchData}
          isProject={isProject}
        />
      )}
    </Paper>
  );
};

export default ProjectAndPurposeTable;
