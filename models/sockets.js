const model = require('../components/model');

module.exports = new class Chats {
    entityModel = {
        entity: "sockets",
        fields: {
            socket_id: {},
            token: {},
            user_id: {}
        }
    };

    model = options => {
        return new model(this.entityModel, options);
    };
};
