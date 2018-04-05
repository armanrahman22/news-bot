import { MyConversationState, MyUserState } from './app';
const FuzzySet = require('fuzzyset.js')

const SOURCES: string[] = ['bbc-news', 'bloomberg', 'buzzfeed', 'cnn', 'breibart-news', 'the-new-york-times', 'fox-news'];
const FUZZYSOURCES = FuzzySet(SOURCES);

export function getListOfValidSources(): string[] {
    return SOURCES;
}

export function getFuzzySet(): string[] {
    return FUZZYSOURCES;
}

export function getBestmatch(value: string) : string {
    let matches: [number, string][] = FUZZYSOURCES.get(value);
    if(matches.length > 0) {
        let bestMatch: string;
        let bestMatchValue: number = 0.0;
        for(let match of matches) {
            if (match[0] > bestMatchValue) {
                bestMatch = match[1];
                bestMatchValue = match[0];
            }
        }
        return bestMatch;
    } 
    return null;
}

export function addSource(userState: MyUserState, source: string) {
    if(!userState.newsSources.includes(source)){
        userState.newsSources.push(source);
    }
}

export function getUnaddedSources(userState: MyUserState): string[] {
    return SOURCES.filter( function(n) { return !this.has(n) }, new Set(userState.newsSources) );
}



