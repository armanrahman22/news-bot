const NewsSource = require('./newsSource')

export async function begin(context, results, state) {
    // Set topic and initialize news sources
    state.topic = 'exploreNews';
    console.log(results.entities);
    payload = {
            sources: state.newsSources.join(','),
        }
    exploreHttpRequest(payload);
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