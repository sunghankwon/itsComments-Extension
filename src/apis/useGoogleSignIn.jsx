import axios from "axios";
import { auth, GoogleAuthProvider } from "../config/firebase";
import useUserStore from "../store/userProfile";

import getAuthToken from "../utils/getAuthToken";

function useGoogleSignIn() {
  const { setUserData } = useUserStore();
  async function handleSignIn() {
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

  return handleSignIn;
}

export default useGoogleSignIn;
