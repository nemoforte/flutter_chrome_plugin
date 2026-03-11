chrome.action.onClicked.addListener(async () => {
  const url = chrome.runtime.getURL("index.html");
  await chrome.tabs.create({ url });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('background dostał:', request);

  if (request === 'PING') {
    sendResponse({ message: 'PONG z background.js' });
    return;
  }

  sendResponse({ message: 'Nieznany request' });
});