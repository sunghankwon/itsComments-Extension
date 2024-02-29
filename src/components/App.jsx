import { useEffect, useState } from "react";
import { auth } from "../utils/firebase";
import axios from "axios";

import Login from "./Login";
import Header from "./Header/Header";
import Feed from "./Feed";

import useUserStore from "../store/userProfile";

function App() {
  const { userData, setUserData } = useUserStore();
  const [loading, setLoading] = useState(true);

  const SERVER_URL = import.meta.env.VITE_SERVER_URL;
  const FORNT_SERVER_URL = import.meta.env.VITE_FORNT_SERVER_URL;
  const NON_MEMBER = import.meta.env.VITE_NON_MEMBER;

  chrome.storage.local.set({ SERVER_URL, FORNT_SERVER_URL, NON_MEMBER });

  useEffect(() => {
    const unSubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const authToken = await user.getIdToken(true);
          const res = await axios.post(
            `${import.meta.env.VITE_SERVER_URL}/login`,
            { user },
            { withCredentials: true },
          );

          setUserData(res.data.user);

          chrome.runtime.sendMessage({
            action: "updateLoginUser",
            user: res.data.user._id,
            token: authToken,
          });
        } catch (error) {
          console.log("Login error:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setUserData(null);
        setLoading(false);
      }
    });

    return () => {
      unSubscribe();
    };
  }, []);

  return (
    <main className="w-80 h-96 bg-gradient-to-b from-gray-700 via-gray-900 to-gray-800">
      {loading ? (
        <div className="flex flex-col items-center justify-center h-full bg-gradient-to-b from-gray-700 via-gray-500 to-gray-400">
          <div className="animate-spin rounded-full border-t-8 border-red-300 border-opacity-30 h-32 w-32"></div>
          <div>Loading...</div>
        </div>
      ) : userData ? (
        <div className="bg-gradient-to-b from-gray-700 via-gray-900 to-gray-800">
          <Header />
          <Feed />
        </div>
      ) : (
        <Login />
      )}
    </main>
  );
}

export default App;
