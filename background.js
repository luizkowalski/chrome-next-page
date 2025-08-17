// Handle messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getCustomPatterns') {
    chrome.storage.sync.get(['customPatterns'], (result) => {
      sendResponse({ customPatterns: result.customPatterns });
    });
    return true; // Keep message channel open for async response
  }
});
