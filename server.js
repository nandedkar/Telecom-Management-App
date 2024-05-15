const express = require("express");
const cors = require("cors");
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 5000;

const usersFile = './users.json';

// Middleware to parse JSON data
app.use(cors());
app.use(express.json());

// Load users from JSON file
let users = [];
try {
  const usersData = fs.readFileSync(usersFile, 'utf8');
  users = JSON.parse(usersData);
} catch (err) {
  console.error('Error reading users file:', err);
}

// Routes for different functionalities
app.use("/api/customers", require("./routes/customers"));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
