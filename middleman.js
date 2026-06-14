// Middleman: enriches the model-ranked sources with a real Google result.
//
// For each ranked source we run a `<query> site:<domain>` Google search and
// pull back the top organic hit (url, title, image, desc). The actual fetch +
// HTML parsing happens in the offscreen document (the service worker has no
// DOMParser), so this module only orchestrates and shapes the response.
//
// searchQuery: the user's Google query.
// sources:     ranked source URLs chosen by the model (already top-N).
async function fetchHTML(searchQuery, sources) {
    if (!searchQuery || !Array.isArray(sources) || sources.length === 0) {
        return [];
    }

    // Fire every site-search in parallel; one slow/blocked source must not
    // stall the others. A rejected message becomes an error entry tagged with
    // the function so the content script can surface what failed and where.
    const settled = await Promise.all(
        sources.map((source) =>
            chrome.runtime
                .sendMessage({
                    target: 'offscreen',
                    action: 'searchSite',
                    payload: [searchQuery, source],
                })
                .catch((err) => ({ error: String(err), fn: 'fetchHTML', url: source }))
        )
    );

    // Pass everything through — successful hits AND error entries — so errors
    // remain visible in the model response rather than being silently dropped.
    return settled.filter(Boolean);
}

export { fetchHTML };
