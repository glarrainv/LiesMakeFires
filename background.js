import { fetchHTML } from './middleman.js';

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

    // 1. Rank the candidate sources locally with the embedding model.
    const ranking = await chrome.runtime.sendMessage({
        target: 'offscreen',
        action: 'getSimilarity',
        payload,
    });

    // 2. Enrich the top sources with a real Google `site:` result. A failure
    //    here must not break ranking, so the content script can still fall
    //    back to the locally-known descriptions.
    const [searchQuery] = payload;
    const sources = (ranking?.top || []).map((item) => item.url);

    let enriched = [];
    try {
        enriched = await fetchHTML(searchQuery, sources);
    } catch (err) {
        console.warn('middleman fetchHTML failed:', err);
    }

    // 3. Return ranking + enriched hits to the content script.
    return { ...ranking, enriched };
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
