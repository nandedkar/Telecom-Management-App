// UpgradeDowngrade.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import {
  Alert,
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";

const UpgradeDowngrade = () => {
  const { userId } = useParams();
  const [formData, setFormData] = useState({
    id: userId,
    planName: "",
    planCost: "",
    validity: "",
    status: "",
  });
  const [userData, setUserData] = useState([]);
  const [response, setResponse] = useState("");

  useEffect(() => {
    fetchUserById();
  }, []);

  const fetchUserById = async () => {
    if (userId) {
      try {
        const resp = await axios.get(
          `http://localhost:5000/api/customers/userById/${userId}`
        );
        setUserData(resp.data);
      } catch (error) {
        console.error("Error:", error);
      }
    } else {
      try {
        const resp = await axios.get("http://localhost:5000/api/customers");
        setUserData(resp.data);
        setFormData({ ...formData, ...resp.data });
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const resp = await axios.post(
        "http://localhost:5000/api/customers/choosePlan",
        formData
      );
      setResponse(resp.data);
      window.location.href = '/displayCustomers';
      // Add logic for success message or redirect
    } catch (error) {
      console.error("Error:", error);
      setResponse(error.response.data);
      // Add logic for error message
    }
  };

  const existingPlan = () => {
    const data = userData.filter((user) => user.id === formData.id);
    return data.map((user) => {
      return (
        <>
          <FormControl sx={{ m: 1, minWidth: 250 }}>
            <TextField
              required
              id="outlined-required"
              label="Existing Plan"
              name="planName"
              value={user.planName}
              type="text"
              disabled
              // onChange={handleChange}
            />
          </FormControl>
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="plan-name-label">Plan Name</InputLabel>
            <Select
              name="planName"
              id="plan-name-label"
              defaultValue={user.planName}
              label="Plan Name"
              onChange={handleChange}
              autoWidth={true}
              required
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
              defaultValue={user.planCost}
              label="Plan Cost"
              onChange={handleChange}
              required
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
              defaultValue={user.validity}
              label="Validity"
              onChange={handleChange}
              required
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
              defaultValue={user.status}
              label="Plan Status"
              onChange={handleChange}
              required
            >
              <MenuItem value={"Active"}>Active</MenuItem>
              <MenuItem value={"Inactive"}>Inactive</MenuItem>
            </Select>
          </FormControl>
        </>
      );
    });
  };

  return (
    <Box
      sx={{
        "& .MuiTextField-root": { m: 1, width: "55ch" },
      }}
      noValidate
      autoComplete="off"
    >
      <form className="renewPlan" onSubmit={handleSubmit}>
        { (userId || formData.id) &&  response ? (
          <Alert severity={response.isSuccess ? "success" : "info"}>
            {response ? response.message : "Upgrading / downgrading"} for :{" "}
            {userData[0]?.name}
          </Alert>
        ) : (
          <>
            <Alert severity="error">
              User not selected for renewing plan, Please select user from below
              list.
            </Alert>
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
          </>
        )}
        {existingPlan()}
        <Button variant="contained" type="submit">
          Update
        </Button>
      </form>
    </Box>
  );
};

export default UpgradeDowngrade;
