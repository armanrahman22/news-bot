
const NewsSource = require('./newsSource')

export async function begin(context, results, state) {
    // Set topic and initialize news sources
    state.topic = 'addNewsSource';
    if (state.newsSources === undefined) {
        console.log("newsSources");
        state.newsSources = {};
    }

    if(state.currentSource === undefined) {
        console.log("currentSource");
        const source = results.entities.NewsOutlet[0]
        console.log(source);
        state.currentSource = new NewsSource();
    }
}