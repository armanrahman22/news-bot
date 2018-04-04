module.exports = {
    getListOfValidSources: function () {
        return ['bbc-news', 'bloomberg', 'buzzfeed', 'cnn', 'breitbart-news', 'the-new-york-times', 'fox-news'];
    },
    getFuzzySet: function () {
        return FuzzySet(getListOfValidSources());
    }
};
