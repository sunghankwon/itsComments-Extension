import axios from "axios";
import { auth, GoogleAuthProvider } from "../../utils/firebase";

function Login({ googleLoginSuccess }) {
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
      const result = await auth.signInWithCredential(credential);

      if (result) {
        await axios.post(
          "http://localhost:3000/login",
          { user: result.user },
          { withCredentials: true },
        );

        googleLoginSuccess(result.user);
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
