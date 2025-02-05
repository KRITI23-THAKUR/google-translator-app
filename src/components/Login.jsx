import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, provider } from "../config/firebaseconfig";
import { Box, Button, InputAdornment, TextField, Typography } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    await signInWithEmailAndPassword(auth, email, password)
      .then((userCred) => {
        console.log(userCred.user);
        nav("/");
      })
      .catch((err) => console.error(err));
  };

  const handleGoogle = async (e) => {
    e.preventDefault();

    await signInWithPopup(auth, provider)
      .then((userCred) => {
        console.log(userCred.user);
        nav("/");
      })
      .catch((err) => console.error(err));
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f0f0f3",
        padding: "20px",
      }}
    >
      <Box
        sx={{
          backgroundColor: "#e0e5ec",
          borderRadius: "20px",
          padding: "30px",
          boxShadow: "10px 10px 20px rgba(0, 0, 0, 0.1), -10px -10px 20px rgba(255, 255, 255, 0.7)",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          width: "400px",
          maxWidth: "100%",
        }}
      >
        <Typography variant="h4" align="center" sx={{ fontWeight: "bold", color: "#333" }}>
          Login
        </Typography>

        {/* Email Input */}
        <TextField
          label="Email"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{
            backgroundColor: "#e0e5ec",
            borderRadius: "12px",
            padding: "10px",
            boxShadow: "4px 4px 6px rgba(0, 0, 0, 0.1), -4px -4px 6px rgba(255, 255, 255, 0.7)",
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
            },
            "& .MuiInputLabel-root": {
              color: "#333",
            },
          }}
        />

        {/* Password Input */}
        <TextField
          label="Password"
          variant="outlined"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{
            backgroundColor: "#e0e5ec",
            borderRadius: "12px",
            padding: "10px",
            boxShadow: "4px 4px 6px rgba(0, 0, 0, 0.1), -4px -4px 6px rgba(255, 255, 255, 0.7)",
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
            },
            "& .MuiInputLabel-root": {
              color: "#333",
            },
          }}
        />

        {/* Sign In Button */}
        <Button
          onClick={handleLogin}
          variant="contained"
          sx={{
            backgroundColor: "#6c63ff",
            color: "#fff",
            borderRadius: "12px",
            boxShadow: "4px 4px 6px rgba(0, 0, 0, 0.1), -4px -4px 6px rgba(255, 255, 255, 0.7)",
            "&:hover": {
              backgroundColor: "#5a53e0",
            },
          }}
        >
          Sign In
        </Button>

        {/* Sign In with Google */}
        <Button
          onClick={handleGoogle}
          variant="outlined"
          sx={{
            borderRadius: "12px",
            boxShadow: "4px 4px 6px rgba(0, 0, 0, 0.1), -4px -4px 6px rgba(255, 255, 255, 0.7)",
            color: "#333",
            borderColor: "#e0e5ec",
            "&:hover": {
              borderColor: "#d0d5e0",
              backgroundColor: "#f0f4fc",
            },
          }}
          startIcon={<GoogleIcon />}
        >
          Sign In with Google
        </Button>

        {/* Sign Up Redirect */}
        <Typography align="center">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </Typography>
      </Box>
    </Box>
  );
}

export default Login;
