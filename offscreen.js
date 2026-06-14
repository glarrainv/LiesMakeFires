import { pipeline, cos_sim, env } from './dist_/transformers.js';


env.allowLocalModels = true;
env.allowRemoteModels = false;
env.localModelPath = chrome.runtime.getURL('./models/');
env.useBrowserCache = false;
env.backends.onnx.wasm.wasmPaths = chrome.runtime.getURL('wasm/');
env.backends.onnx.wasm.numThreads = 1;

let extractorPromise = null;

// Source descriptions are static across queries, so their embeddings never
// change. Cache them by description text: after the first query we only ever
// embed the (single) prompt instead of re-embedding ~100 descriptions.
const descEmbeddingCache = new Map();

function getExtractor() {
    if (!extractorPromise) {
        extractorPromise = pipeline('feature-extraction', 'onnx-community/all-MiniLM-L6-v2-ONNX', {
            dtype: 'fp32',
        });
    }
    return extractorPromise;
}

async function embed(extractor, texts) {
    const output = await extractor(texts, { pooling: 'mean', normalize: true });
    return output.tolist();
}

async function getSimilarity(prompt, urls) {
    const limit = 3;
    const extractor = await getExtractor();
    const items = [];


    for (const [category, data] of Object.entries(urls)) {
        if (!data || !Array.isArray(data.urls)) continue;

        data.urls.slice(0, limit).forEach((url, i) => {
            if (data.desc && data.desc[i]) {
                items.push({
                    category,
                    url,
                    desc: data.desc[i]
                });
            }
        });
    }

    if (items.length === 0) {
        return { best: null, top: [] };
    }

    // Only embed the prompt plus any descriptions we haven't seen before.
    const missing = items
        .map((item) => item.desc)
        .filter((desc) => !descEmbeddingCache.has(desc));

    const embeddings = await embed(extractor, [prompt, ...missing]);
    const promptEmbedding = embeddings[0];
    missing.forEach((desc, i) => descEmbeddingCache.set(desc, embeddings[i + 1]));

    const scored = items.map((item) => ({
        ...item,
        score: cos_sim(promptEmbedding, descEmbeddingCache.get(item.desc)),
    }));

    scored.sort((a, b) => b.score - a.score);

    return {
        best: scored[0] || null,
        top: scored.slice(0, 3)
    };
}

// Strip Google's `/url?q=<real>&...` redirect wrapper back to the real URL.
function cleanGoogleUrl(href) {
    if (!href) return '';
    const match = href.match(/[?&](?:q|url)=([^&]+)/);
    if (/\/url\?/.test(href) && match) {
        try {
            return decodeURIComponent(match[1]);
        } catch {
            return match[1];
        }
    }
    return href;
}

function extractTopResult(doc, source) {
    // 1. Target the specific structural table/div wrappers Google uses for organic search results
    // In raw HTML, organic entries are wrapped in tables or specific class containers
    const organicContainer = doc.querySelector('.g, table, div.ZINbbc');
    
    if (!organicContainer) {
        return { error: 'No organic container found', fn: 'extractTopResult', url: source };
    }

    // 2. Find the anchor link strictly INSIDE that organic container
    const anchor = organicContainer.querySelector('a[href^="/url?q="], a[href^="http"]');
    if (!anchor) {
        return { error: 'No organic link parsed', fn: 'extractTopResult', url: source };
    }

    // 3. Clean the URL safely using your existing function
    const rawHref = anchor.getAttribute('href');
    const url = cleanGoogleUrl(rawHref) || source;

    // 4. Fallback chain to find the title text associated with this result
    const h3 = organicContainer.querySelector('h3') || anchor.querySelector('h3') || doc.querySelector('h3');
    const title = h3 ? h3.textContent.trim() : '';

    const snippet = organicContainer.querySelector('.VwiC3b, .aCOpRe, .lEBKkf, .IsZvec, div[data-sncf], .s3v9rd');
    const desc = snippet ? snippet.textContent.trim() : '';

    const img = organicContainer.querySelector('img[src^="data:"], img[src^="http"]');
    const image = img ? (img.getAttribute('src') || '') : '';

    if (!title && !desc) {
        return { error: 'No organic content parsed', fn: 'extractTopResult', url: source };
    }

    return { url, title, desc, image };
}


async function searchSite(searchQuery, source) {
    let domain;
    try {
        domain = new URL(source).hostname.replace(/^www\./, '');
    } catch {
        domain = source;
    }

    const q = encodeURIComponent(`${searchQuery} site:${domain}`);
    const res = await fetch(`https://www.google.com/search?q=${q}&hl=en`, {
        credentials: 'omit',
    });
    if (!res.ok) return { error: `HTTP ${res.status}`, fn: 'searchSite', url: source };

    const html = await res.text();

    // Detect Google's consent/bot wall before trying to parse results. The
    // request gets redirected to consent.google.com or /sorry/ (the "unusual
    // traffic" / CAPTCHA page), so check the final URL plus a stable marker.
    if (
        /consent\.google\.|\/sorry\//.test(res.url) ||
        html.includes('id="recaptcha"') ||
        html.includes('unusual traffic')
    ) {
        return { error: 'Blocked by Google consent/bot wall', fn: 'searchSite', url: source };
    }

    const doc = new DOMParser().parseFromString(html, 'text/html');
    return extractTopResult(doc, source);
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message?.target !== 'offscreen') {
        return;
    }

    if (message.action === 'getSimilarity') {
        const [searchQuery, urls] = message.payload;
        getSimilarity(searchQuery, urls)
            .then(sendResponse)
            .catch((err) => sendResponse({ error: String(err) }));
        return true;
    }

    if (message.action === 'searchSite') {
        const [searchQuery, source] = message.payload;
        searchSite(searchQuery, source)
            .then(sendResponse)
            .catch((err) => sendResponse({ error: String(err), fn: 'searchSite', url: source }));
        return true;
    }
});
