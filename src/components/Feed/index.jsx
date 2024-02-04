import { useState, useEffect } from "react";

import UserComment from "../UserComment";
import axios from "axios";

const REACT_APP_BACKEND_URI = process.env.SOME_KEY;

function Feed() {
  const [userComments, setUserComment] = useState([]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(REACT_APP_BACKEND_URI, {
          withCredentials: true,
        });

        setUserComment(response.data);
      } catch (err) {
        console.err("Error fetching comments: ", err);
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
