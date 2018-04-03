const NewsSource = require('./newsSource');
const moment = require('moment');

const regex = /^.{7}$/g;

export async function begin(context, results, state) {
    // Set topic and initialize news sources
    state.topic = 'exploreNews';
    let entities = results.entities;
    console.log(moment(entities.builtin_datetimeV2_date[0]));
    let payload = {
      sources: state.newsSources.join(',')
    }
    if (entities.builtin_datetimeV2_date !== undefined) {
      payload['from'] = entities.builtin_datetimeV2_date;
      payload['to'] = entities.builtin_datetimeV2_date;
    }
    if (entities.builtin_datetimeV2_daterange !== undefined){
      if()

    }
    if (entities.Topic !== undefined) {

    }
    
    // exploreHttpRequest(payload);
}

function exploreHttpRequest(payload) {
    console.log("in explore news");
    newsapi.v2.everything({
        sources: payload.sources, //'bbc-news,the-verge',
        from: '2018-04-01',
        to: '2018-04-03',
        language: 'en',
        sortBy: 'relevancy',
        page: 1
      }).then(response => {
        console.log(response);
        /*
          {
            status: "ok",
            articles: [...]
          }
        */
      });    
}