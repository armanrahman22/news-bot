"use strict";
exports.__esModule = true;
var FuzzySet = require('fuzzyset.js');
var SOURCES = ['bbc-news', 'bloomberg', 'buzzfeed', 'cnn', 'breibart-news', 'the-new-york-times', 'fox-news'];
var FUZZYSOURCES = FuzzySet(SOURCES);
function getListOfValidSources() {
    return SOURCES;
}
exports.getListOfValidSources = getListOfValidSources;
function getFuzzySet() {
    return FUZZYSOURCES;
}
exports.getFuzzySet = getFuzzySet;
function getBestmatch(value) {
    var matches = FUZZYSOURCES.get(value);
    if (matches.length > 0) {
        var bestMatch = void 0;
        var bestMatchValue = 0.0;
        for (var _i = 0, matches_1 = matches; _i < matches_1.length; _i++) {
            var match = matches_1[_i];
            if (match[0] > bestMatchValue) {
                bestMatch = match[1];
                bestMatchValue = match[0];
            }
        }
        return bestMatch;
    }
    return null;
}
exports.getBestmatch = getBestmatch;
function addSource(userState, source) {
    if (!userState.newsSources.includes(source)) {
        userState.newsSources.push(source);
    }
}
exports.addSource = addSource;
function getUnaddedSources(userState) {
    return SOURCES.filter(function (n) { return !this.has(n); }, new Set(userState.newsSources));
}
exports.getUnaddedSources = getUnaddedSources;
