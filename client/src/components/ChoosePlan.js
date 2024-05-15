// ChoosePlan.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Alert,
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import "./index.scss";

const ChoosePlan = () => {
  const [formData, setFormData] = useState({
    planName: "",
    planCost: "",
    validity: "",
    status: "",
  });

  const [response, setResponse] = useState("");
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/customers");
      setUserData(response.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/customers/choosePlan",
        formData
      );
      console.log(response.data);

      setResponse(response.data);
      window.location.href = "/displayCustomers";

      // Add logic for success message or redirect
    } catch (error) {
      console.error("Error:", error);
      setResponse(error.response.data);
      // Add logic for error message
    }
  };

  return (
    <Box
      sx={{
        "& .MuiTextField-root": { m: 1, width: "55ch" },
      }}
      noValidate
      autoComplete="off"
    >
      <div>
        <form onSubmit={handleSubmit} className="choosePlan">
          {!formData.id && (
            <Alert severity="error">
              User not selected for renewing plan, Please select user from below
              list.
            </Alert>
          )}
          {response && (
            <Alert severity={response.isSuccess ? "success" : "error"}>
              {response.message}
            </Alert>
          )}
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="plan-cost-label">Select customer *</InputLabel>
            <Select
              name="id"
              id="customer-label"
              label="Select Customer *"
              onChange={handleChange}
              required
            >
              {userData.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="plan-name-label">Plan Name</InputLabel>
            <Select
              name="planName"
              id="plan-name-label"
              defaultValue={formData.planName}
              label="Plan Name"
              onChange={handleChange}
              autoWidth={true}
            >
              <MenuItem value={"Platinum365"}>Platinum 365</MenuItem>
              <MenuItem value={"Gold180"}>Gold 180</MenuItem>
              <MenuItem value={"Silver90"}>Silver 90</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="plan-cost-label">Plan Cost</InputLabel>
            <Select
              name="planCost"
              id="plan-cost-label"
              defaultValue={formData.planCost}
              label="Plan Cost"
              onChange={handleChange}
            >
              <MenuItem value={"499"}>499</MenuItem>
              <MenuItem value={"299"}>299</MenuItem>
              <MenuItem value={"199"}>199</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="plan-validity-label">Validity</InputLabel>
            <Select
              id="plan-validity-label"
              name="validity"
              defaultValue={formData.validity}
              label="Validity"
              onChange={handleChange}
            >
              <MenuItem value={"365"}>365</MenuItem>
              <MenuItem value={"180"}>180</MenuItem>
              <MenuItem value={"90"}>90</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="plan-status-label">Plan Status</InputLabel>
            <Select
              name="status"
              id="plan-status-label"
              defaultValue={formData.status}
              label="Plan Status"
              onChange={handleChange}
            >
              <MenuItem value={"Active"}>Active</MenuItem>
              <MenuItem value={"Inactive"}>Inactive</MenuItem>
            </Select>
          </FormControl>
          <Button variant="contained" type="submit">
            Submit
          </Button>
        </form>
      </div>
    </Box>
  );
};

export default ChoosePlan;
