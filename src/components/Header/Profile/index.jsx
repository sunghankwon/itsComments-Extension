import { useState } from "react";
import { createPortal } from "react-dom";

import ProfileModal from "../Modal/profileModal";
import useUserStore from "../../../store/userProfile";

function Profile() {
  const [modalOpen, isModalOpen] = useState(false);
  const { userData } = useUserStore();

  return (
    <div className="text-xl font-bold border-gray-300 drop-shadow-lg">
      <button onClick={() => isModalOpen(true)}>
        <img
          className="h-16 w-16 mt-6 drop-shadow-lg object-cover rounded-full p-[3px] border-gray-300 hover:bg-slate-200"
          src={userData.icon}
        />
      </button>
      <a href="" target="_black" rel="noopener noreferrer">
        <button className="text-balance">Open itsComment Web</button>
      </a>
      {modalOpen &&
        createPortal(
          <ProfileModal onClose={() => isModalOpen(false)} />,
          document.body,
        )}
    </div>
  );
}

export default Profile;
