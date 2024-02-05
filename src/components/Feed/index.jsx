import { useQuery } from "react-query";

import UserComment from "../UserComment";
import fetchUsersComment from "../../../fetchers/fetchUsersComment";

function Feed() {
  const { isLoading, error, data } = useQuery("comments", fetchUsersComment);

  if (isLoading) {
    return <div>Fetching Comments</div>;
  } else if (error) {
    return <div>An error occureed: {error.message}</div>;
  }

  return (
    <div className="m-8">
      {data.map((user) => {
        return <UserComment key={user.id} user={user} />;
      })}
    </div>
  );
}

export default Feed;
