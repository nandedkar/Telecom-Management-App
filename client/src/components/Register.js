// Register.js
import React, { useState } from "react";
import axios from "axios";

import { v4 as uuidv4 } from "uuid";
import { Alert, Box, Button, TextField } from "@mui/material";

import dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import "./index.scss";
const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    email: "",
    adharNumber: "",
    registrationDate: "",
    mobileNumber: "",
    status: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    dob: "",
    email: "",
    adharNumber: "",
    registrationDate: "",
    mobileNumber: "",
    status: "",
  });

  const [response, setResponse] = useState();

  const handleChange = (e, field) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: field ? e : value,
    });

    // Clear validation errors when the user starts typing again
    setErrors((prevErrors) => ({
      ...prevErrors,
      [e.target.name]: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let isValid = true;

    // Name validation
    if (formData.name.trim() === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        name: "Name is required",
      }));
      isValid = false;
    }

    // Email validation
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "Invalid email format",
      }));
      isValid = false;
    }

    // Mobile number validation
    if (!/^\d{10}$/.test(formData.mobileNumber)) {
      debugger
      setErrors((prevErrors) => ({
        ...prevErrors,
        mobileNumber: "Mobile number must be 10 digits",
      }));
      isValid = false;
    }

    // Adhar number validation
    if (!/^\d{12}$/.test(formData.adharNumber)) {
      debugger
      setErrors((prevErrors) => ({
        ...prevErrors,
        adharNumber: "Adhar number must be 12 digits",
      }));
      isValid = false;
    }

    const isValidDOB = validateDOB(formData.dob);
    if (!isValidDOB) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        dob: "Date of Birth must be a past date",
      }));
      return;
    }
    
    const isValidRegDate = validateRegDate(formData.registrationDate);
    if (!isValidRegDate) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        registrationDate: "Registration date  must be a future date",
      }));
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/customers/register",
        formData
      );
      setResponse({
        message: response.data.message,
        isSuccess: response.data.isSuccess,
      });
      // Add logic for success message or redirect
    } catch (error) {
      console.error("Error:", error);
      setResponse({
        message: error.response.data.message,
        isSuccess: error.response.data.isSuccess,
      });
      // Add logic for error message
    }
  };

  const validateDOB = (dob) => {
    const enteredDate = new Date(dob);
    const currentDate = new Date();
    return enteredDate < currentDate;
  };

  const validateRegDate = (regDate) => {
    const enteredDate = new Date(regDate);
    const currentDate = new Date();
    return enteredDate > currentDate;
  };

  return (
    <Box
      sx={{
        "& .MuiTextField-root": { m: 1, width: "55ch" },
      }}
    >
      <div>
        <form className="register" onSubmit={handleSubmit}>
          {response && (
            <Alert
              severity={response?.isSuccess ? "success" : "error"}
              closeText="close"
            >
              {response?.message}
            </Alert>
          )}
          <TextField
            required
            id="outlined-required"
            label="Name"
            name="name"
            defaultValue=""
            type="text"
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
          />
          <TextField
            required
            id="dob"
            label="Date of Birth"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            type="date"
            InputLabelProps={{
              shrink: true,
            }}
            error={!!errors.dob}
            helperText={errors.dob}
          />
          <TextField
            required
            id="outlined-required"
            label="Email"
            defaultValue=""
            name="email"
            type="email"
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
          />

          <TextField
            required
            id="outlined-required"
            label="Aadhar"
            defaultValue=""
            type="number"
            name="adharNumber"
            onChange={handleChange}
            error={!!errors.adharNumber}
            helperText={errors.adharNumber}
          />
          <TextField
            required
            id="registrationDate"
            label="Registration Date"
            name="registrationDate"
            value={formData.registrationDate}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            type="date"
            InputLabelProps={{
              shrink: true,
            }}
            error={!!errors.registrationDate}
            helperText={errors.registrationDate}
          />

          <TextField
            required
            id="outlined-required"
            label="Mobile No"
            defaultValue=""
            type="number"
            name="mobileNumber"
            onChange={handleChange}
            error={!!errors.mobileNumber}
            helperText={errors.mobileNumber}
          />
          <Button variant="contained" type="submit">
            Register
          </Button>
        </form>
      </div>
    </Box>
  );
};

export default Register;
