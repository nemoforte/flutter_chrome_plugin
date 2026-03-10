chrome.action.onClicked.addListener(async () => {
  const url = chrome.runtime.getURL("index.html");
  await chrome.tabs.create({ url });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "PING") {
    sendResponse({
      ok: true,
      message: "Hej z background.js",
      time: new Date().toLocaleTimeString(),
    });
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

  if (request.type === "GET_TITLE") {

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {

      const tabId = tabs[0]?.id;

      if (!tabId) {
        sendResponse({ title: "no active tab" });
        return;
      }

      chrome.tabs.sendMessage(
        tabId,
        { type: "GET_TITLE" },
        (response) => {
          sendResponse(response ?? { title: "no response from content" });
        }
      );

    });

    return true;
  }

});