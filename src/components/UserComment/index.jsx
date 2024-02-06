function UserComment({ user }) {
  return (
    <div className="mt-6 shadow-lg shadow-red-500 md:shadow-xl">
      <img
        src={user.icon}
        className="h-16 w-16 object-cover rounded-full p-[3px] border-gray-300 hover:bg-slate-200"
      />
      <p>{user.nickname}</p>
      <p>{user.comment}</p>
      <p>{user.privacy === "public" ? "공개" : "비공개"}</p>
      <a href={user.imgUrl} target="_black" rel="noopener noreferrer">
        <button className="bg-violet-200 hover:bg-violet-400 active:bg-violet-700 focus:outline-none focus:ring focus:ring-violet-300 rounded-full">
          URL 링크
        </button>
      </a>
    </div>
  );
}

export default UserComment;
