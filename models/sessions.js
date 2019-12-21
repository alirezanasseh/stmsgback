const model = require('../components/model');

module.exports = new class Chats {
    entityModel = {
        entity: "sessions",
        fields: {
            user_id: {
                required: true
            },
            device: {},
            token: {
                required: true
            }
        }
    };

    model = options => {
        return new model(this.entityModel, options);
    };
};
