import { useState } from "react";
import { createPortal } from "react-dom";

import ProfileModal from "../Modal/profileModal";
import useUserStore from "../../../store/userProfile";

function Profile() {
  const [isModalOpen, setModalOpen] = useState(false);
  const { userData } = useUserStore();

  function openWebPage() {
    chrome.tabs.create({ url: import.meta.env.VITE_CLIENT_URL });
  }

  return (
    <div className="flex items-center text-xl font-bold border-gray-300 drop-shadow-lg">
      <button onClick={() => setModalOpen(true)}>
        <img
          className="h-12 w-12 mt-6 ml-3 drop-shadow-lg object-cover rounded-full p-[3px] hover:bg-slate-200"
          src={userData.icon}
        />
      </button>
      <button
        className="p-2 mt-6 ml-auto mr-5 text-white border border-solid rounded-md text-balance hover:bg-gray-400"
        onClick={openWebPage}
      >
        Open itsComment Web
      </button>
      {isModalOpen &&
        createPortal(
          <ProfileModal onClose={() => setModalOpen(false)} />,
          document.body,
        )}
    </div>
  );
}

export default Profile;
