import axios from "axios";
import useUserStore from "../store/userProfile";
import useFeedStore from "../store/useFeed";

function useRemoveFeed() {
  const { userData } = useUserStore();
  const { commentsList, setCommentsList } = useFeedStore();

  const removeComment = async (commentId) => {
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
  };

  return removeComment;
}

export default useRemoveFeed;
