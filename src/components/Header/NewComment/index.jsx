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
        className="w-11/12 mt-4 text-xl font-bold text-white bg-gray-800 rounded-xl hover:bg-gray-400"
      >
        Create Comment
        <br />
        <span className="text-base">Command + Shift + Y</span>
      </button>
    </section>
  );
}

export default NewComment;
