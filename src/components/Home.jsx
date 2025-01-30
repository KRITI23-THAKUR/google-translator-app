import React, { useEffect, useState } from "react";
import Header from "./Header";
import { auth } from "../config/firebaseconfig";

function Home() {
  const [user, setUser] = useState({});
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        setUser({
          photoURL: "",
          displayName: "Guest",
          email: "",
        });
      }
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  return (
    <div>
      <Header user={user} />
    </div>
  );
}

export default Home;
