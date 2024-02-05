import axios from "axios";
import { auth, GoogleAuthProvider } from "../../utils/firebase";
import useUserStore from "../../store/userProfile";

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
      const credential = GoogleAuthProvider.credential(null, token);
      const userCredential = await auth.signInWithCredential(credential);

      if (userCredential) {
        const res = await axios.post(
          import.meta.env.VITE_BACKEND_LOGIN,
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
    <div className="flex items-center justify-center">
      <button
        onClick={handleLogin}
        className="bg-blue-500 text-white px-4 py-2 mt-[100px] rounded hover:bg-blue-700"
      >
        Login with Google
      </button>
    </div>
  );
}

export default Login;
