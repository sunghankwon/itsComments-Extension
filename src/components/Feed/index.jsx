import useUserStore from "../../store/userProfile";
import FeedComment from "../FeedComment";

function Feed() {
  const { userData } = useUserStore();

  return (
    <div className="overflow-auto">
      <div className="m-24 shadow-2xl backdrop-brightness-125">
        {userData.feedComments.map((comment) => {
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
