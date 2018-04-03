"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var NewsSource = require('./newsSource');
function begin(context, state) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // Set topic and initialize news sources
                    state.topic = 'addNewsSource';
                    if (state.newsSources === undefined) {
                        console.log("newsSources");
                        state.newsSources = {};
                    }
                    if (state.currentSource === undefined) {
                        console.log("currentSource");
                        state.currentSource = new NewsSource();
                    }
                    // Prompt for first field
                    return [4 /*yield*/, nextField(context, state)];
                case 1:
                    // Prompt for first field
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.begin = begin;
function routeReply(context, state) {
    return __awaiter(this, void 0, void 0, function () {
        var utterance;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("routeReply");
                    utterance = context.request.text.trim();
                    switch (state.prompt) {
                        case 'newsSource':
                            state.currentSource.source = utterance;
                            break;
                        case 'subjects':
                            state.currentSource.subjects = utterance;
                            break;
                    }
                    // Prompt for next field
                    return [4 /*yield*/, nextField(context, state)];
                case 1:
                    // Prompt for next field
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.routeReply = routeReply;
function nextField(context, state) {
    return __awaiter(this, void 0, void 0, function () {
        var newsSource;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    newsSource = state.currentSource;
                    if (!(newsSource.source === undefined)) return [3 /*break*/, 2];
                    console.log("source");
                    state.prompt = 'newsSource';
                    return [4 /*yield*/, context.sendActivity("Which news source would you like to add?")];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 2:
                    if (!(newsSource.subjects === undefined)) return [3 /*break*/, 4];
                    console.log("subjects");
                    state.prompt = 'subjects';
                    return [4 /*yield*/, context.sendActivity("What subjects would you like to follow?")];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 4:
                    state.newsSources.push(newsSource);
                    state.topic = undefined;
                    state.newsSource = undefined;
                    state.prompt = undefined;
                    return [4 /*yield*/, context.sendActivity("Your news source \"" + newsSource.source + "\" has been added with subjects \"" + newsSource.subjects + "\".")];
                case 5:
                    _a.sent();
                    _a.label = 6;
                case 6: return [2 /*return*/];
            }
        });
    });
}
