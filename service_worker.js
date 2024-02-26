chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.action) {
    case "addNewComment":
      handleAddNewComment(message);
      break;
    case "submitForm":
      handleSubmitForm(message, sendResponse);
      break;
    case "pageUrlUpdated":
      handlePageUrlUpdated(message, sendResponse);
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

  chrome.cookies.set(
    {
      url: "http://localhost:5173",
      name: "authToken",
      value: message.token,
      expirationDate: Math.floor(Date.now() / 1000 + 60 * 60),
      secure: false,
      httpOnly: false,
    },
    function (cookie) {
      console.log("Token cookie set:", cookie);
    },
  );

  await chrome.storage.local.set({ loginUser });
}

async function handleAddNewComment(message) {
  const currentUrl = message.currentUrl;
  const userData = message.userData;
  const userFriends = userData.friends;

  await chrome.storage.local.set({
    currentUrl,
    userData,
    userFriends,
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

    let { currentUrl, userData } = await new Promise((resolve) => {
      chrome.storage.local.get(["currentUrl", "userData"], (result) => {
        resolve(result);
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

    const response = await fetch("http://localhost:3000/comments/new", {
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
    const serverEndpoint = `http://localhost:3000/location?userId=${encodeURIComponent(userId)}&pageUrl=${encodeURIComponent(pageUrl)}`;

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

    const loginUser = await new Promise((resolve) => {
      chrome.storage.local.get(["loginUser"], (result) => {
        resolve(result.loginUser);
      });
    });

    const userId = loginUser || "65cccdc51ecc1196b364a1c7";

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

  chrome.tabs.create({ url: `http://localhost:5173/comments/${commentId}` });
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

  const eventSource = new EventSource(
    `http://localhost:3000/comments/comments-stream/${loginUser}?friends=${friendsString}`,
  );

  eventSource.addEventListener("message", async (event) => {
    const userDataUpdate = JSON.parse(event.data);

    await chrome.storage.local.set({
      userDataUpdate,
    });

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      const tabId = activeTab.id;

      chrome.scripting.executeScript({
        target: { tabId },
        files: ["taggedUserAlarm.js"],
      });

      chrome.tabs.sendMessage(tabId, { action: "userUpdate", userDataUpdate });
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
