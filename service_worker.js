chrome.runtime.onMessage.addListener((message) => {
  switch (message.action) {
    case "addNewComment":
      handleAddNewComment(message);
      break;
    case "submitForm":
      handleSubmitForm(message);
      break;
    case "pageUrlUpdated":
      handlePageUrlUpdated(message);
      break;
    case "updateLoginUser":
      handleUpdateLoginUser(message);
      break;
    case "openCommentTab":
      handleOpenCommentTab(message);
      break;
  }
});

popAlarm();

async function handleUpdateLoginUser(message) {
  const loginUser = message.user;

  const CLIENT_URL = await new Promise((resolve) => {
    chrome.storage.local.get(["CLIENT_URL"], (result) => {
      resolve(result.CLIENT_URL);
    });
  });

  chrome.cookies.set({
    url: `${CLIENT_URL}`,
    name: "authToken",
    value: message.token,
    expirationDate: Math.floor(Date.now() / 1000 + 60 * 60),
    secure: false,
    httpOnly: false,
  });

  await chrome.storage.local.set({ loginUser });
}

async function handleAddNewComment(message) {
  const currentUrl = message.currentUrl;
  const userData = message.userData;

  await chrome.storage.local.set({
    currentUrl,
    userData,
  });

  chrome.scripting.executeScript({
    target: { tabId: message.tabId },
    files: ["addNewComment.js"],
  });
}

async function handleSubmitForm(message) {
  try {
    const imageDataUrl = await new Promise((resolve) => {
      chrome.tabs.captureVisibleTab(
        { format: "png", quality: 90 },
        (imageUrl) => {
          resolve(imageUrl);
        },
      );
    });

    const imageResponse = await fetch(imageDataUrl);
    const imageBlob = await imageResponse.blob();
    const screenshot = new File([imageBlob], "screenshot.png", {
      type: "image/png",
    });

    const { currentUrl, userData } = await new Promise((resolve) => {
      chrome.storage.local.get(["currentUrl", "userData"], (result) => {
        resolve(result);
      });
    });

    const SERVER_URL = await new Promise((resolve) => {
      chrome.storage.local.get(["SERVER_URL"], (result) => {
        resolve(result.SERVER_URL);
      });
    });

    const modifiedUrl = getModifiedUrl(currentUrl);

    const formData = new FormData();
    formData.append("userData", userData.email);
    formData.append("text", message.data.inputValue);
    formData.append("postDate", message.data.nowDate);
    formData.append("postUrl", modifiedUrl);
    formData.append(
      "postCoordinate",
      JSON.stringify(message.data.postCoordinate),
    );
    formData.append("allowPublic", message.data.allowPublic);
    formData.append("publicUsers", JSON.stringify(message.data.publicUsers));
    formData.append("recipientEmail", message.data.recipientEmail);
    formData.append("screenshot", screenshot);

    const response = await fetch(`${SERVER_URL}/comments/new`, {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const responseData = await response.json();
      const newComment = responseData.newComment;

      await chrome.storage.local.set({
        newComment,
        userData,
      });

      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const activeTab = tabs[0];
        const tabId = activeTab.id;

        chrome.scripting.executeScript(
          {
            target: { tabId },
            files: ["addDisplayComment.js"],
          },
          () => {
            chrome.tabs.sendMessage(tabId, { action: "executeDisplayComment" });
          },
        );
      });
    } else {
      console.error("some problem with Fetch");
    }
  } catch (error) {
    console.error("An error:", error);
  }
}

async function sendUserDataToServer(userId, pageUrl) {
  try {
    const SERVER_URL = await new Promise((resolve) => {
      chrome.storage.local.get(["SERVER_URL"], (result) => {
        resolve(result.SERVER_URL);
      });
    });

    const serverEndpoint = `${SERVER_URL}/location?userId=${encodeURIComponent(userId)}&pageUrl=${encodeURIComponent(pageUrl)}`;

    const response = await fetch(serverEndpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error(
      "Error occurred during data transmission to the server:",
      error,
    );
  }
}

async function handlePageUrlUpdated(message) {
  try {
    const pageUrl = message.url;

    const { NON_MEMBER, loginUser } = await new Promise((resolve) => {
      chrome.storage.local.get(["NON_MEMBER", "loginUser"], (result) => {
        resolve(result);
      });
    });

    const userId = loginUser || NON_MEMBER;

    const responseData = await sendUserDataToServer(userId, pageUrl);

    const responseComments = responseData.pageComments;

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const activeTab = tabs[0];
      const tabId = activeTab.id;

      const message = {
        action: "sendDataToDisplayComments",
        data: responseComments,
      };

      chrome.tabs.sendMessage(tabId, message);
    });
  } catch (error) {
    console.error("Error occurred during data transmission:", error);
  }
}

async function handleOpenCommentTab(message) {
  const commentId = message.commentId;

  const CLIENT_URL = await new Promise((resolve) => {
    chrome.storage.local.get(["CLIENT_URL"], (result) => {
      resolve(result.CLIENT_URL);
    });
  });

  chrome.tabs.create({ url: `${CLIENT_URL}/comments/${commentId}` });
}

async function popAlarm() {
  const loginUser = await new Promise((resolve) => {
    chrome.storage.local.get(["loginUser"], (result) => {
      resolve(result.loginUser);
    });
  });

  const userFriends = await new Promise((resolve) => {
    chrome.storage.local.get(["userData"], (result) => {
      resolve(result.userData.friends);
    });
  });

  const friendsString = userFriends.map((friend) => friend._id).join(",");

  const SERVER_URL = await new Promise((resolve) => {
    chrome.storage.local.get(["SERVER_URL"], (result) => {
      resolve(result.SERVER_URL);
    });
  });

  const eventSource = new EventSource(
    `${SERVER_URL}/comments/comments-stream/${loginUser}?friends=${friendsString}`,
  );

  eventSource.addEventListener("message", async (event) => {
    const userDataUpdate = JSON.parse(event.data);

    await chrome.storage.local.set({
      userDataUpdate,
    });

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];

      if (activeTab) {
        const tabId = activeTab.id;

        chrome.scripting.executeScript({
          target: { tabId },
          files: ["taggedUserAlarm.js"],
        });

        chrome.runtime.sendMessage({
          action: "userUpdate",
          userDataUpdate,
        });
      }
    });
  });

  eventSource.addEventListener("error", () => {
    eventSource.close();
  });
}

function getModifiedUrl(currentUrl) {
  const index = currentUrl.indexOf("?scroll=");

  const modifiedUrl =
    index !== -1 ? currentUrl.substring(0, index) : currentUrl;

  return modifiedUrl;
}

chrome.commands.onCommand.addListener(() => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];
    const tabId = activeTab.id;
    const currentUrl = activeTab.url;

    chrome.storage.local.set({
      currentUrl,
    });

    chrome.scripting.executeScript({
      target: { tabId },
      files: ["addNewComment.js"],
    });
  });
});
