const model = require('../components/model');

module.exports = new class Chats {
    entityModel = {
        entity: "permissions",
        fields: {
            role: {},
            entity: {},
            limit: {},
            allow: {},
            get: {},
            post: {},
            put_query: {},
            put_set: {},
            delete: {},
        }
    };

    model = options => {
        return new model(this.entityModel, options);
    };
};
