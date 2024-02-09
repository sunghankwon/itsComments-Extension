chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "openWebPage") {
    chrome.tabs.create({ url: `localhost:5173?token=${message.token}` });
  } else if (message.action === "addNumComment") {
    chrome.scripting.executeScript({
      target: { tabId: message.tabId },
      files: ["addNewComment.js"],
    });
  }
});
