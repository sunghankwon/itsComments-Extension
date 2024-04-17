import { useEffect } from "react";
import useFeedStore from "../../store/useFeed";
import useUserStore from "../../store/userProfile";
import FeedComment from "../FeedComment";

import axios from "axios";

function Feed() {
  const { commentsList, setCommentsList } = useFeedStore();
  const { userData } = useUserStore();

  async function removeComment(commentId) {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_SERVER_URL}/comments/${commentId}`,
        {
          params: { userId: userData._id, action: "removeReceviedComment" },
        },
      );

      const userDataUpdate = response.data.removeCommentUser;

      if (response.status === 200) {
        const updatedCommentsList = commentsList.filter(
          (comment) => comment.id !== commentId,
        );

        await chrome.storage.local.set({ userDataUpdate });

        setCommentsList(updatedCommentsList);
      } else {
        console.error("Failed to delete comment. Server response:", response);
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  }

  useEffect(() => {
    const feedComments = userData.feedComments;

    setCommentsList(feedComments);
  }, []);

  useEffect(() => {
    chrome.runtime.onMessage.addListener((message) => {
      if (message.action === "userUpdate") {
        const userDataUpdate = message.userDataUpdate;

        setCommentsList(userDataUpdate.feedComments);
      }
    });
  }, [setCommentsList]);

  return (
    <div className="flex flex-col items-center">
      <div className="w-[310px] mt-3 rounded-md shadow-2xl flex flex-col items-center">
        {commentsList && commentsList.length > 0 ? (
          commentsList
            .slice()
            .reverse()
            .map((comment) => {
              return (
                <FeedComment
                  key={comment.id}
                  comment={comment}
                  onRemoveComment={() => removeComment(comment._id)}
                />
              );
            })
        ) : (
          <div className="flex items-center justify-center mt-4 mb-4 text-white">
            No comments Left
          </div>
        )}
      </div>
    </div>
  );
}

export default Feed;
