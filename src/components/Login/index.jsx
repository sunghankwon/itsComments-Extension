import axios from "axios";
import { auth } from "../../utils/firebase";
import NewComment from "../Header/NewComment";
import useUserStore from "../../store/userProfile";
import {
  signInWithCredential,
  GoogleAuthProvider as FirebaseGoogleAuthProvider,
} from "firebase/auth";

function Login() {
  const { setUserData } = useUserStore();

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
      const credential = FirebaseGoogleAuthProvider.credential(null, token);
      const userCredential = await signInWithCredential(auth, credential);

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
        <p className="mt-2 text-4xl text-white">Its Comments!</p>
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
