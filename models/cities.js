const model = require('../components/model');

module.exports = new class Chats {
    entityModel = {
        entity: "cities",
        fields: {
            country_id: {},
            name: {},
        }
    };

    model = options => {
        return new model(this.entityModel, options);
    };
};
