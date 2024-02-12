chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "openWebPage") {
    handleOpenWebPage(message);
  } else if (message.action === "addNewComment") {
    handleAddNewComment(message);
  } else if (message.action === "submitForm") {
    handleSubmitForm(message, sendResponse);
  } else if (message.action === "pageUrlUpdated") {
    handlePageUrlUpdated(message, sendResponse);
  } else if (message.action === "updateLoginUser") {
    chrome.runtime.loginUser = message.user;
  }
});

async function handleOpenWebPage(message) {
  await chrome.tabs.create({ url: `localhost:5173?token=${message.token}` });
}

async function handleAddNewComment(message) {
  const currentUrl = message.currentUrl;
  const userData = message.userData;

  await chrome.storage.local.set({ currentUrl, userData });

  chrome.scripting.executeScript({
    target: { tabId: message.tabId },
    files: ["addNewComment.js"],
  });
}

async function handleSubmitForm(message, sendResponse) {
  try {
    const screenshot = await new Promise((resolve) => {
      chrome.tabs.captureVisibleTab(
        { format: "png", quality: 90 },
        (imageUrl) => {
          resolve(imageUrl);
        },
      );
    });

    const encodeScreenshot = btoa(screenshot);

    const { currentUrl, userData } = await new Promise((resolve) => {
      chrome.storage.local.get(["currentUrl", "userData"], (result) => {
        resolve(result);
      });
    });

    const newComment = {
      userData,
      text: message.data.inputValue,
      postDate: message.data.nowDate,
      postUrl: currentUrl,
      postCoordinate: message.data.postCoordinate,
      screenshot: encodeScreenshot,
      allowPublic: message.data.allowPublic,
      publicUsers: [],
      recipientEmail: message.data.recipientEmail,
    };

    const response = await fetch("http://localhost:3000/comments/new", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newComment),
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
  const serverEndpoint = `http://localhost:3000/location?userId=${encodeURIComponent(userId)}&pageUrl=${encodeURIComponent(pageUrl)}`;

  return fetch(serverEndpoint, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((responseData) => {
      return responseData;
    })
    .catch((error) => {
      console.error(
        "Error occurred during data transmission to the server:",
        error,
      );
    });
}

function handlePageUrlUpdated(message) {
  const userId = chrome.runtime.loginUser;
  const pageUrl = message.url;

  sendUserDataToServer(userId, pageUrl)
    .then((responseData) => {
      const responseComments = responseData.pageComments;
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const activeTab = tabs[0];
        const message = {
          action: "sendDataToDisplayComments",
          data: responseComments,
        };

        chrome.tabs.sendMessage(activeTab.id, message, (response) => {
          console.log("Response from content script:", response);
        });
      });
    })
    .catch((error) => {
      console.error("Error occurred during data transmission:", error);
    });
}
