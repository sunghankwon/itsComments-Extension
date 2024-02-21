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
              friends: [],
            },
      });
    });
  };

  return (
    <section className="justify-self-center">
      <button
        onClick={handleOnClick}
        className="rounded-full text-xl font-bold border p-[10px] border-gray-300 hover:bg-slate-200"
      >
        Create Comment
      </button>
    </section>
  );
}

export default NewComment;
