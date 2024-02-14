import { useEffect } from "react";
import { auth } from "../utils/firebase";
import axios from "axios";

import Login from "./Login";
import Header from "./Header/Header";
import Feed from "./Feed";

import useUserStore from "../store/userProfile";
import useAuthTokenStore from "../store/useToken";

function App() {
  const { userData, setUserData } = useUserStore();
  const { setAuthToken } = useAuthTokenStore();

  useEffect(() => {
    const unSubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const authToken = await user.getIdToken(true);
          const res = await axios.post(
            import.meta.env.VITE_SERVER_URL,
            { user },
            { withCredentials: true },
          );

          setAuthToken(authToken);
          setUserData(res.data.user);

          chrome.runtime.sendMessage({
            action: "updateLoginUser",
            user: res.data.user._id,
            token: authToken,
          });
        } catch (error) {
          console.log("Login error:", error);
        }
      } else {
        setUserData(null);
      }
    });

    return () => {
      unSubscribe();
    };
  }, [setUserData]);

  return (
    <main className="w-96 h-96">
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
