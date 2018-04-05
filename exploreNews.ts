import { MyConversationState, MyUserState } from './app';
import { StateContext } from 'botbuilder-botbldr';
import {LuisResult, getEntityOfType} from './luis';
import {NewsAPI} from 'newsapi';

const {MessageFactory, CardFactory, CardAction, ActionTypes} = require('botbuilder');

const NewsSource = require('./newsSource');
const moment = require('moment');

const MONTH = new RegExp("^.{7}$");
const YEAR = new RegExp("^.{4}$");

export interface payloadType {
  sources: string;
  topic: string;
  section: string;
  from: number;
  to: number;
}

export interface articlesResponse {
  articles: 
    { source: [Object],
      author: string,
      title: string,
      description: string,
      url: string,
      urlToImage: string,
      publishedAt: string }[]
}

export async function begin(context: StateContext<MyConversationState, MyUserState>, results: LuisResult, newsapi: NewsAPI) {
  let initiatingSearchMessage = ``;

  // get sources 
  let payload = {
    sources: context.userState.newsSources.join(),
    topic: '',
    section: '',
    from: moment().format("YYYY-MM-DD"),
    to: moment().format("YYYY-MM-DD")
  }
  
  // get topic 
  let topic = getEntityOfType(results, "Topic", 0.3);
  if (topic !== null) {
    payload['topic'] = topic;
    // list the sources we are searching 
    initiatingSearchMessage = `Searching for articles about "${payload['topic']}" from ${payload['sources']} ...`;
  }
  
  // get section 
  let section = getEntityOfType(results, "RegexSection", 0.3);
  if (section!== null) {
    payload['section'] = section;
    initiatingSearchMessage = `Searching for articles in all sources' "${payload['section']}" sections ...`;
  }
  
  // get time range 
  let time = getEntityOfType(results, "builtin_datetimeV2_date", 0.3);
  let timeRange = getEntityOfType(results, "builtin_datetimeV2_daterange", 0.3);
  if (time !== null) {
    payload['from'] = time;
    payload['to'] = time;    
  } else if (timeRange !== null){
    if(MONTH.exec(timeRange.toString())!= null){
      payload['from'] = moment(timeRange).startOf('month').format("YYYY-MM-DD");
      payload['to'] = moment(timeRange).endOf('month').format("YYYY-MM-DD");
    }
  }
  
  if (payload['section'] !== '' || payload['topic'] !== '') {
    await context.sendActivity(initiatingSearchMessage);
    payload['section'] !== '' ? await exploreTopHttpRequest(payload, newsapi, context) 
    : await exploreAllHttpRequest(payload, newsapi, context)
  } else {
    initiatingSearchMessage = `Searcing for articles between ${payload['from']} and ${payload['to']} ... `;
    await context.sendActivity(initiatingSearchMessage);
    await exploreAllHttpRequest(payload, newsapi, context);
  }
}

async function exploreTopHttpRequest(payload: payloadType, newsapi: NewsAPI, context: StateContext<MyConversationState, MyUserState>) {
  const response = await newsapi.v2.topHeadlines({
    //q: encodeURIComponent(payload.topic),
    category: payload.section,
    from: payload.from,
    to: payload.to,
    country: 'us',
    language: 'en',
    sortBy: 'relevancy',
    pageSize:1,
    page: 1
  });
  await displayArticles(context, response.articles);
}

async function exploreAllHttpRequest(payload: payloadType, newsapi: NewsAPI, context: StateContext<MyConversationState, MyUserState>) {
  const response = await newsapi.v2.everything({
    q: encodeURIComponent(payload.topic),
    sources: payload.sources, //'bbc-news,the-verge',
    from: payload.from,
    to: payload.to,
    language: 'en',
    sortBy: 'relevancy',
    pageSize:1,
    page: 1
  });
  await displayArticles(context, response.articles);
}

async function displayArticles(context: StateContext<MyConversationState, MyUserState>, response: articlesResponse) {
  let articleList = [];  
  for (let article of response) {
    articleList.push(CardFactory.heroCard(article.title,[article.urlToImage], [{ type: ActionTypes.openUrl, value: article.url, title: "Click to view article"}]))
  }
  
  if (articleList.length > 0){
    let messageWithCarouselOfCards = MessageFactory.list(articleList);
    await context.sendActivity(messageWithCarouselOfCards);
  } else {
    await context.sendActivity("We couldn't find any articles from these sources.");
  }
}