import axios from "axios";

const fetchUsersComment = async () => {
  const userComments = await axios.get(
    import.meta.env.VITE_BACKEND_USERS_COMMENT_KEY,
  );

  return userComments.data;
};

export default fetchUsersComment;
