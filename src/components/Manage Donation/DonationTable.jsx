import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

const DonationTable = () => {
  const donations = [
    { id: 1, date: "2024-02-19", name: "John Doe", mobile: "1234567890", amount: 500 },
  ];

  return (
    <TableContainer component={Paper} className="mt-4 shadow-md rounded-lg">
      <Table>
        <TableHead>
          <TableRow className="bg-gray-100">
            <TableCell className="font-semibold text-gray-700">SI</TableCell>
            <TableCell className="font-semibold text-gray-700">Date</TableCell>
            <TableCell className="font-semibold text-gray-700">Receipt</TableCell>
            <TableCell className="font-semibold text-gray-700">Name</TableCell>
            <TableCell className="font-semibold text-gray-700">Mobile</TableCell>
            <TableCell className="font-semibold text-gray-700">Amount</TableCell>
            <TableCell className="font-semibold text-gray-700">Support</TableCell>
            <TableCell className="font-semibold text-gray-700">Receipt</TableCell>
            <TableCell className="font-semibold text-gray-700">Send</TableCell>
            <TableCell className="font-semibold text-gray-700">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {donations.map((donation, index) => (
            <TableRow key={index} className="hover:bg-gray-50 transition">
              <TableCell>{index + 1}</TableCell>
              <TableCell>{donation.date}</TableCell>
              <TableCell>-</TableCell>
              <TableCell>{donation.name}</TableCell>
              <TableCell>{donation.mobile}</TableCell>
              <TableCell>{donation.amount}</TableCell>
              <TableCell>-</TableCell>
              <TableCell>-</TableCell>
              <TableCell>-</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <IconButton
                    aria-label="edit"
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    aria-label="delete"
                    className="text-red-500 hover:text-red-700"
                  >
                    <Delete />
                  </IconButton>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DonationTable;
