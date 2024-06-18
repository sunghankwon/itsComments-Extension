import { useState } from "react";
import axios from "axios";
import useUserStore from "../store/userProfile";

const useProfileUpdate = (onClose) => {
  const { userData, setUserData } = useUserStore();
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [nickname, setNickname] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleUpload = async (event) => {
    event.preventDefault();
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
      onClose();
    } catch (error) {
      console.error("Error uploading profile:", error.message);
    }
  };

  return {
    setSelectedImageFile,
    nickname,
    setNickname,
    errorMessage,
    handleUpload,
  };
};

export default useProfileUpdate;
