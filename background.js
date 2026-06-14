const OFFSCREEN_PATH = 'offscreen.html';

let creating = null;

async function ensureOffscreenDocument() {
    const existing = await chrome.runtime.getContexts({
        contextTypes: ['OFFSCREEN_DOCUMENT'],
        documentUrls: [chrome.runtime.getURL(OFFSCREEN_PATH)],
    });
    if (existing.length > 0) return;

    if (creating) {
        await creating;
        return;
    }

    creating = chrome.offscreen.createDocument({
        url: OFFSCREEN_PATH,
        reasons: ['WORKERS'],
        justification: 'Run the local embedding model used to rank trustworthy sources.',
    });
    try {
        await creating;
    } finally {
        creating = null;
    }
}

async function runSimilarity(payload) {
    await ensureOffscreenDocument();

    // Sends message to offscreen.js to run similarity between:
    // Prompt 3 random source descriptions from each category. Gov, Academic, Private
    
    return chrome.runtime.sendMessage({
        target: 'offscreen',
        action: 'getSimilarity',
        payload,
    });
}

// Pre-warm the offscreen document (and, lazily, the embedding model) so the
// first real query doesn't pay the cold-start cost.
function prewarm() {
    ensureOffscreenDocument().catch(() => {});
}
chrome.runtime.onStartup?.addListener(prewarm);
chrome.runtime.onInstalled?.addListener(prewarm);

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message?.action !== 'getSimilarity' || message.target === 'offscreen') {
        return; 
    }

    runSimilarity(message.payload)
        .then(sendResponse)
        .catch((err) => sendResponse({ error: String(err) }));
    return true; 
});
