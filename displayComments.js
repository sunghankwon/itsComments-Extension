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
  const modal = document.createElement("div");
  modal.classList.add("modal");

  const closeButton = document.createElement("span");
  closeButton.innerText = "✖";
  closeButton.style.float = "right";
  closeButton.style.cursor = "pointer";
  closeButton.addEventListener("click", () => {
    modal.remove();
  });
  modal.appendChild(closeButton);

  const creatorNickname = document.createElement("div");
  creatorNickname.innerText = commentData.creator.nickname;
  creatorNickname.style.borderBottom = "1px solid #ccc";
  creatorNickname.style.marginLeft = "10px";
  modal.appendChild(creatorNickname);

  const textContent = document.createElement("div");
  textContent.innerText = commentData.text;
  textContent.style.borderBottom = "1px solid #ccc";
  textContent.style.marginLeft = "10px";
  textContent.style.maxHeight = "auto";
  textContent.style.overflow = "auto";
  modal.appendChild(textContent);

  const nextPageLink = document.createElement("a");
  nextPageLink.innerText = "댓글로 이동";
  nextPageLink.href = "https://www.daum.net";
  nextPageLink.style.display = "block";
  nextPageLink.style.marginTop = "10px";
  nextPageLink.style.marginLeft = "10px";
  modal.appendChild(nextPageLink);

  modal.style.position = "absolute";
  modal.style.left = `${commentData.postCoordinate.x}`;
  modal.style.top = `${commentData.postCoordinate.y}`;
  modal.style.width = "300px";
  modal.style.background = "white";
  modal.style.border = "1px solid black";
  modal.style.borderRadius = "10px";

  shadow.appendChild(modal);

  document.body.appendChild(shadow);
}
