import { useEffect } from "react";
import { auth } from "../utils/firebase";
import axios from "axios";

import Login from "./Login";
import Header from "./Header/Header";
import Feed from "./Feed";

import useUserStore from "../store/userProfile";
import useTokenStore from "../store/useToken";

function App() {
  const { userData, setUserData } = useUserStore();
  const { setAuthToken } = useTokenStore();

  useEffect(() => {
    const unSubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        const authToken = await firebaseUser.getIdToken(true);
        const res = await axios.post(
          import.meta.env.VITE_SERVER_URL,
          { user: firebaseUser },
          { withCredentials: true },
        );

        setAuthToken(authToken);
        setUserData(res.data.user);
      } else {
        setUserData(null);
      }
    });

    return () => {
      unSubscribe();
    };
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
  );
}

export default App;
