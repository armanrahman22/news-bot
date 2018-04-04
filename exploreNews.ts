const {MessageFactory, CardFactory} = require('botbuilder');

const NewsSource = require('./newsSource');
const moment = require('moment');

const MONTH = new RegExp("^.{7}$");
const YEAR = new RegExp("^.{4}$");


export async function begin(context, results, state, newsapi) {
    // Set topic and initialize news sources
    state.topic = 'exploreNews';
    let entities = results.entities;
    
    // get sources 
    
    let payload = {
      sources: state.newsSources.join(),
    }

    // get topic 
    if (entities.Topic !== undefined) {
      payload['topic'] = entities.Topic[0];
    } else {
      payload['topic'] = ''
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
    
    exploreHttpRequest(payload, newsapi, context);
}

async function exploreHttpRequest(payload, newsapi, context) {
    const response = await newsapi.v2.everything({
        q: payload.topic,
        sources: payload.sources, //'bbc-news,the-verge',
        from: payload.from,
        to: payload.to,
        language: 'en',
        sortBy: 'relevancy',
        page: 1
      });

      console.log(response.articles);

      const basicMessage = MessageFactory.text('Greetings from example message');
      await context.sendActivity(basicMessage)

        /*
          {
            status: "ok",
            articles: [...]
          }
        */
}