chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.action) {
    case "openWebPage":
      handleOpenWebPage();
      break;
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
    case "taggedUserAlarm":
      handleOpenAlarm(message);
      break;
  }
});

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

async function handleOpenWebPage() {
  await chrome.tabs.create({ url: `http://localhost:5173` });
}

async function handleOpenAlarm(message) {
  const userDataUpdate = message.userDataUpdate;

  await chrome.storage.local.set({
    userDataUpdate,
  });

  await chrome.scripting.executeScript({
    target: { tabId: message.tabId },
    files: ["taggedUserAlarm.js"],
  });
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

async function handleSubmitForm(message, sendResponse) {
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

    const formData = new FormData();
    formData.append("userData", userData.email);
    formData.append("text", message.data.inputValue);
    formData.append("postDate", message.data.nowDate);
    formData.append("postUrl", currentUrl);
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
      console.log("Fetch complited");
    } else {
      console.error("some problem with Fetch");
    }
  } catch (error) {
    console.error("An error:", error);
  }

  sendResponse("addNewComment has been arrived");
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
    let userId = await new Promise((resolve) => {
      chrome.storage.local.get(["loginUser"], (result) => {
        resolve(result.loginUser);
      });
    });

    userId = userId || "65cccdc51ecc1196b364a1c7";

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

chrome.commands.onCommand.addListener(() => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];
    const tabId = activeTab.id;

    chrome.scripting.executeScript({
      target: { tabId },
      files: ["addNewComment.js"],
    });
  });
});
