chrome.storage.local.get(
  ["userDataUpdate", "SERVER_URL", "CLIENT_URL"],
  async (result) => {
    const userDataUpdate = result.userDataUpdate;
    const receivedComments = result.userDataUpdate.receivedComments;
    const icon = userDataUpdate.icon;
    const userId = userDataUpdate._id.toString();

    const SERVER_URL = result.SERVER_URL;
    const CLIENT_URL = result.CLIENT_URL;

    alarmModal(
      icon,
      receivedComments,
      userId,
      userDataUpdate,
      SERVER_URL,
      CLIENT_URL,
    );
  },
);

function alarmModal(
  icon,
  receivedComments,
  userId,
  userDataUpdate,
  SERVER_URL,
  CLIENT_URL,
) {
  const shadowHost = document.createElement("div");
  shadowHost.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: flex-start;
  `;

  const shadowRoot = shadowHost.attachShadow({ mode: "closed" });

  const modalContainer = document.createElement("div");
  modalContainer.style.cssText = `
    position: fixed;
    top: 70px;
    right: 30px;
    background-color: rgba(173, 216, 230, 0.7);
    padding: 20px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    max-height: 70vh;
    overflow-y: auto;
  `;

  const closeButton = document.createElement("button");
  closeButton.textContent = "Close";
  closeButton.style.cssText = `
    background-color: #3498db;
    color: #fff;
    border: none;
    padding: 8px 15px;
    border-radius: 5px;
    cursor: pointer;
    margin-left: 60px;
    transition: background-color 0.3s;
  `;
  closeButton.addEventListener("click", () => {
    shadowRoot.removeChild(modalContainer);
  });

  closeButton.addEventListener("mouseenter", () => {
    closeButton.style.backgroundColor = "#2980b9";
  });

  closeButton.addEventListener("mouseleave", () => {
    closeButton.style.backgroundColor = "#3498db";
  });

  const userIconContainer = document.createElement("div");
  userIconContainer.style.cssText = `
    display: flex;
    align-items: center;
  `;

  const userIcon = document.createElement("img");
  userIcon.src = icon;
  userIcon.style.cssText = `
    height: 23px;
    width: 23px;
    object-fit: cover;
    border-radius: 50%;
    padding: 3px;
  `;
  modalContainer.appendChild(userIcon);

  const toggleComment = document.createElement("button");

  toggleComment.innerText = "댓글열기";
  toggleComment.style.cssText = `
    background-color: #27ae60;
    color: #fff;
    border: none;
    padding: 8px 15px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
  `;
  toggleComment.addEventListener("click", () => {
    const userComments = modalContainer.querySelectorAll(".userComment");
    userComments.forEach((comment) => {
      comment.style.display =
        comment.style.display === "none" ? "flex" : "none";
    });
  });

  toggleComment.addEventListener("mouseenter", () => {
    toggleComment.style.backgroundColor = "#218e53";
  });

  toggleComment.addEventListener("mouseleave", () => {
    toggleComment.style.backgroundColor = "#27ae60";
  });

  const COMMENT_COUNT = receivedComments.length;
  const commentCount = document.createElement("div");
  commentCount.innerText = COMMENT_COUNT;
  commentCount.style.cssText = `
    margin-left: 5px;
    font-weight: bold;
    color: #333;
  `;

  userIconContainer.appendChild(userIcon);
  userIconContainer.appendChild(commentCount);

  modalContainer.appendChild(userIconContainer);
  modalContainer.appendChild(toggleComment);
  modalContainer.appendChild(closeButton);

  [...receivedComments].reverse().forEach((comment) => {
    const userComment = document.createElement("div");
    userComment.className = "userComment";
    userComment.style.cssText = `
      display: flex;
      flex-direction: column;
      margin-top: 10px;
      margin-bottom: 10px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.8);
    `;

    const creatorIcon = document.createElement("img");
    creatorIcon.src = comment.creator.icon;
    creatorIcon.style.cssText = `
      height: 23px;
      width: 23px;
      object-fit: cover;
      border-radius: 50%;
      padding: 3px;
    `;

    const creatorInfoContainer = document.createElement("div");
    creatorInfoContainer.style.cssText = `
      display: flex;
      flex-direction: column;
      margin-left: 8px;
    `;

    const creatorNickname = document.createElement("div");
    creatorNickname.innerText = comment.creator.nickname;
    creatorNickname.style.cssText = `
      font-weight: bold;
      color: #333;
    `;

    creatorInfoContainer.appendChild(creatorIcon);
    creatorInfoContainer.appendChild(creatorNickname);

    const textContent = document.createElement("div");
    textContent.innerText = comment.text;
    textContent.style.cssText = `
      color: #ffffff;
      margin-left: 8px;
    `;

    const screenShot = document.createElement("img");
    screenShot.src = comment.screenshot;
    screenShot.style.cssText = `
      max-width: 200px;
      max-height: 200px;
      object-fit: cover;
      padding: 3px;
    `;

    const nextPageLink = document.createElement("a");
    nextPageLink.innerText = "댓글로 이동";
    nextPageLink.href = `${CLIENT_URL}/comments/${comment._id}`;
    nextPageLink.style.cssText = `
      color: #5f5f5f;
      text-decoration: none;
      cursor: pointer;
      margin-top: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
    `;

    nextPageLink.addEventListener("click", async () => {
      const response = await fetch(
        `${SERVER_URL}/comments/${comment._id}?userId=${userId}&action=removeReceviedComment`,
        {
          method: "DELETE",
        },
      );

      if (response.ok) {
        modalContainer.removeChild(userComment);

        const indexToRemove = receivedComments.findIndex(
          (receivedComment) => receivedComment._id === comment._id,
        );

        if (indexToRemove !== -1) {
          userDataUpdate.receivedComments.splice(indexToRemove, 1);

          commentCount.innerText = userDataUpdate.receivedComments.length;

          await chrome.storage.local.set({ userDataUpdate });
        }
      } else {
        console.error("some problem with Fetch in popAlarm");
      }
    });

    userComment.appendChild(creatorInfoContainer);
    userComment.appendChild(textContent);
    userComment.appendChild(screenShot);
    userComment.appendChild(nextPageLink);

    userComment.style.display = "none";

    modalContainer.appendChild(userComment);
  });

  shadowRoot.appendChild(modalContainer);

  document.body.appendChild(shadowHost);
}
