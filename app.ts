const { BotFrameworkAdapter, ConversationState, MemoryStorage, MessageFactory } = require('botbuilder');
const { createNumberPrompt, createChoicePrompt} = require('botbuilder-prompts');
const { LuisRecognizer } = require('botbuilder-ai');
const restify = require('restify');
const addNewsSource = require('./addNewsSource');
const exploreNews = require('./exploreNews');

const newsSource = require('./newsSource');
require('dotenv').load();
const NewsAPI = require('newsapi');
const newsapi = new NewsAPI(process.env.WALLSTREET_API_KEY);

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

const model = new LuisRecognizer({
    appId: 'b9ce968b-48fb-4d7c-9d9c-bd161a5a7215',
    subscriptionKey: '962402c19f2c42d6a10e965d248ad3d9',
    serviceEndpoint: 'https://westus.api.cognitive.microsoft.com'
});

const helpMessage = MessageFactory.text(`Hi! I'm a simple news bot. \n 
    Start by adding news sources by saying for example 'add the New York Times to my sources'. \n
    You can find stories by saying for example 'What happened in Syria recently?'. \n
    You can find stories by specific journalists by saying for example 'Find recent articles by Jeremy Scahill'.`);

// Add conversation state middleware
const conversationState = new ConversationState(new MemoryStorage()); 
const choicePrompt = createChoicePrompt();
adapter.use(conversationState);
adapter.use(model);

// Listen for incoming requests 
server.post('/api/messages', (req, res) => {
    // Route received request to adapter for processing
    adapter.processRequest(req, res, async (context) => {
        switch (context.request.type) {
            case 'message' :
                const results = model.get(context);
                const state = conversationState.get(context);
                switch (state.topic){
                    case undefined:
                        await choicePrompt.prompt(context, newsSource.getListOfValidSources(), "Choose a news source to add!");
                        break;
                    case 'registered':
                        switch (LuisRecognizer.topIntent(results)) {
                            case 'AddNewsSource':
                                await addNewsSource.begin(context, results, state);
                                break;
                            case 'ExploreNews':
                                await addNewsSource.begin(context, results, state);
                                break;
                            default:
                                await context.sendActivity(helpMessage);
                                break;
                        }
                    default:
                        await context.sendActivity(helpMessage);
                        break;    
                }
        }
    });
});