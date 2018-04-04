import { MyConversationState, MyUserState } from './app';
import { StateContext } from 'botbuilder-botbldr';
import {LuisResult} from './luis';
const newsSource = require('./newsSource');
const {createChoicePrompt} = require('botbuilder-prompts');

const choicePrompt = createChoicePrompt();

export async function registerUser(context: StateContext<MyConversationState, MyUserState>) {
	context.conversationState.currentOperation = 'addingSource';
	context.userState.newsSources = [];
	context.userState.registered = true;
	await choicePrompt.prompt(context, newsSource.getListOfValidSources(), "Choose a news source to add!");
}

export async function addNewsSourceLuis(context: StateContext<MyConversationState, MyUserState>, results: LuisResult ){
	// get entities
	if(results.entities !== undefined) {
		for(let source of results.entities) {
			let match = newsSource.getBestmatch(source.entity);
			(match !== null) ? newsSource.addSource(context.userState, match) : await context.sendActivity(`Didn't recognize ${source.entity}`);
		}
		await context.sendActivity("News source(s) added! Now you can ask questions");
	} else {
		context.conversationState.currentOperation = 'addingSource';
		await choicePrompt.prompt(context, newsSource.getUnaddedSources(context.userState), "Response not recognized. Please choose from the following:");
	}
}

export async function addNewsSourceChoice(context: StateContext<MyConversationState, MyUserState>){
	choicePrompt.recognize(context, newsSource.getUnaddedSources(context.userState)).then((choice) => {
		newsSource.addSource(context.userState, choice.value); 
	});
	context.conversationState.currentOperation = undefined;
	await context.sendActivity("News source added! Now you can ask questions")
}

