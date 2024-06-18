import { useState } from "react";
import useAutoLogin from "../apis/useAutoLogin";

import Login from "./Login";
import Header from "./Header/Header";
import Feed from "./Feed";

import useUserStore from "../store/userProfile";

function App() {
  const { userData, setUserData } = useUserStore();
  const [loading, setLoading] = useState(true);

  const SERVER_URL = import.meta.env.VITE_SERVER_URL;
  const CLIENT_URL = import.meta.env.VITE_CLIENT_URL;
  const NON_MEMBER = import.meta.env.VITE_NON_MEMBER_ID;

  chrome.storage.local.set({ SERVER_URL, CLIENT_URL, NON_MEMBER });

  useAutoLogin(setUserData, setLoading);

  return (
    <main
      className={`w-80 h-50 max-h-[96] bg-gradient-to-b from-gray-700 via-gray-900 to-gray-800`}
    >
      {loading ? (
        <div className="flex flex-col items-center justify-center h-full bg-gradient-to-b from-gray-700 via-gray-500 to-gray-400">
          <div className="w-32 h-32 border-t-8 border-red-300 rounded-full animate-spin border-opacity-30"></div>
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
