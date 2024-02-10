chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.action === "openWebPage") {
    chrome.tabs.create({ url: `localhost:5173?token=${message.token}` });
  } else if (message.action === "addNewComment") {
    const currentUrl = message.currentUrl;
    const userData = message.userData;

    chrome.storage.local.set({ currentUrl, userData });

    chrome.scripting.executeScript({
      target: { tabId: message.tabId },
      files: ["addNewComment.js"],
    });
  } else if (message.action === "submitForm") {
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
        allowPublic: message.data.selectValue,
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
        console.log("새로운 글 등록이 완료되었습니다");
      } else {
        console.error("some problem with Fetch");
      }
    } catch (error) {
      console.error("An error:", error);
    }

    sendResponse("addNewComment로 부터 메시지를 받았습니다");
  }
});
