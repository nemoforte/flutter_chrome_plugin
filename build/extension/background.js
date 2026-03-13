chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('background dostał:', request);

  if (request === 'PING') {
    sendResponse({ message: 'PONG z background.js' });
    return;
  }

  if (request === 'GET_TITLE') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tabId = tabs[0]?.id;

      if (!tabId) {
        sendResponse({ title: 'Brak aktywnej karty' });
        return;
      }

      chrome.tabs.sendMessage(tabId, 'GET_TITLE', (response) => {
        if (chrome.runtime.lastError) {
          console.error('tabs.sendMessage error:', chrome.runtime.lastError.message);
          sendResponse({ title: 'Nie udało się pobrać tytułu strony' });
          return;
        }

        sendResponse(response ?? { title: 'Brak odpowiedzi z content.js' });
      });
    });

    return true;
  }

  sendResponse({ message: 'Nieznany request' });
});