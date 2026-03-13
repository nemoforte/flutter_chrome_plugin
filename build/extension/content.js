chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request === 'GET_TITLE') {
    sendResponse({ title: document.title });
  }
});