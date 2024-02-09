function NewComment() {
  const handleOnClick = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      const tabId = activeTab.id;

      chrome.runtime.sendMessage({
        action: "addNumComment",
        tabId,
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
