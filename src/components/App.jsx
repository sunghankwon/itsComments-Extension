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
  }, [setUserData]);

  return (
    <main className="w-80 h-96 bg-gradient-to-b from-black via-gray-700 to-gray-500">
      {loading ? (
        <div className="flex flex-col items-center justify-center h-full">
          <div>Loading...</div>
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('https://dz9x2uv87bh4n.cloudfront.net/loading1.svg')`,
            }}
          />
        </div>
      ) : userData ? (
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
