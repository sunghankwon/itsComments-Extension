const styleSheet = document.createElement("link");
styleSheet.rel = "stylesheet";
styleSheet.type = "text/css";
styleSheet.href = "styles/displayComments.css";
document.head.appendChild(styleSheet);

chrome.runtime.sendMessage({
  action: "pageUrlUpdated",
  url: window.location.href,
});

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "sendDataToDisplayComments") {
    const receivedData = message.data;

    for (const commentData of receivedData) {
      displayCommentModal(commentData);
    }
  }
});

function displayCommentModal(commentData) {
  const shadow = document.createElement("div").attachShadow({ mode: "open" });

  const icon = document.createElement("img");
  icon.src = `${commentData.creator.icon}`;
  icon.classList.add("icon");

  icon.style.left = `${commentData.postCoordinate.x}`;
  icon.style.top = `${commentData.postCoordinate.y}`;

  shadow.appendChild(icon);

  const modal = createModal(commentData);

  shadow.appendChild(modal);

  let isIconHovered = false;
  let isModalHovered = false;

  icon.addEventListener("mouseover", () => {
    isIconHovered = true;
    modal.style.display = "block";
  });

  icon.addEventListener("mouseout", () => {
    if (!isModalHovered) {
      modal.style.display = "none";
    }
  });

  modal.addEventListener("mouseover", () => {
    isModalHovered = true;
  });

  document.addEventListener("mouseout", (e) => {
    if (
      !icon.contains(e.relatedTarget) &&
      !modal.contains(e.relatedTarget) &&
      (isIconHovered || isModalHovered)
    ) {
      isIconHovered = false;
      isModalHovered = false;
      modal.style.display = "none";
    }
  });

  document.body.appendChild(shadow);
}

function createModal(commentData) {
  const modal = document.createElement("div");
  modal.classList.add("modal");

  const closeButton = document.createElement("span");
  closeButton.innerText = "✖";
  closeButton.addEventListener("click", () => {
    modal.style.display = "none";
  });
  modal.appendChild(closeButton);

  const creatorNickname = document.createElement("div");
  creatorNickname.innerText = commentData.creator.nickname;
  modal.appendChild(creatorNickname);

  const textContent = document.createElement("div");
  textContent.innerText = commentData.text;
  modal.appendChild(textContent);

  const nextPageLink = document.createElement("a");
  nextPageLink.innerText = "댓글로 이동";
  nextPageLink.href = `http://localhost:5173/comments/${commentData._id}`;
  modal.appendChild(nextPageLink);

  const offsetX = 20;
  const offsetY = 20;

  const currentX = parseInt(commentData.postCoordinate.x, 10);
  const currentY = parseInt(commentData.postCoordinate.y, 10);

  modal.style.left = `${currentX + offsetX}px`;
  modal.style.top = `${currentY + offsetY}px`;

  return modal;
}
