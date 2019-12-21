const model = require('../components/model');

module.exports = new class Chats {
    entityModel = {
        entity: "chats",
        fields: {
            name: {
                required: true,
                max_length: 200
            },
            users: {
                required: true
            }
        }
    };

    model = options => {
        return new model(this.entityModel, options);
    };
};
