const {MessageFactory, CardFactory, CardAction, ActionTypes} = require('botbuilder');

const NewsSource = require('./newsSource');
const moment = require('moment');

const MONTH = new RegExp("^.{7}$");
const YEAR = new RegExp("^.{4}$");


export async function begin(context, results, state, newsapi) {
  // Set topic and initialize news sources
  let entities = results.entities;
  console.log(entities);

  // get sources 
  let payload = {
    sources: state.newsSources.join(),
  }

  let initiatingSearchMessage = ``;
  
  // get topic 
  if (entities.Topic !== undefined) {
    payload['topic'] = entities.Topic[0];
    // list the sources we are searching 
    initiatingSearchMessage = `Searching for articles about "${payload['topic']}" from ${payload['sources']} ...`;
  } else {
    payload['topic'] = ''
  }

  // get section 
  if (entities.RegexSection !== undefined) {
    payload['section'] = entities.RegexSection[0][0];
    initiatingSearchMessage = `Searching for articles in all sources' "${payload['section']}" sections ...`;
  } else {
    payload['section'] = ''
  }
  
  // get time range 
  if (entities.builtin_datetimeV2_date !== undefined) {
    payload['from'] = entities.builtin_datetimeV2_date;
    payload['to'] = entities.builtin_datetimeV2_date;    
  } else if (entities.builtin_datetimeV2_daterange !== undefined){
    let range = entities.builtin_datetimeV2_daterange[0];
    if(MONTH.exec(range.toString())!= null){
      payload['from'] = moment(range).startOf('month').format("YYYY-MM-DD");
      payload['to'] = moment(range).endOf('month').format("YYYY-MM-DD");
    }
  } else {
    payload['from'] = moment().format("YYYY-MM-DD");
    payload['to'] = moment().format("YYYY-MM-DD");
  }

  if (payload['section'] !=='' || 
      payload['topic'] !=='') {
      await context.sendActivity(initiatingSearchMessage);
      payload['section'] !=='' ? await exploreTopHttpRequest(payload, newsapi, context) 
                                        : await exploreAllHttpRequest(payload, newsapi, context)
  } else {
      initiatingSearchMessage = `Searcing for articles between ${payload['from']} and ${payload['to']} ... `;
      await context.sendActivity(initiatingSearchMessage);
      await exploreAllHttpRequest(payload, newsapi, context);
  }
}

async function exploreTopHttpRequest(payload, newsapi, context) {
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
  await displayArticles(context, response);
}

async function exploreAllHttpRequest(payload, newsapi, context) {
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
  await displayArticles(context, response);
}

async function displayArticles(context, response) {
  let articleList = [];  

  for (let article in response.articles) {
    let obj = response.articles[article];
    articleList.push(CardFactory.heroCard(obj.title,[obj.urlToImage], [{ type: ActionTypes.openUrl, value: obj.url, title: "Click to view article"}]))
  }

  if (articleList.length > 0){
    let messageWithCarouselOfCards = MessageFactory.list(articleList);
    await context.sendActivity(messageWithCarouselOfCards);
  } else {
    await context.sendActivity("We couldn't find any articles from these sources.");
  }
}