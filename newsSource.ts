module.exports = { 
    NewsSource: class {
        constructor(source: string) {
            this.source = source;
        }
    },
    getListOfValidSources: function() {
        return ['bbc-news', 'bloomberg', 'buzzfeed', 'cnn', 'breibart-news', 'the-new-york-times', 'fox-news']
    }
};

