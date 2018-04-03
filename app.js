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
var _a = require('botbuilder'), BotFrameworkAdapter = _a.BotFrameworkAdapter, ConversationState = _a.ConversationState, MemoryStorage = _a.MemoryStorage;
var _b = require('botbuilder-prompts'), createNumberPrompt = _b.createNumberPrompt, createChoicePrompt = _b.createChoicePrompt;
var restify = require('restify');
var addNewsSource = require('./addNewsSource');
// Create server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log(server.name + " listening to " + server.url);
});
// Create adapter (it's ok for MICROSOFT_APP_ID and MICROSOFT_APP_PASSWORD to be blank for now)  
var adapter = new BotFrameworkAdapter({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
// Add conversation state middleware
var conversationState = new ConversationState(new MemoryStorage());
adapter.use(conversationState);
// Listen for incoming requests 
server.post('/api/messages', function (req, res) {
    // Route received request to adapter for processing
    adapter.processRequest(req, res, function (context) { return __awaiter(_this, void 0, void 0, function () {
        var _a, utterance, state, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = context.request.type;
                    switch (_a) {
                        case 'message': return [3 /*break*/, 1];
                    }
                    return [3 /*break*/, 8];
                case 1:
                    utterance = (context.request.text || '').trim().toLowerCase();
                    console.log(utterance);
                    state = conversationState.get(context);
                    if (!utterance.includes('add news source')) return [3 /*break*/, 3];
                    return [4 /*yield*/, addNewsSource.begin(context, state)];
                case 2:
                    _c.sent();
                    return [3 /*break*/, 8];
                case 3:
                    console.log(state.topic);
                    _b = state.topic;
                    switch (_b) {
                        case 'addNewsSource': return [3 /*break*/, 4];
                    }
                    return [3 /*break*/, 6];
                case 4: return [4 /*yield*/, addNewsSource.routeReply(context, state)];
                case 5:
                    _c.sent();
                    return [3 /*break*/, 8];
                case 6: return [4 /*yield*/, context.sendActivity("Hi! I'm a simple alarm bot. Say \"add alarm\", \"delete alarm\", or \"show alarms\".")];
                case 7:
                    _c.sent();
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    }); });
});
