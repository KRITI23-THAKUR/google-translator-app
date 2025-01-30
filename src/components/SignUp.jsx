import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, provider } from "../config/firebaseconfig";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    await createUserWithEmailAndPassword(auth, email, password)
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
      <button onClick={handleSignUp}>Sign Up</button>
      <button onClick={handleGoogle}>Sign Up with Google</button>

      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}
