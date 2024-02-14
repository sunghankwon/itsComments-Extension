function FeedComment({ comment }) {
  const openCommentTab = () => {
    chrome.runtime.sendMessage({
      action: "openCommentTab",
      commentId: comment._id,
    });
  };

  return (
    <div className="mt-6 shadow-lg shadow-red-500 md:shadow-xl">
      <img
        src={comment.creator.icon}
        className="h-12 w-12 object-cover rounded-full p-[3px] border-gray-300 hover:bg-slate-200"
      />
      <p>{comment.creator.nickname}</p>
      <p>{comment.text}</p>
      <img onClick={openCommentTab} src={comment.screenshot} />
      <p>{comment.privacy === "public" ? "공개" : "비공개"}</p>
      <a href={comment.postUrl} target="_black" rel="noopener noreferrer">
        <button className="bg-violet-200 hover:bg-violet-400 active:bg-violet-700 focus:outline-none focus:ring focus:ring-violet-300 rounded-full">
          URL 링크
        </button>
      </a>
    </div>
  );
}

export default FeedComment;
