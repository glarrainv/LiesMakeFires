import { pipeline } from '@xenova/transformers';

let sentimentPipeline;
async function getSentiment(text) {
    if (!sentimentPipeline) {
        sentimentPipeline = await pipeline('sentiment-analysis', 'Xenova/distilbert-base-uncased-finetuned-sst-2-english');
    }
    return await sentimentPipeline(text);
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "analyzeText") {
        getSentiment(request.text).then(sendResponse);
        return true; 
    }
});
