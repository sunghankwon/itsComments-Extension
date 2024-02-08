import { useState } from "react";
import { createPortal } from "react-dom";

import ProfileModal from "../Modal/profileModal";
import useUserStore from "../../../store/userProfile";
import useTokenStore from "../../../store/useToken";

function Profile() {
  const [isModalOpen, setModalOpen] = useState(false);
  const { userData } = useUserStore();
  const { authToken } = useTokenStore();

  function openWebPage() {
    if (authToken) {
      chrome.runtime.sendMessage({
        action: "openWebPage",
        token: authToken,
      });
    }
  }

  return (
    <div className="text-xl font-bold border-gray-300 drop-shadow-lg">
      <button onClick={() => setModalOpen(true)}>
        <img
          className="h-16 w-16 mt-6 drop-shadow-lg object-cover rounded-full p-[3px] border-gray-300 hover:bg-slate-200"
          src={userData.icon}
        />
      </button>
      <button
        className="text-balance border border-solid border-gray-500 rounded-md p-2"
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
