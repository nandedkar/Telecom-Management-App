import axios from "axios";
import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Badge, Button } from "@mui/material";

export default function DisplayCustomer() {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/customers");
      setCustomers(response.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };
  const deleteUser = async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/customers/delete/${id}`
      );
      setCustomers(response.data.user);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  return (
    <div>
      <h1>Telecom Customer Management System</h1>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">Date of Birth</TableCell>
              <TableCell align="right">Email</TableCell>
              <TableCell align="right">Aadhar No</TableCell>
              <TableCell align="right">Registration Date</TableCell>
              <TableCell align="right">Mobile No</TableCell>
              <TableCell align="right">Status</TableCell>
              <TableCell align="right">Upgrade/Downgrade</TableCell>
              <TableCell align="right">Edit</TableCell>
              <TableCell align="right">Remove</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.length > 0
              ? customers.map((row) => (
                  <TableRow
                    key={row.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.name}
                    </TableCell>
                    <TableCell align="right">{row.dob}</TableCell>
                    <TableCell align="right">{row.email}</TableCell>
                    <TableCell align="right">{row.adharNumber}</TableCell>
                    <TableCell align="right">{row.registrationDate}</TableCell>
                    <TableCell align="right">{row.mobileNumber}</TableCell>
                    <TableCell align="right">
                      {row.status === "Active" ? (
                        <Badge badgeContent={"Active"} color="success"></Badge>
                      ) : (
                        <Badge badgeContent={"Inactive"} color="error"></Badge>
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        href={`/upgradeDowngrade/${row.id}`}
                        variant="outlined"
                        color="warning"
                      >
                        Upgrade/DownGrade
                      </Button>
                    </TableCell>
                    <TableCell align="right">
                        <Button
                          href={`/renewPlan/${row.id}`}
                          variant="outlined"
                          disabled={row.status === "Active"}
                        >
                          Renew
                        </Button>
                    </TableCell>

                    <TableCell align="right">
                      <Button
                        onClick={() => deleteUser(row.id)}
                        variant="outlined"
                        color="error"
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              : "No Data"}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
