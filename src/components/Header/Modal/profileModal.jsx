import { useState } from "react";
import axios from "axios";
import useUserStore from "../../../store/userProfile";

function ProfileModal({ onClose }) {
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const { userData, setUserData } = useUserStore();

  const handleFileChange = (event) => {
    const imageFile = event.target.files[0];
    setSelectedImageFile(imageFile);
  };

  const handleUpload = async () => {
    try {
      if (selectedImageFile) {
        const formData = new FormData();
        formData.append("profileIcon", selectedImageFile);
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
      } else {
        console.error("No file selected.");
      }
    } catch (error) {
      console.error("Error uploading profile:", error.message);
    }
  };

  return (
    <div className="bg-black opacity-50 fixed inset-0 flex items-center justify-center">
      <form className="flex items-center space-x-6">
        <div className="shrink-0"></div>
        <label className="block">
          <span className="sr-only">Choose profile photo</span>
          <input
            type="file"
            accept="image/png"
            onChange={handleFileChange}
            className="
              block w-full text-sm text-slate-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-violet-50 file:text-violet-700
              hover:file:bg-violet-100
            "
          />
        </label>
        <button
          onClick={handleUpload}
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          Upload
        </button>
      </form>
      <button
        onClick={onClose}
        className="px-4 py-2 bg-pink-500 text-white rounded-md"
      >
        Close
      </button>
    </div>
  );
}

export default ProfileModal;
