import useUserStore from "../../../store/userProfile";

function NewComment() {
  const { userData } = useUserStore();

  const handleOnClick = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      const tabId = activeTab.id;
      const currentUrl = activeTab.url;

      chrome.runtime.sendMessage({
        action: "addNewComment",
        tabId,
        currentUrl,
        userData: userData
          ? userData
          : {
              email: import.meta.env.VITE_NON_MEMBER_MAIL,
              icon: import.meta.env.VITE_NON_MEMBER_ICON,
              nickname: "비회원유저",
              friends: [],
            },
      });
    });
  };

  return (
    <section className="flex justify-center">
      <button
        onClick={handleOnClick}
        className="rounded-xl mt-4 w-11/12 text-xl font-bold border p-[10px] border-[#38d431] text-white hover:bg-gray-400"
      >
        Create Comment
        <br />
        <span className="text-base">Command + Shift + Y</span>
      </button>
    </section>
  );
}

export default NewComment;
