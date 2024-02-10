chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "openWebPage") {
    handleOpenWebPage(message);
  } else if (message.action === "addNewComment") {
    handleAddNewComment(message);
  } else if (message.action === "submitForm") {
    handleSubmitForm(message, sendResponse);
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
