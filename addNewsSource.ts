
const NewsSource = require('./newsSource')

export async function begin(context, state) {
    // Set topic and initialize news sources
    state.topic = 'addNewsSource';
    if (state.newsSources === undefined) {
        console.log("newsSources");
        state.newsSources = {};
    }

    if(state.currentSource === undefined) {
        console.log("currentSource");
        state.currentSource = new NewsSource();
    }
    
    // Prompt for first field
    await nextField(context, state);
}

export async function routeReply(context, state) {
    console.log("routeReply");
    // Handle users reply to prompt
    const utterance = context.request.text.trim();
    switch (state.prompt) {
        case 'newsSource':
            state.currentSource.source = utterance;
            break;
        case 'subjects':
            state.currentSource.subjects = utterance;
            break;
    }
    // Prompt for next field
    await nextField(context, state);
}

async function nextField(context, state) {
    // Prompt user for next missing field
    const newsSource = state.currentSource;
    if (newsSource.source === undefined) {
        console.log("source");
        state.prompt = 'newsSource';
        await context.sendActivity(`Which news source would you like to add?`);
    } else if (newsSource.subjects === undefined) {
        console.log("subjects");
        state.prompt = 'subjects';
        await context.sendActivity(`What subjects would you like to follow?`);
    } else {
        state.newsSources.push(newsSource);

        state.topic = undefined;
        state.newsSource = undefined;
        state.prompt = undefined;
        await context.sendActivity(`Your news source "${newsSource.source}" has been added with subjects "${newsSource.subjects}".`);
    }
}