function FeedComment({ comment }) {
  const openCommentTab = () => {
    chrome.runtime.sendMessage({
      action: "openCommentTab",
      commentId: comment._id,
    });
  };

  return (
    <div className="w-[250px] mt-6 mb-6 border border-[#38d431] rounded-md shadow-lg shadow-green-500 md:shadow-xl">
      <div className="flex mt-2 items-center">
        <img
          src={comment.creator.icon}
          className="h-8 w-8 ml-2 object-cover rounded-full p-[3px] border-gray-300 hover:bg-slate-200 flex-shrink-0"
        />
        <span className="text-xl text-white ml-2">
          {comment.creator.nickname}
        </span>
      </div>
      <p className="ml-2 text-base text-white">{comment.text}</p>
      <img onClick={openCommentTab} src={comment.screenshot} />
      <div className="flex ml-2 mt-2 mb-2 items-center">
        <span className="text-white">
          {comment.privacy === "public" ? "공개" : "비공개"}
        </span>
        <a href={comment.postUrl} target="_black" rel="noopener noreferrer">
          <button className="ml-4 bg-green-200 hover:bg-green-400 active:bg-green-700 focus:outline-none focus:ring focus:ring-green-300 rounded-md">
            URL 링크
          </button>
        </a>
      </div>
    </div>
  );
}

export default FeedComment;
