import { useState, useEffect } from "react";

function Toggle() {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    chrome.storage.local.get(["isActive"], (result) => {
      if (result.isActive !== undefined) {
        setIsActive(result.isActive);
      }
    });
  }, []);

  function activeComments() {
    const newActiveState = !isActive;
    setIsActive(newActiveState);

    chrome.storage.local.set({ isActive: newActiveState });

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.reload(tabs[0].id);
      }
    });
  }

  return (
    <div className="flex items-center mt-6 ml-3">
      <span className="ml-3 text-lg font-bold text-white">
        {isActive ? "Comments Enabled" : "Comments Disabled"}
      </span>
      <button
        onClick={() => activeComments()}
        className={`${
          isActive ? "bg-green-500" : "bg-gray-300"
        } flex items-center rounded-full ml-6 h-[30px] w-[64px]`}
      >
        <div
          className={`transition duration-300 ease-in-out bg-white rounded-full h-[26px] w-[28px] ml-[2px] ${
            isActive ? "" : "translate-x-[30px]"
          }`}
        />
      </button>
    </div>
  );
}

export default Toggle;
