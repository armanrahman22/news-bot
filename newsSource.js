module.exports = {
    NewsSource: /** @class */ (function () {
        function class_1(source) {
            this.source = source;
        }
        return class_1;
    }()),
    getListOfValidSources: function () {
        return ['bbc-news', 'bloomberg', 'buzzfeed', 'cnn', 'breibart-news', 'the-new-york-times', 'fox-news'];
    }
};
