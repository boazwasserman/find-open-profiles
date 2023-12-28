/**
 * This function finds non-premium profiles and hides them.
 * If all profiles are hidden, it navigates to the next page.
 */
function hideNonPremiumProfiles() {
    const listItems = document.querySelectorAll('.artdeco-list__item');
    let hiddenCount = 0;
    listItems.forEach((li) => {
        const hasGoldIcon = li.querySelector('li-icon[type="linkedin-premium-gold-icon"]');
        if (!hasGoldIcon) {
            li.style.display = 'none';
            hiddenCount++;
        }
    });

    // If all items are hidden, go to the next page
    if (hiddenCount === listItems.length) {
        goToNextPage();
    }
}

/**
 * This function navigates to the next page.
 * If the 'Next' button is not found, it logs an error.
 */
function goToNextPage() {
    const nextButton = document.querySelector('button[aria-label="Next"]');
    if (nextButton) {
        nextButton.click();
        // Wait for the next page to load
        waitForPageLoad().then(() => {
            // Scroll to the top of the page
            scrollToTop();

            // Hide list items again
            scrollToBottomAndHide();
        });

    } else {
        console.error("Couldn't find the 'Next' button!");
    }
}

/**
 * This function validates that the current view has fully loaded.
 */
function validateCurrentViewLoaded() {
    const elements = Array.from(document.querySelectorAll('li'));
    const inViewport = [];

    elements.forEach(el => {
        const hasDummyTextDiv = el.querySelector('div.dummy-text');
        const rect = el.getBoundingClientRect();

        if (hasDummyTextDiv &&
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= window.innerHeight &&
            rect.right <= window.innerWidth) {
            inViewport.push(el);
        }
    });

    return inViewport;
}

/**
 * This function waits for the page to load.
 * It checks every 100ms if the content has likely loaded.
 */
function waitForPageLoad() {
    return new Promise(resolve => {
        // A simple check to see if content has likely loaded
        // This might need to be adjusted based on the actual site's behavior
        const checkInterval = setInterval(() => {
            const listItems = validateCurrentViewLoaded();
            if (listItems.length == 0) {
                clearInterval(checkInterval);
                resolve();
            }
        }, 100); // Check every 100ms
    });
}

/**
 * This function scrolls to the top of the page.
 * If the 'search-results-container' is not found, it logs an error.
 */
function scrollToTop() {
    const container = document.getElementById('search-results-container');
    if (!container) {
        console.error("Couldn't find the 'search-results-container'!");
        return;
    }

    container.scrollTop = 0;
}

/**
 * This function scrolls to the bottom of the page and hides non premium profiles.
 * If the 'search-results-container' is not found, it logs an error.
 */
function scrollToBottomAndHide() {
    const container = document.getElementById('search-results-container');
    if (!container) {
        console.error("Couldn't find the 'search-results-container'!");
        return;
    }

    const step = 300;  // Amount to scroll in each step
    let lastHeight = -1;  // A value that container's scrollHeight will never be

    function scrollStep() {
        // If we've reached the bottom or the height hasn't changed, stop and hide items
        if (container.scrollTop + container.clientHeight >= container.scrollHeight || lastHeight === container.scrollHeight) {
            hideNonPremiumProfiles();
            return;
        }

        // Update the last height and scroll a step
        lastHeight = container.scrollHeight;
        container.scrollTop += step;

        // Continue scrolling after a short delay
        setTimeout(scrollStep, 50);  // 150ms delay between each scroll step
    }

    // Start the scrolling
    scrollStep();
}

// Execute the function
scrollToBottomAndHide();