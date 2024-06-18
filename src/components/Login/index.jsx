import NewComment from "../Header/NewComment";
import useGoogleSignIn from "../../apis/useGoogleSignIn";

function Login() {
  const handleLogin = useGoogleSignIn();

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
