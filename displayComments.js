const scroll = new URLSearchParams(window.location.search).get("scroll");

if (scroll) {
  window.addEventListener("load", function () {
    setTimeout(() => {
      window.scrollTo({
        top: parseInt(scroll, 10),
        behavior: "smooth",
      });
    }, 300);
  });
}

chrome.runtime.sendMessage({
  action: "pageUrlUpdated",
  url: getModifiedUrl(window.location.href),
});

(function (history) {
  const pushState = history.pushState;
  const replaceState = history.replaceState;

  history.pushState = function (state) {
    if (typeof history.onpushstate == "function") {
      history.onpushstate({ state: state });
    }
    pushState.apply(history, arguments);
    window.dispatchEvent(new Event("statechange"));
  };

  history.replaceState = function () {
    replaceState.apply(history, arguments);
    window.dispatchEvent(new Event("statechange"));
  };
})(window.history);

window.addEventListener("statechange", function () {
  chrome.runtime.sendMessage({
    action: "pageUrlUpdated",
    url: getModifiedUrl(window.location.href),
  });
});

function getModifiedUrl(currentUrl) {
  const index = currentUrl.indexOf("?scroll=");

  const modifiedUrl =
    index !== -1 ? currentUrl.substring(0, index) : currentUrl;

  return modifiedUrl;
}

chrome.runtime.onMessage.addListener(async (message) => {
  if (message.action === "sendDataToDisplayComments") {
    const receivedData = message.data;

    const CLIENT_URL = await new Promise((resolve) => {
      chrome.storage.local.get(["CLIENT_URL"], (result) => {
        resolve(result.CLIENT_URL);
      });
    });

    document.querySelectorAll(".comment-icon").forEach((host) => {
      host.remove();
    });

    document.querySelectorAll(".comment-modal").forEach((host) => {
      host.remove();
    });

    for (const commentData of receivedData) {
      displayCommentModal(commentData, CLIENT_URL);
    }
  }
});

function displayCommentModal(commentData, CLIENT_URL) {
  const shadowHost = document.createElement("div");
  const shadowRoot = shadowHost.attachShadow({ mode: "closed" });

  const icon = document.createElement("img");
  icon.classList.add("comment-icon");
  icon.src = `${commentData.creator.icon}`;
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

  shadowRoot.appendChild(icon);

  const modal = createModal(commentData, CLIENT_URL);

  shadowRoot.appendChild(modal);

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

  document.body.appendChild(shadowRoot);
}

function createModal(commentData, CLIENT_URL) {
  const modal = document.createElement("div");
  modal.classList.add("comment-modal");
  modal.style.cssText = `
  display: none;
  position: absolute;
  width: 300px;
  background: rgba(0, 0, 0, 0.9);
  border: 1px solid #3b82f6;
  border-radius: 10px;
  color: white;
  z-index: 9100;
  left: ${parseInt(commentData.postCoordinate.x, 10) + 20}px;
  top: ${parseInt(commentData.postCoordinate.y, 10) + 20}px;
`;

  const createStyle = (style) => {
    const elementStyle = document.createElement("div");
    elementStyle.style.cssText = `
    ${style};
    margin-left: 10px;
    color: white;
    `;

    return elementStyle;
  };

  const creatorNickname = createStyle("border-bottom: 1px solid #ccc;");
  creatorNickname.innerText = commentData.creator.nickname;

  const textContent = createStyle("border-bottom: 1px solid #ccc;");
  textContent.innerText = commentData.text;

  const nextPageLink = createStyle("");
  nextPageLink.innerHTML = `
    <a href="${CLIENT_URL}/comments/${commentData._id}"
      style="
      display:
      block;
      margin-top: 5px;
      margin-bottom: 5px;
      color: #3b82f6;"
    >
      댓글로 이동
    </a>
  `;

  modal.appendChild(creatorNickname);
  modal.appendChild(textContent);
  modal.appendChild(nextPageLink);

  return modal;
}
