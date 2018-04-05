const { MemoryStorage, MessageFactory } = require('botbuilder');
const { LuisRecognizer } = require('botbuilder-ai');
const newsSource = require('./newsSource');
const exploreNews = require('./exploreNews');
const NewsAPI = require('newsapi');
const querystring = require('querystring');
import {ServiceBot} from 'botbuilder-botbldr';
import {getLuisResults, LuisResult} from './luis';
import {registerUser, addNewsSourceLuis, addNewsSourceChoice} from './addNewsSource';

require('dotenv').load();
const newsapi = new NewsAPI(process.env.API_KEY);

const helpMessage = MessageFactory.text(`
    Hi! I'm a news bot. \n 
    Start by adding news sources by saying for example 'add the New York Times to my sources'. \n
    You can find stories by saying for example 'What happened in Syria recently?'. \n
    You can find stories by specific journalists by saying for example 'Find recent articles by Jeremy Scahill'.`);

export interface MyConversationState {
    topic: string;
    currentOperation: string;
}

export interface MyUserState {
    registered: boolean;
    newsSources: string[];
}

const bot = new ServiceBot<MyConversationState, MyUserState>();

bot.onRequest(async context => {
    const convoState = context.conversationState;
    const userState = context.userState;
    switch (context.request.type) {
        case 'message' :
            switch (userState.registered){
                // when new user 
                case undefined:
                    await registerUser(context);
                    break;
                case true:
                    const luisResults: LuisResult = await getLuisResults(context.request.text);
                    if(convoState.currentOperation !== undefined ){
                        switch (convoState.currentOperation){
                            case 'addingSource':
                                await addNewsSourceChoice(context);
                        }
                    } else if (luisResults !== null) {
                        switch (luisResults.topScoringIntent.intent) {
                            case 'AddNewsSource':
                                await addNewsSourceLuis(context, luisResults);
                                break;
                            case 'Explore':
                                await exploreNews.begin(context, luisResults, newsapi);
                                break;
                            default:
                                await context.sendActivity(helpMessage);
                                break;
                        }
                    } else {
                        await context.sendActivity(helpMessage);
                    }
                    break;
                default:
                    await context.sendActivity(helpMessage);
                    break;    
            }
        case 'conversationUpdate':
            if (context.request.membersAdded !== undefined){
                for (const member of context.request.membersAdded) {
                    if (member.id !== context.request.recipient.id){
                        if(userState.registered === undefined){
                            await registerUser(context);
                        } else {
                            userState.registered === undefined
                            // await context.sendActivity("Welcome Back!");
                        }
                    }
                }
            }
            break;   
    }
});