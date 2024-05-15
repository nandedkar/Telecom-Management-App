// Navbar.js
import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

const Layout = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
        Telecom Customer Management System
        </Typography>
        <Button color="inherit" component={Link} to="/">
          Home
        </Button>
        {/* user will redirect to this when he will select New User */}
        {/* <Button color="inherit" component={Link} to="/register">
          Register
        </Button> */}
        <Button color="inherit" component={Link} to="/plan">
          Choose Plan
        </Button>
        <Button color="inherit" component={Link} to="/displayCustomers">
          Display Customer
        </Button>
        <Button color="inherit" component={Link} to="/renewPlan">
          Renew Plan
        </Button>
        <Button color="inherit" component={Link} to="/upgradeDowngrade">
          Upgrade/Downgrade Plan
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Layout;
