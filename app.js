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
var _a = require('botbuilder'), BotFrameworkAdapter = _a.BotFrameworkAdapter, ConversationState = _a.ConversationState, MemoryStorage = _a.MemoryStorage, MessageFactory = _a.MessageFactory;
var _b = require('botbuilder-prompts'), createNumberPrompt = _b.createNumberPrompt, createChoicePrompt = _b.createChoicePrompt;
var LuisRecognizer = require('botbuilder-ai').LuisRecognizer;
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
var model = new LuisRecognizer({
    appId: 'b9ce968b-48fb-4d7c-9d9c-bd161a5a7215',
    subscriptionKey: '962402c19f2c42d6a10e965d248ad3d9',
    serviceEndpoint: 'https://westus.api.cognitive.microsoft.com'
});
var helpMessage = MessageFactory.text("Hi! I'm a simple news bot. \n \n    Start by adding news sources by saying for example 'add the New York Times to my sources'. \n\n    You can find stories by saying for example 'What happened in Syria recently?'. \n\n    You can find stories by specific journalists by saying for example 'Find recent articles by Jeremy Scahill'.");
// Add conversation state middleware
var conversationState = new ConversationState(new MemoryStorage());
adapter.use(conversationState);
adapter.use(model);
// Listen for incoming requests 
server.post('/api/messages', function (req, res) {
    // Route received request to adapter for processing
    adapter.processRequest(req, res, function (context) { return __awaiter(_this, void 0, void 0, function () {
        var _a, results, state, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _a = context.request.type;
                    switch (_a) {
                        case 'message': return [3 /*break*/, 1];
                    }
                    return [3 /*break*/, 12];
                case 1:
                    results = model.get(context);
                    state = conversationState.get(context);
                    if (!(state.topic === undefined)) return [3 /*break*/, 7];
                    _b = LuisRecognizer.topIntent(results);
                    switch (_b) {
                        case 'AddNewsSource': return [3 /*break*/, 2];
                    }
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, addNewsSource.begin(results, state)];
                case 3:
                    _d.sent();
                    return [3 /*break*/, 6];
                case 4: return [4 /*yield*/, context.sendActivity(helpMessage)];
                case 5:
                    _d.sent();
                    return [3 /*break*/, 6];
                case 6: return [3 /*break*/, 12];
                case 7:
                    _c = state.topic;
                    switch (_c) {
                        case 'AddNewsSource': return [3 /*break*/, 8];
                    }
                    return [3 /*break*/, 10];
                case 8: return [4 /*yield*/, addNewsSource.routeReply(context, state)];
                case 9:
                    _d.sent();
                    return [3 /*break*/, 12];
                case 10: return [4 /*yield*/, context.sendActivity(helpMessage)];
                case 11:
                    _d.sent();
                    return [3 /*break*/, 12];
                case 12: return [2 /*return*/];
            }
        });
    }); });
});
