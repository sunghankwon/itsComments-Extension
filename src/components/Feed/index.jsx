import useUserStore from "../../store/userProfile";
import FeedComment from "../FeedComment";

function Feed() {
  const { userData, setUserData } = useUserStore();

  chrome.storage.local.get(["userDataUpdate"], (result) => {
    const userDataUpdate = result.userDataUpdate;
    setUserData(userDataUpdate);
  });

  return (
    <div className="flex flex-col items-center overflow-auto w- bg-gradient-to-b from-gray-700 via-gray-600 to-gray-500">
      <div className="w-[310px] mt-8 border border-[#38d431] rounded-md shadow-2xl flex flex-col items-center">
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
