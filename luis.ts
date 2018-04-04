require('dotenv').load();
require('es6-promise').polyfill();
require('isomorphic-fetch');
var querystring = require('querystring');

export interface LuisResult {
    topScoringIntent: {intent: string, score: number};
    intents: {intent: string, score: number}[];
    entities: {entity: string, type: string, startIndex: number, endIndex: number, resolution: any}[];
}

export async function getLuisResults(utterance: string): Promise<LuisResult> {
    var endpoint = "https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/";

    var luisAppId = process.env.LUIS_APP_ID;

    var queryParams = {
        "subscription-key": process.env.LUIS_SUBSCRIPTION_KEY,
        "timezoneOffset": "0",
        "verbose":  true,
        "q": utterance
    }

    var luisRequest =
        endpoint + luisAppId +
        '?' + querystring.stringify(queryParams);
    
    const response = await fetch(luisRequest);
    const data = await response.json();
    return {topScoringIntent: data.topScoringIntent, intents: data.intents, entities: data.entities};
}