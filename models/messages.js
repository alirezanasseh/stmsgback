const model = require('../components/model');

module.exports = new class Messages {
    entityModel = {
        entity: "messages",
        fields: {
            chat_id: {
                required: true
            },
            sender_id: {
                required: true
            },
            sender_name: {
                required: true
            },
            message: {},
            file_id: {},
            file_name: {},
        }
    };

    model = options => {
        return new model(this.entityModel, options);
    };
};
