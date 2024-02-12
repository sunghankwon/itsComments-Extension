import axios from "axios";

const fetchUsersComment = async () => {
  const userComments = await axios.get(import.meta.env.VITE_SERVER_COMMENTS);

  return userComments.data;
};

export default fetchUsersComment;
