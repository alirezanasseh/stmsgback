const model = require('../components/model');

module.exports = new class Chats {
    entityModel = {
        entity: "countries",
        fields: {
            name: {},
        }
    };

    model = options => {
        return new model(this.entityModel, options);
    };
};
