import { useState } from "react";

function ProfileModal({ onClose, onFileChange }) {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handleUpload = () => {
    if (selectedFile) {
      onFileChange(selectedFile);
    } else {
      console.error("No file selected.");
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
            accept="image/png, image/jpeg"
            onChange={handleFileChange}
            className="block w-full text-sm text-slate-500
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
