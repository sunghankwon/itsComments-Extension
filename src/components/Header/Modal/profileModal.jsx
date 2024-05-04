import { useState } from "react";
import axios from "axios";
import useUserStore from "../../../store/userProfile";
import useFeedStore from "../../../store/useFeed";

function ProfileModal({ onClose }) {
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [nickname, setNickname] = useState("");
  const { userData, setUserData } = useUserStore();
  const { commentsList } = useFeedStore();
  const [errorMessage, setErrorMessage] = useState("");

  const handleFileChange = (event) => {
    const imageFile = event.target.files[0];
    setSelectedImageFile(imageFile);
  };

  const handleUpload = async () => {
    try {
      if (!selectedImageFile && !nickname.trim()) {
        setErrorMessage("변경하려는 아이콘 이미지나 닉네임을 입력해주세요");
        return;
      }

      if (
        nickname.trim() &&
        (nickname.trim().length < 2 || nickname.trim().length > 20)
      ) {
        setErrorMessage("닉네임은 2글자 초과 20자 미만으로 입력해주세요.");
        return;
      }

      const formData = new FormData();
      formData.append("profileIcon", selectedImageFile);
      formData.append("nickname", nickname);
      formData.append("userId", userData._id);

      const response = await axios.patch(
        `${import.meta.env.VITE_SERVER_URL}/profile`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      setUserData(response.data.user);
    } catch (error) {
      console.error("Error uploading profile:", error.message);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black opacity-90">
      <div className="flex flex-col items-center w-[80%] min-h-56 border rounded-md bg-white p-4">
        <form
          className={`flex flex-col items-center ${
            commentsList.length === 0 ? "space-y-3" : "space-y-6"
          }`}
        >
          <div className="shrink-0"></div>
          <p className={`${commentsList.length === 0 ? "mb-1" : "mb-2"}`}>
            프로필 변경
          </p>
          <label className="block">
            <span className="sr-only">Choose profile photo</span>
            <input
              type="file"
              accept="image/png"
              onChange={handleFileChange}
              className="block w-full text-sm text-slate-500 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
            />
          </label>
          <label className="block">
            <span className="text-sm text-slate-500">Change Nickname</span>
            <input
              type="text"
              value={nickname}
              onChange={(event) => setNickname(event.target.value)}
              className="px-2 py-1 mt-1 text-sm border rounded-md text-slate-500 focus:outline-none focus:ring focus:border-blue-500"
            />
          </label>
          <p
            className={`text-red-400 ${commentsList.length === 0 ? "mt-1" : "mt-2"}`}
          >
            {errorMessage}
          </p>
          <div className="flex flex-row space-x-2">
            <button
              onClick={handleUpload}
              className="px-2 py-1 text-white bg-blue-500 rounded-md"
            >
              Upload
            </button>
            <button
              onClick={onClose}
              className="px-2 py-1 text-white bg-pink-500 rounded-md"
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProfileModal;
