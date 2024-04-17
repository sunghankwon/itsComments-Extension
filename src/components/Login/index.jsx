import axios from "axios";
import { auth, GoogleAuthProvider } from "../../utils/firebase";
import NewComment from "../Header/NewComment";
import useUserStore from "../../store/userProfile";

function Login() {
  const { setUserData } = useUserStore();

  const SERVER_URL = import.meta.env.VITE_SERVER_URL;
  const CLIENT_URL = import.meta.env.VITE_CLIENT_URL;
  const NON_MEMBER = import.meta.env.VITE_NON_MEMBER_ID;

  chrome.storage.local.set({ SERVER_URL, CLIENT_URL, NON_MEMBER });

  function getAuthToken() {
    return new Promise((resolve, reject) => {
      chrome.identity.getAuthToken({ interactive: true }, function (token) {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(token);
        }
      });
    });
  }

  async function handleLogin() {
    try {
      const token = await getAuthToken();
      const credential = GoogleAuthProvider.credential(null, token);
      const userCredential = await auth.signInWithCredential(credential);

      if (userCredential) {
        const res = await axios.post(
          `${import.meta.env.VITE_SERVER_URL}/login`,
          { user: userCredential.user },
          { withCredentials: true },
        );

        const user = res.data.user;

        setUserData(user);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  return (
    <div className="flex flex-col justify-center w-full">
      <div className="mt-6">
        <NewComment />
      </div>
      <div className="flex flex-col mt-[30px] items-center">
        <p className="mt-2 text-3xl text-white">Welcome to</p>
        <p className="mt-2 text-4xl text-white">Its Comments! </p>
        <button
          onClick={handleLogin}
          className="w-11/12 bg-blue-500 text-white px-4 py-2 mt-[30px] mb-[100px] rounded hover:bg-blue-700"
        >
          Login with Google
        </button>
      </div>
    </div>
  );
}

export default Login;
