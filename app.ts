const { BotFrameworkAdapter, ConversationState, MemoryStorage } = require('botbuilder');
const { createNumberPrompt, createChoicePrompt} = require('botbuilder-prompts');
const restify = require('restify');
const addNewsSource = require('./addNewsSource')

// Create server
let server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log(`${server.name} listening to ${server.url}`);
});

// Create adapter (it's ok for MICROSOFT_APP_ID and MICROSOFT_APP_PASSWORD to be blank for now)  
const adapter = new BotFrameworkAdapter({ 
    appId: process.env.MICROSOFT_APP_ID, 
    appPassword: process.env.MICROSOFT_APP_PASSWORD 
});

// Add conversation state middleware
const conversationState = new ConversationState(new MemoryStorage()); 
adapter.use(conversationState);

// Listen for incoming requests 
server.post('/api/messages', (req, res) => {
    // Route received request to adapter for processing
    adapter.processRequest(req, res, async (context) => {
        switch (context.request.type) {
            case 'message' :
                const utterance = (context.request.text || '').trim().toLowerCase();
                console.log(utterance);
                const state = conversationState.get(context);
                if (utterance.includes('add news source')) {
                    await addNewsSource.begin(context, state);
                } else {
                    console.log(state.topic);
                    switch (state.topic) {
                        case 'addNewsSource':
                            await addNewsSource.routeReply(context, state);
                            break;
                        default:
                            await context.sendActivity(`Hi! I'm a simple alarm bot. Say "add alarm", "delete alarm", or "show alarms".`);
                            break;
                    }
                }
        }
    });
});