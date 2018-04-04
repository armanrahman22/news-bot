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
var _a = require('botbuilder'), MessageFactory = _a.MessageFactory, CardFactory = _a.CardFactory, CardAction = _a.CardAction, ActionTypes = _a.ActionTypes;
var NewsSource = require('./newsSource');
var moment = require('moment');
var MONTH = new RegExp("^.{7}$");
var YEAR = new RegExp("^.{4}$");
function begin(context, results, state, newsapi) {
    return __awaiter(this, void 0, void 0, function () {
        var entities, payload, initiatingSearchMessage, range, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    entities = results.entities;
                    console.log(entities);
                    payload = {
                        sources: state.newsSources.join()
                    };
                    initiatingSearchMessage = "";
                    // get topic 
                    if (entities.Topic !== undefined) {
                        payload['topic'] = entities.Topic[0];
                        // list the sources we are searching 
                        initiatingSearchMessage = "Searching for articles about \"" + payload['topic'] + "\" from " + payload['sources'] + " ...";
                    }
                    else {
                        payload['topic'] = '';
                    }
                    // get section 
                    if (entities.RegexSection !== undefined) {
                        payload['section'] = entities.RegexSection[0][0];
                        initiatingSearchMessage = "Searching for articles in all sources' \"" + payload['section'] + "\" sections ...";
                    }
                    else {
                        payload['section'] = '';
                    }
                    // get time range 
                    if (entities.builtin_datetimeV2_date !== undefined) {
                        payload['from'] = entities.builtin_datetimeV2_date;
                        payload['to'] = entities.builtin_datetimeV2_date;
                    }
                    else if (entities.builtin_datetimeV2_daterange !== undefined) {
                        range = entities.builtin_datetimeV2_daterange[0];
                        if (MONTH.exec(range.toString()) != null) {
                            payload['from'] = moment(range).startOf('month').format("YYYY-MM-DD");
                            payload['to'] = moment(range).endOf('month').format("YYYY-MM-DD");
                        }
                    }
                    else {
                        payload['from'] = moment().format("YYYY-MM-DD");
                        payload['to'] = moment().format("YYYY-MM-DD");
                    }
                    if (!(payload['section'] !== '' ||
                        payload['topic'] !== '')) return [3 /*break*/, 6];
                    return [4 /*yield*/, context.sendActivity(initiatingSearchMessage)];
                case 1:
                    _b.sent();
                    if (!(payload['section'] !== '')) return [3 /*break*/, 3];
                    return [4 /*yield*/, exploreTopHttpRequest(payload, newsapi, context)];
                case 2:
                    _a = _b.sent();
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, exploreAllHttpRequest(payload, newsapi, context)];
                case 4:
                    _a = _b.sent();
                    _b.label = 5;
                case 5:
                    _a;
                    return [3 /*break*/, 9];
                case 6:
                    initiatingSearchMessage = "Searcing for articles between " + payload['from'] + " and " + payload['to'] + " ... ";
                    return [4 /*yield*/, context.sendActivity(initiatingSearchMessage)];
                case 7:
                    _b.sent();
                    return [4 /*yield*/, exploreAllHttpRequest(payload, newsapi, context)];
                case 8:
                    _b.sent();
                    _b.label = 9;
                case 9: return [2 /*return*/];
            }
        });
    });
}
exports.begin = begin;
function exploreTopHttpRequest(payload, newsapi, context) {
    return __awaiter(this, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, newsapi.v2.topHeadlines({
                        //q: encodeURIComponent(payload.topic),
                        category: payload.section,
                        from: payload.from,
                        to: payload.to,
                        country: 'us',
                        language: 'en',
                        sortBy: 'relevancy',
                        pageSize: 1,
                        page: 1
                    })];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, displayArticles(context, response)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function exploreAllHttpRequest(payload, newsapi, context) {
    return __awaiter(this, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, newsapi.v2.everything({
                        q: encodeURIComponent(payload.topic),
                        sources: payload.sources,
                        from: payload.from,
                        to: payload.to,
                        language: 'en',
                        sortBy: 'relevancy',
                        pageSize: 1,
                        page: 1
                    })];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, displayArticles(context, response)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function displayArticles(context, response) {
    return __awaiter(this, void 0, void 0, function () {
        var articleList, article, obj, messageWithCarouselOfCards;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    articleList = [];
                    for (article in response.articles) {
                        obj = response.articles[article];
                        articleList.push(CardFactory.heroCard(obj.title, [obj.urlToImage], [{ type: ActionTypes.openUrl, value: obj.url, title: "Click to view article" }]));
                    }
                    if (!(articleList.length > 0)) return [3 /*break*/, 2];
                    messageWithCarouselOfCards = MessageFactory.list(articleList);
                    return [4 /*yield*/, context.sendActivity(messageWithCarouselOfCards)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, context.sendActivity("We couldn't find any articles from these sources.")];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    });
}
