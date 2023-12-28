document.addEventListener('DOMContentLoaded', function() {
    const hideButton = document.getElementById('hideItems');
    
    if (hideButton) {
        hideButton.addEventListener('click', function() {
            // Fetch the current tab's ID
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                const currentTabId = tabs[0].id;
                
                console.log('Button clicked, attempting to execute content script on tab ID:', currentTabId);
                
                chrome.scripting.executeScript({
                    target: { tabId: currentTabId },
                    files: ['content.js']
                }, () => {
                    console.log('Content script should be executed now.');
                });

                // Close the popup after the action
                window.close();
            });
        });
    } else {
        console.error("Couldn't find the 'hideItems' button!");
    }
});
