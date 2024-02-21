import { useEffect } from "react";

import useUserStore from "../../store/userProfile";
import FeedComment from "../FeedComment";

function Feed() {
  const { userData, setUserData } = useUserStore();

  useEffect(() => {
    const eventSource = new EventSource(
      `${import.meta.env.VITE_SERVER_BACKEND}/comments/comments-stream/${userData._id}`,
    );

    eventSource.addEventListener("message", (event) => {
      const userDataUpdate = JSON.parse(event.data);
      setUserData(userDataUpdate);

      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];
        const tabId = activeTab.id;

        chrome.runtime.sendMessage({
          action: "taggedUserAlarm",
          tabId,
          userDataUpdate,
        });
      });
    });

    eventSource.onerror = () => {
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [setUserData]);

  return (
    <div className="overflow-auto">
      <div className="m-24 shadow-2xl backdrop-brightness-125">
        {userData.feedComments
          .slice()
          .reverse()
          .map((comment) => {
            return <FeedComment key={comment.id} comment={comment} />;
          })}
      </div>
      <div className="flex items-center justify-center mt-8 text-gray-500">
        No comments Left
      </div>
    </div>
  );
}

export default Feed;
