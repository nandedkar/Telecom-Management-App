const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const usersFile = path.join(__dirname, "../users.json");
let customers = [];
try {
  const usersData = fs.readFileSync(usersFile, "utf8");
  customers = JSON.parse(usersData);
} catch (err) {
  console.error("Error reading users file:", err);
}
// GET all customers
router.get("/", (req, res) => {
  try {
    const usersData = fs.readFileSync(usersFile, "utf8");
    customers = JSON.parse(usersData);
  } catch (err) {
    console.error("Error reading users file:", err);
  }
  res.json(customers);
});

router.get("/userById/:id", (req, res) => {
  const user = customers.filter((user) => user.id === req.params.id);
  res.json(user);
});

// POST a new customer
router.post("/register", (req, res) => {
  const userData = req.body;
  // Validate input (e.g., check for required fields)
  if (!userData.name || !userData.email || !userData.mobileNumber) {
    return res.status(400).json({
      message: "Please provide all required fields",
      isSuccess: false,
    });
  }

  // check duplicate record on basis of Aadhar card no function pushToArray(arr, obj) {
  const index = customers.findIndex(
    (item) => item.adharNumber === userData.adharNumber
  );
  if (index === -1) {
    customers.push({ ...userData, id: uuidv4() });
  } else {
    return res.status(400).json({
      message: "User already exists, Aadhar number need to be unique.",
      isSuccess: false,
    });
  }

  try {
    fs.writeFileSync(usersFile, JSON.stringify(customers, null, 2));
    return res.status(201).json({
      message: "User registered successfully",
      user: userData,
      isSuccess: true,
    });
  } catch (err) {
    console.error("Error writing customers file:", err);
    return res
      .status(500)
      .json({ message: "Error registering user", isSuccess: false });
  }
});

router.get("/delete/:id", (req, res) => {
  const { id } = req.params;
  console.log("id", id);

  // Find index of user by ID
  const index = customers.findIndex((user) => user.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "User not found" });
  }

  // Remove user from array
  customers.splice(index, 1);

  // Write updated data back to file
  fs.writeFileSync(usersFile, JSON.stringify(customers, null, 2));

  res.json({
    message: "User deleted successfully",
    user: customers,
    isSuccess: true,
  });
});

// POST a new plan
router.post("/choosePlan", (req, res) => {
  const userData = req.body;
  // Validate input (e.g., check for required fields)
  if (
    !userData.id ||
    !userData.planName ||
    !userData.planCost ||
    !userData.validity
  ) {
    return res.status(400).json({
      message: "Please fill / refill all required fields",
      isSuccess: false,
    });
  }
  // Add user to database (JSON file)
  const choosedPlanForUser = customers.map((user) =>
    user.id === userData.id ? { ...user, ...userData } : user
  );
  try {
    fs.writeFileSync(usersFile, JSON.stringify(choosedPlanForUser, null, 2));
    return res.status(201).json({
      message: "User plan enrolled successfully",
      user: choosedPlanForUser,
      isSuccess: true,
    });
  } catch (err) {
    console.error("Error writing customers file:", err);
    return res
      .status(500)
      .json({ message: "Error registering user", isSuccess: false });
  }
});

router.post("/renewPlan", (req, res) => {
  const userData = req.body;
  console.log("userData: ", userData);
  // Validate input (e.g., check for required fields)
  if (!userData.renewDate || !userData.status) {
    return res.status(400).json({
      message: "Please provide all required fields",
      isSuccess: false,
    });
  }

  // Add user to database (JSON file)
  const renewedData = customers.map((user) =>
    user.id === userData.id ? { ...user, ...userData } : user
  );

  try {
    fs.writeFileSync(usersFile, JSON.stringify(renewedData, null, 2));
    return res.status(201).json({
      message: "User data updated successfully",
      user: renewedData,
      isSuccess: true,
    });
  } catch (err) {
    console.error("Error writing customers file:", err);
    return res
      .status(500)
      .json({ message: "Error registering user", isSuccess: false });
  }
});

// Other routes for renewing, upgrading, downgrading plans, etc.

module.exports = router;
