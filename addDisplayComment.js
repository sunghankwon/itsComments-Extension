chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "executeDisplayComment") {
    chrome.storage.local.get(["userData", "newComment"], (result) => {
      const newComment = result.newComment;
      const userData = result.userData;

      displayCommentModal(newComment, userData);
    });
  }
});

function displayCommentModal(commentData, userData) {
  const shadow = document.createElement("div").attachShadow({ mode: "open" });

  const icon = document.createElement("img");
  icon.src = `${userData.icon}`;
  icon.classList.add("icon");
  icon.style.position = "absolute";
  icon.style.width = "40px";
  icon.style.height = "40px";
  icon.style.borderRadius = "50%";
  icon.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.8)";
  icon.style.zIndex = "9000";
  icon.style.transition = "transform 0.3s ease-in-out";

  icon.style.left = `${commentData.postCoordinate.x}`;
  icon.style.top = `${commentData.postCoordinate.y}`;

  shadow.appendChild(icon);

  const modal = createModal(commentData, userData);
  modal.style.position = "absolute";
  modal.style.display = "none";
  modal.style.width = "300px";
  modal.style.background = "rgba(0, 0, 0, 0.9)";
  modal.style.border = "1px solid #38d431";
  modal.style.borderRadius = "10px";
  modal.style.color = "white";
  modal.style.zIndex = "9100";

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

function createModal(commentData, userData) {
  const modal = document.createElement("div");
  modal.classList.add("modal");

  const creatorNickname = document.createElement("div");
  creatorNickname.innerText = userData.nickname;
  creatorNickname.style.borderBottom = "1px solid #ccc";
  creatorNickname.style.marginLeft = "10px";
  creatorNickname.style.color = "white";
  modal.appendChild(creatorNickname);

  const textContent = document.createElement("div");
  textContent.innerText = commentData.text;
  textContent.style.borderBottom = "1px solid #ccc";
  textContent.style.marginLeft = "10px";
  textContent.style.color = "white";
  modal.appendChild(textContent);

  const nextPageLink = document.createElement("a");
  nextPageLink.innerText = "댓글로 이동";
  nextPageLink.href = `http://localhost:5173/comments/${commentData._id}`;
  nextPageLink.style.display = "block";
  nextPageLink.style.marginTop = "5px";
  nextPageLink.style.marginBottom = "5px";
  nextPageLink.style.marginLeft = "10px";
  nextPageLink.style.color = "#38d431";
  modal.appendChild(nextPageLink);

  return modal;
}
