module.exports = {
    NewsSource: /** @class */ (function () {
        function class_1(source) {
            this.source = source;
        }
        return class_1;
    }()),
    getListOfValidSources: function () {
        return ['New York Times', 'NPR'];
    }
};
