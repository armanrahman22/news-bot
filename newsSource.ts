module.exports = { 
    NewsSource: class {
        constructor(source: string) {
            this.source = source;
        }
    },
    getListOfValidSources: function() {
        return ['New York Times', 'NPR']
    }
};

