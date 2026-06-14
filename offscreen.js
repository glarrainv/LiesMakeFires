import {
    pipeline,
    cos_sim,
    env
} from './dist_/transformers.js';

// Set local model paths for faster download
// TODO: Integrate remote models when publishing
env.allowLocalModels = true;
env.allowRemoteModels = false;
env.localModelPath = chrome.runtime.getURL('./models/');
env.useBrowserCache = false;
env.backends.onnx.wasm.wasmPaths = chrome.runtime.getURL('wasm/');
env.backends.onnx.wasm.numThreads = 1;

let extractorPromise = null;

// Cache description embeddings for faster lookups
const descEmbeddingCache = new Map();

// Call text classification model
function getExtractor() {
    if (!extractorPromise) {
        extractorPromise = pipeline('feature-extraction', 'onnx-community/all-MiniLM-L6-v2-ONNX', {
            dtype: 'fp32',
        });
    }
    return extractorPromise;
}

// Create embeddings
async function embed(extractor, texts) {
    const output = await extractor(texts, {
        pooling: 'mean',
        normalize: true
    });
    return output.tolist();
}

async function getSimilarity(prompt, urls) {

    // Init constants and extractor call
    const itemLimit = 5;
    const extractor = await getExtractor();
    const items = [];

    // Select random source from each category.
    for (const [category, data] of Object.entries(urls)) {
        if (!data || !Array.isArray(data.urls)) continue;

        data.urls.slice(0, itemLimit).forEach((url, i) => {
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
        return {
            best: null,
            top: []
        };
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
        top: scored.slice(0, itemLimit * 2)
    };
}



// Wait for call from background.js
// offscreen handles embeddings and similarity in a seperate context
// Return similarity scores of QUERY and SOURCES
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message?.target !== 'offscreen') {
        return;
    }

    if (message.action === 'getSimilarity') {
        const [searchQuery, urls] = message.payload;
        getSimilarity(searchQuery, urls)
            .then(sendResponse)
            .catch((err) => sendResponse({
                error: String(err)
            }));
        return true;
    }
});