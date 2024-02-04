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
    <div className="w-80 h-96 border-2">
      {userData ? (
        <Main user={userData} />
      ) : (
        <Login googleLoginSuccess={setUserData} />
      )}
    </div>
  );
}
export default App;
