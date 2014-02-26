chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    sendResponse({data: window.getSelection().toString()});
});

