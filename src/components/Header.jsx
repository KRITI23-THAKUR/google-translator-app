import { Avatar, Button, Menu, MenuItem, Box, Typography } from "@mui/material";
import Logout from "@mui/icons-material/Logout";
import React, { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebaseconfig";
import { Login } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

function Header({ user }) {
  const nav = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const toggleMenu = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  const handleLogin = () => {
    nav("/login");
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 20px",
        background: "#F1F1F1",
        borderRadius: "12px",
        boxShadow: "4px 4px 8px rgba(0, 0, 0, 0.1), -4px -4px 8px rgba(255, 255, 255, 0.5)",
        transition: "all 0.3s ease",
        height: "50px",
        ":hover": {
          boxShadow: "6px 6px 12px rgba(0, 0, 0, 0.2), -6px -6px 12px rgba(255, 255, 255, 0.7)",
        },
      }}
    >
      {/* Logo / Title */}
      <Typography variant="h6" sx={{ fontWeight: "bold", color: "#333", fontFamily: "'Roboto', sans-serif" }}>
        Translator
      </Typography>

      {/* Profile Avatar & Menu */}
      <Button onClick={toggleMenu} sx={{ boxShadow: "none" }}>
        <Avatar
          alt={user?.displayName}
          src={user?.photoURL || ""} // If the photoURL exists (Google profile), use it as the image source
          sx={{
            width: 40,
            height: 40,
            background: user?.photoURL ? "none" : "linear-gradient(45deg, #FF8E53, #FF6D00, #FF4081)", // Apply gradient only if no photoURL
            boxShadow: "4px 4px 8px rgba(0, 0, 0, 0.1), -4px -4px 8px rgba(255, 255, 255, 0.5)",
            transition: "all 0.3s ease",
            ":hover": {
              boxShadow: "6px 6px 10px rgba(0, 0, 0, 0.2), -6px -6px 10px rgba(255, 255, 255, 0.7)",
            },
          }}
        >
          {/* If no photoURL, display initial letter */}
          {!user?.photoURL && (
            <Typography sx={{ color: "#fff", fontSize: "16px", fontWeight: "bold" }}>
              {user?.displayName ? user.displayName.charAt(0).toUpperCase() : "G"}
            </Typography>
          )}
        </Avatar>
      </Button>

      {/* Dropdown Menu */}
      <Menu
        id="profile-options"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        sx={{
          "& .MuiPaper-root": {
            background: "#F1F1F1",
            borderRadius: "12px",
            boxShadow: "4px 4px 8px rgba(0, 0, 0, 0.1), -4px -4px 8px rgba(255, 255, 255, 0.5)",
          },
        }}
      >
        <MenuItem sx={{ fontWeight: "bold" }}>{user?.displayName}</MenuItem>
        {user?.email && <MenuItem>{user.email}</MenuItem>}

        {user?.email && (
          <MenuItem onClick={handleLogout} sx={{ color: "#D32F2F", fontWeight: "bold" }}>
            <Logout fontSize="small" sx={{ marginRight: 1 }} /> Logout
          </MenuItem>
        )}

        {user?.displayName === "Guest" && (
          <MenuItem onClick={handleLogin} sx={{ color: "#1976D2", fontWeight: "bold" }}>
            <Login fontSize="small" sx={{ marginRight: 1 }} /> Sign In
          </MenuItem>
        )}
      </Menu>
    </Box>
  );
}

export default Header;
