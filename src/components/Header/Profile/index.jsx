import { useState } from "react";
import { createPortal } from "react-dom";

import ProfileModal from "../Modal/profileModal";
import useUserStore from "../../../store/userProfile";

function Profile() {
  const [isModalOpen, setModalOpen] = useState(false);
  const { userData } = useUserStore();

  function openWebPage() {
    chrome.tabs.create({ url: import.meta.env.VITE_FORNT_SERVER_URL });
  }

  return (
    <div className="text-xl font-bold border-gray-300 drop-shadow-lg flex items-center">
      <button onClick={() => setModalOpen(true)}>
        <img
          className="h-12 w-12 mt-6 ml-3 drop-shadow-lg object-cover rounded-full p-[3px] hover:bg-slate-200"
          src={userData.icon}
        />
      </button>
      <button
        className="mt-6 mr-5 text-balance text-white border-solid border p-2 rounded-md ml-auto hover:bg-gray-400"
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
