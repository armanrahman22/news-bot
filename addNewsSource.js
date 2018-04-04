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
var newsSource = require('./newsSource');
var createChoicePrompt = require('botbuilder-prompts').createChoicePrompt;
var choicePrompt = createChoicePrompt();
function registerUser(context) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    context.conversationState.currentOperation = 'addingSource';
                    context.userState.newsSources = [];
                    context.userState.registered = true;
                    return [4 /*yield*/, choicePrompt.prompt(context, newsSource.getListOfValidSources(), "Choose a news source to add!")];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.registerUser = registerUser;
function addNewsSourceLuis(context, results) {
    return __awaiter(this, void 0, void 0, function () {
        var _i, _a, source, match, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!(results.entities !== undefined)) return [3 /*break*/, 8];
                    _i = 0, _a = results.entities;
                    _c.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3 /*break*/, 6];
                    source = _a[_i];
                    match = newsSource.getBestmatch(source.entity);
                    if (!(match !== null)) return [3 /*break*/, 2];
                    _b = newsSource.addSource(context.userState, match);
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, context.sendActivity("Didn't recognize " + source.entity)];
                case 3:
                    _b = _c.sent();
                    _c.label = 4;
                case 4:
                    _b;
                    _c.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 1];
                case 6: return [4 /*yield*/, context.sendActivity("News source(s) added! Now you can ask questions")];
                case 7:
                    _c.sent();
                    return [3 /*break*/, 10];
                case 8:
                    context.conversationState.currentOperation = 'addingSource';
                    return [4 /*yield*/, choicePrompt.prompt(context, newsSource.getUnaddedSources(context.userState), "Response not recognized. Please choose from the following:")];
                case 9:
                    _c.sent();
                    _c.label = 10;
                case 10: return [2 /*return*/];
            }
        });
    });
}
exports.addNewsSourceLuis = addNewsSourceLuis;
function addNewsSourceChoice(context) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    choicePrompt.recognize(context, newsSource.getUnaddedSources(context.userState)).then(function (choice) {
                        newsSource.addSource(context.userState, choice.value);
                    });
                    context.conversationState.currentOperation = undefined;
                    return [4 /*yield*/, context.sendActivity("News source added! Now you can ask questions")];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.addNewsSourceChoice = addNewsSourceChoice;
