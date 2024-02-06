<<<<<<< HEAD
import { useEffect } from "react";
import { auth } from "../utils/firebase";
import axios from "axios";

import Login from "./Login";
import Header from "./Header/Header";
import Feed from "./Feed";

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
=======
import { useEffect, useState } from "react";
import Main from "./Main";
import Login from "./Login";
import { auth } from "../utils/firebase";

function App() {
  const initialAuthState =
    localStorage.getItem("authenticated") === "true" ? {} : null;

  const [userData, setUserData] = useState(initialAuthState);

  useEffect(() => {
    const unSubscribe = auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        localStorage.setItem("authenticated", "true");
        setUserData(firebaseUser);
>>>>>>> main
      } else {
        localStorage.setItem("authenticated", "false");
        setUserData(null);
      }
    });

    return () => {
      unSubscribe();
    };
<<<<<<< HEAD
  }, [setUserData]);

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
=======
  }, []);

  return (
    <div className="w-80 h-96 border-2">
      {userData ? (
        <Main user={userData} />
      ) : (
        <Login googleLoginSuccess={setUserData} />
      )}
    </div>
>>>>>>> main
  );
}

export default App;
