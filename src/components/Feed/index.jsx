import { useEffect } from "react";
import useFeedStore from "../../store/useFeed";
import useUserStore from "../../store/userProfile";
import FeedComment from "../FeedComment";
import useRemoveFeed from "../../apis/useRemoveFeed";

function Feed() {
  const { commentsList, setCommentsList } = useFeedStore();
  const { userData } = useUserStore();
  const removeComment = useRemoveFeed();

  useEffect(() => {
    const feedComments = userData.feedComments;

    setCommentsList(feedComments);
  }, [userData, setCommentsList]);

  useEffect(() => {
    const messageListener = (message) => {
      if (message.action === "userUpdate") {
        const userDataUpdate = message.userDataUpdate;

        setCommentsList(userDataUpdate.feedComments);
      }
    };

    chrome.runtime.onMessage.addListener(messageListener);

    return () => {
      chrome.runtime.onMessage.removeListener(messageListener);
    };
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
