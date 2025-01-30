import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, provider } from "../config/firebaseconfig";

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

  // uiconfig = {
  //   signInOptions: [
  //     firebaseui.auth.GoogleAuthProvider.PROVIDER_ID,
  //     firebaseui.auth.EmailAuthProvider.PROVIDER_ID,
  //   ],
  // };
  return (
    <div>
      <input
        type="email"
        placeholder="Enter email..."
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Enter password..."
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Sign In</button>
      <button onClick={handleGoogle}>Sign In with Google</button>
      <p>
        Don't have an account? <Link to="/signup">Sign Up</Link>
      </p>
    </div>
  );
}

export default Login;
