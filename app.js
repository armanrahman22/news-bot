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
var _this = this;
exports.__esModule = true;
var _a = require('botbuilder'), MemoryStorage = _a.MemoryStorage, MessageFactory = _a.MessageFactory;
var LuisRecognizer = require('botbuilder-ai').LuisRecognizer;
var newsSource = require('./newsSource');
var exploreNews = require('./exploreNews');
var NewsAPI = require('newsapi');
var querystring = require('querystring');
var botbuilder_botbldr_1 = require("botbuilder-botbldr");
var luis_1 = require("./luis");
var addNewsSource_1 = require("./addNewsSource");
require('dotenv').load();
var newsapi = new NewsAPI(process.env.API_KEY);
var helpMessage = MessageFactory.text("\n    Hi! I'm a news bot. \n \n    Start by adding news sources by saying for example 'add the New York Times to my sources'. \n\n    You can find stories by saying for example 'What happened in Syria recently?'. \n\n    You can find stories by specific journalists by saying for example 'Find recent articles by Jeremy Scahill'.");
var bot = new botbuilder_botbldr_1.ServiceBot();
bot.onRequest(function (context) { return __awaiter(_this, void 0, void 0, function () {
    var convoState, userState, _a, _b, luisResults, _c, _d, _i, _e, member;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                convoState = context.conversationState;
                userState = context.userState;
                _a = context.request.type;
                switch (_a) {
                    case 'message': return [3 /*break*/, 1];
                    case 'conversationUpdate': return [3 /*break*/, 22];
                }
                return [3 /*break*/, 28];
            case 1:
                _b = userState.registered;
                switch (_b) {
                    case undefined: return [3 /*break*/, 2];
                    case true: return [3 /*break*/, 4];
                }
                return [3 /*break*/, 20];
            case 2: return [4 /*yield*/, addNewsSource_1.registerUser(context)];
            case 3:
                _f.sent();
                return [3 /*break*/, 22];
            case 4: return [4 /*yield*/, luis_1.getLuisResults(context.request.text)];
            case 5:
                luisResults = _f.sent();
                if (!(convoState.currentOperation !== undefined)) return [3 /*break*/, 9];
                _c = convoState.currentOperation;
                switch (_c) {
                    case 'addingSource': return [3 /*break*/, 6];
                }
                return [3 /*break*/, 8];
            case 6: return [4 /*yield*/, addNewsSource_1.addNewsSourceChoice(context)];
            case 7:
                _f.sent();
                _f.label = 8;
            case 8: return [3 /*break*/, 19];
            case 9:
                if (!(luisResults !== null)) return [3 /*break*/, 17];
                _d = luisResults.topScoringIntent.intent;
                switch (_d) {
                    case 'AddNewsSource': return [3 /*break*/, 10];
                    case 'Explore': return [3 /*break*/, 12];
                }
                return [3 /*break*/, 14];
            case 10: return [4 /*yield*/, addNewsSource_1.addNewsSourceLuis(context, luisResults)];
            case 11:
                _f.sent();
                return [3 /*break*/, 16];
            case 12: return [4 /*yield*/, exploreNews.begin(context, luisResults, newsapi)];
            case 13:
                _f.sent();
                return [3 /*break*/, 16];
            case 14: return [4 /*yield*/, context.sendActivity(helpMessage)];
            case 15:
                _f.sent();
                return [3 /*break*/, 16];
            case 16: return [3 /*break*/, 19];
            case 17: return [4 /*yield*/, context.sendActivity(helpMessage)];
            case 18:
                _f.sent();
                _f.label = 19;
            case 19: return [3 /*break*/, 22];
            case 20: return [4 /*yield*/, context.sendActivity(helpMessage)];
            case 21:
                _f.sent();
                return [3 /*break*/, 22];
            case 22:
                if (!(context.request.membersAdded !== undefined)) return [3 /*break*/, 27];
                _i = 0, _e = context.request.membersAdded;
                _f.label = 23;
            case 23:
                if (!(_i < _e.length)) return [3 /*break*/, 27];
                member = _e[_i];
                if (!(member.id !== context.request.recipient.id)) return [3 /*break*/, 26];
                if (!(userState.registered === undefined)) return [3 /*break*/, 25];
                return [4 /*yield*/, addNewsSource_1.registerUser(context)];
            case 24:
                _f.sent();
                return [3 /*break*/, 26];
            case 25:
                userState.registered === undefined;
                _f.label = 26;
            case 26:
                _i++;
                return [3 /*break*/, 23];
            case 27: return [3 /*break*/, 28];
            case 28: return [2 /*return*/];
        }
    });
}); });
