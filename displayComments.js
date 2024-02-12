chrome.runtime.sendMessage({
  action: "pageUrlUpdated",
  url: window.location.href,
});
