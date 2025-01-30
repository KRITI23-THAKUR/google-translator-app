import { Avatar, Button, Menu, MenuItem } from "@mui/material";
import Logout from "@mui/icons-material/Logout";
import React, { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebaseconfig";
import { Login } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

function Header({ user }) {
  const nav = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl); // this is done so that whenever an anchor element is set, it will open the menu

  const toggleMenu = (e) => {
    setAnchorEl(e.target);
  };

  const handleClose = (e) => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  const handleLogin = async () => {
    nav("/login");
  };
  console.log(user);

  return (
    <div>
      <h1>Translator</h1>
      <Button onClick={toggleMenu}>
        {user.photoURL ? (
          <Avatar alt={user.displayName} src={user.photoURL} />
        ) : (
          <Avatar />
        )}
      </Button>

      <Menu
        id="profile-options"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
      >
        <MenuItem>{user.displayName}</MenuItem>
        {user.email ? <MenuItem>{user.email}</MenuItem> : null}
        {user.email ? (
          <MenuItem onClick={handleLogout}>
            <Logout fontSize="small" />
            Logout
          </MenuItem>
        ) : null}
        {/* for guest users */}
        {user.displayName == "Guest" ? (
          <MenuItem onClick={handleLogin}>
            <Login fontSize="small" /> Sign In
          </MenuItem>
        ) : null}
      </Menu>
    </div>
  );
}

export default Header;
