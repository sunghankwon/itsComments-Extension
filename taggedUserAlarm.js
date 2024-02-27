chrome.storage.local.get(["userDataUpdate"], (result) => {
  const userDataUpdate = result.userDataUpdate;
  const receivedComments = result.userDataUpdate.receivedComments;
  const icon = userDataUpdate.icon;
  const userId = userDataUpdate._id.toString();

  alarmModal(icon, receivedComments, userId, userDataUpdate);
});

function alarmModal(icon, receivedComments, userId, userDataUpdate) {
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
  closeButton.addEventListener("click", () => {
    shadowRoot.removeChild(modalContainer);
  });

  const userIconContainer = document.createElement("div");
  userIconContainer.style.cssText = `
    display: flex;
    align-items: center;
  `;

  const userIcon = document.createElement("img");
  userIcon.src = icon;
  userIcon.style.cssText = `
    height: 20px;
    width: 20px;
    object-fit: cover;
    border-radius: 50%;
    padding: 3px;
    border: 1px solid #D1D5DB;
  `;
  modalContainer.appendChild(userIcon);

  const toggleComment = document.createElement("button");

  toggleComment.innerText = "댓글열기";
  toggleComment.addEventListener("click", () => {
    const userComments = modalContainer.querySelectorAll(".userComment");
    userComments.forEach((comment) => {
      comment.style.display =
        comment.style.display === "none" ? "flex" : "none";
    });
  });

  const COMMENT_COUNT = receivedComments.length;
  const commentCount = document.createElement("div");
  commentCount.innerText = COMMENT_COUNT;
  commentCount.style.marginLeft = "5px";

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
      margin-bottom: 10px;
      border: 1px solid #D1D5DB;
    `;

    const creatorIcon = document.createElement("img");
    creatorIcon.src = comment.creator.icon;
    creatorIcon.style.cssText = `
      height: 20px;
      width: 20px;
      object-fit: cover;
      border-radius: 50%;
      padding: 3px;
      border: 1px solid #D1D5DB;
    `;

    const creatorNickname = document.createElement("div");
    creatorNickname.innerText = comment.creator.nickname;

    const textContent = document.createElement("div");
    textContent.innerText = comment.text;

    const screenShot = document.createElement("img");
    screenShot.src = comment.screenshot;
    screenShot.style.cssText = `
      max-width: 100px;
      max-height: 100px;
      object-fit: cover;
      padding: 3px;
      border: 1px solid #D1D5DB;
    `;

    const nextPageLink = document.createElement("a");
    nextPageLink.innerText = "댓글로 이동";
    nextPageLink.href = `http://localhost:5173/comments/${comment._id}`;

    nextPageLink.addEventListener("click", async () => {
      const response = await fetch(
        `http://itscomments.ap-northeast-2.elasticbeanstalk.com/comments/${comment._id}?userId=${userId}&action=removeReceviedComment`,
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

    userComment.appendChild(creatorIcon);
    userComment.appendChild(creatorNickname);
    userComment.appendChild(textContent);
    userComment.appendChild(screenShot);
    userComment.appendChild(nextPageLink);

    userComment.style.display = "none";

    modalContainer.appendChild(userComment);
  });

  shadowRoot.appendChild(modalContainer);

  document.body.appendChild(shadowHost);
}
