import { useEffect } from "react";
import { auth } from "../config/firebase";
import axios from "axios";

function useAutoLogin(setUserData, setLoading) {
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
            user: res.data.user,
            token: authToken,
          });

          chrome.storage.local.set({ userData: res.data.user });
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
}

export default useAutoLogin;
