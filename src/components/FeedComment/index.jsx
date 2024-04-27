function FeedComment({ comment, onRemoveComment }) {
  const commentPost = parseInt(comment.postCoordinate.y, 10) - 100;
  const openCommentTab = () => {
    chrome.runtime.sendMessage({
      action: "openCommentTab",
      commentId: comment._id,
    });
  };

  const handleLinkClick = () => {
    onRemoveComment(comment._id);
  };

  const handleImageClick = () => {
    onRemoveComment(comment._id);
    openCommentTab();
  };

  return (
    <div className="w-[250px] mt-3 mb-3 border border-blue-500 rounded-md shadow-lg shadow-blue-500 md:shadow-xl">
      <div className="flex items-center mt-2">
        <img
          src={comment.creator.icon}
          className="h-8 w-8 ml-2 object-cover rounded-full p-[3px] border-gray-300 hover:bg-slate-200 flex-shrink-0"
        />
        <span className="ml-2 text-xl text-white">
          {comment.creator.nickname}
        </span>
      </div>
      <p className="ml-2 text-base text-white">{comment.text}</p>
      <img onClick={handleImageClick} src={comment.screenshot} />
      <div className="flex items-center mt-2 mb-2 ml-2">
        <span className="text-white">
          {comment.allowPublic === true ? "공개" : "비공개"}
        </span>
        <a
          href={`${comment.postUrl}?scroll=${commentPost}`}
          onClick={handleLinkClick}
          target="_black"
          rel="noopener noreferrer"
        >
          <button className="ml-4 bg-blue-200 rounded-md hover:bg-blue-400 active:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300">
            URL 링크
          </button>
        </a>
      </div>
    </div>
  );
}

export default FeedComment;
