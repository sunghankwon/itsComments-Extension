import { useState, useEffect } from "react";

import UserComment from "../UserComment";
import axios from "axios";

function Feed() {
  const [userComments, setUserComment] = useState([]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(import.meta.env.BACKEND_KEY, {
          withCredentials: true,
        });

        setUserComment(response.data);
      } catch (error) {
        console.error("Error fetching comments: ", error);
      }
    };
    fetchComments();
  }, []);

  return (
    <div className="m-8">
      {userComments.map((user) => {
        return <UserComment key={user.id} user={user} />;
      })}
    </div>
  );
}

export default Feed;
