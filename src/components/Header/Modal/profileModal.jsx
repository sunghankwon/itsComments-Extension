import useFeedStore from "../../../store/useFeed";
import handleFileChange from "../../../utils/handleFileChange";
import useProfileUpdate from "../../../apis/useProfileUpdate";

function ProfileModal({ onClose }) {
  const {
    setSelectedImageFile,
    nickname,
    setNickname,
    errorMessage,
    handleUpload,
  } = useProfileUpdate(onClose);
  const { commentsList } = useFeedStore();

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black opacity-90">
      <div className="flex flex-col items-center w-[80%] min-h-56 border rounded-md bg-white p-4">
        <form
          className={`flex flex-col items-center ${
            commentsList.length === 0 ? "space-y-3" : "space-y-6"
          }`}
        >
          <div className="shrink-0"></div>
          <p className={`${commentsList.length === 0 ? "mb-1" : "mb-2"}`}>
            프로필 변경
          </p>
          <label className="block">
            <span className="sr-only">Choose profile photo</span>
            <input
              type="file"
              accept="image/png"
              onChange={(event) =>
                handleFileChange(event, setSelectedImageFile)
              }
              className="block w-full text-sm text-slate-500 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
            />
          </label>
          <label className="block">
            <span className="text-sm text-slate-500">Change Nickname</span>
            <input
              type="text"
              value={nickname}
              onChange={(event) => setNickname(event.target.value)}
              className="px-2 py-1 mt-1 text-sm border rounded-md text-slate-500 focus:outline-none focus:ring focus:border-blue-500"
            />
          </label>
          <p
            className={`text-red-400 ${commentsList.length === 0 ? "mt-1" : "mt-2"}`}
          >
            {errorMessage}
          </p>
          <div className="flex flex-row space-x-2">
            <button
              onClick={handleUpload}
              className="px-2 py-1 text-white bg-blue-500 rounded-md"
            >
              Upload
            </button>
            <button
              onClick={onClose}
              className="px-2 py-1 text-white bg-pink-500 rounded-md"
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProfileModal;
