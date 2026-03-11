chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'GET_TITLE') {
    sendResponse({ title: document.title });
  }
});