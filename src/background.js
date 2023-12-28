chrome.commands.onCommand.addListener(function(command) {
    if (command === "hide") {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            const currentTabId = tabs[0].id;
            chrome.scripting.executeScript({
                target: { tabId: currentTabId },
                files: ['src/content.js']
            });
        });
    }
});
