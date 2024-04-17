chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "executeDisplayComment") {
    chrome.storage.local.get(
      ["userData", "newComment", "CLIENT_URL"],
      (result) => {
        const newComment = result.newComment;
        const userData = result.userData;
        const CLIENT_URL = result.CLIENT_URL;

        displayCommentModal(newComment, userData, CLIENT_URL);
      },
    );
  }
});

function displayCommentModal(commentData, userData, CLIENT_URL) {
  const shadow = document.createElement("div").attachShadow({ mode: "closed" });

  const icon = document.createElement("img");
  icon.src = `${userData.icon}`;
  icon.classList.add("icon");

  icon.style.cssText = `
  position: absolute;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.8);
  z-index: 9000;
  transition: transform 0.3s ease-in-out;
  left: ${commentData.postCoordinate.x};
  top: ${commentData.postCoordinate.y};
`;

  shadow.appendChild(icon);

  const modal = createModal(commentData, userData, CLIENT_URL);

  modal.style.cssText = `
  position: absolute;
  display: none;
  width: 300px;
  background: rgba(0, 0, 0, 0.9);
  border: 1px solid #38d431;
  border-radius: 10px;
  color: white;
  z-index: 9100;
`;

  const offsetX = 20;
  const offsetY = 20;

  const currentX = parseInt(commentData.postCoordinate.x, 10);
  const currentY = parseInt(commentData.postCoordinate.y, 10);

  modal.style.left = `${currentX + offsetX}px`;
  modal.style.top = `${currentY + offsetY}px`;

  shadow.appendChild(modal);

  let isModalHovered = false;

  icon.addEventListener("mouseenter", () => {
    modal.style.display = "block";
  });

  icon.addEventListener("mouseleave", () => {
    if (!isModalHovered) {
      modal.style.display = "none";
    }
  });

  modal.addEventListener("mouseenter", () => {
    isModalHovered = true;
  });

  modal.addEventListener("mouseleave", () => {
    isModalHovered = false;
    modal.style.display = "none";
  });

  document.body.appendChild(shadow);
}

function createModal(commentData, userData, CLIENT_URL) {
  const modal = document.createElement("div");
  modal.classList.add("modal");

  const creatorNickname = document.createElement("div");
  creatorNickname.innerText = userData.nickname;

  creatorNickname.style.cssText = `
  border-bottom: 1px solid #ccc;
  margin-left: 10px;
  color: white;
`;

  modal.appendChild(creatorNickname);

  const textContent = document.createElement("div");
  textContent.innerText = commentData.text;

  textContent.style.cssText = `
  border-bottom: 1px solid #ccc;
  margin-left: 10px;
  color: white;
`;

  modal.appendChild(textContent);

  const nextPageLink = document.createElement("a");
  nextPageLink.innerText = "댓글로 이동";
  nextPageLink.href = `${CLIENT_URL}/comments/${commentData._id}`;

  nextPageLink.style.cssText = `
  display: block;
  margin-top: 5px;
  margin-bottom: 5px;
  margin-left: 10px;
  color: #38d431;
`;

  modal.appendChild(nextPageLink);

  return modal;
}
