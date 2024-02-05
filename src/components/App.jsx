import { useEffect } from "react";
import { auth } from "../utils/firebase";
import axios from "axios";

import Login from "./Login";
import Header from "./Header/Header.jsx";
import Feed from "./Feed/index.jsx";

import useUserStore from "../store/userProfile";

function App() {
  const { userData, setUserData } = useUserStore();

  useEffect(() => {
    const unSubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        localStorage.setItem("authenticated", "true");
        const res = await axios.post(
          import.meta.env.VITE_BACKEND_LOGIN,
          { user: firebaseUser },
          { withCredentials: true },
        );
        setUserData(res.data.user);
      } else {
        localStorage.setItem("authenticated", "false");
        setUserData(null);
      }
    });

    return () => {
      unSubscribe();
    };
  }, []);

  return (
    <main className="w-80 h-80 shadow-2xl backdrop-brightness-125">
      {userData ? (
        <>
          <Header />
          <Feed />
        </>
      ) : (
        <Login />
      )}
    </main>
  );
}

export default App;
