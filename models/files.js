const model = require('../components/model');

module.exports = new class Chats {
    entityModel = {
        entity: "files",
        fields: {
            file_name: {
                required: true,
                max_length: 200
            },
            original_name: {
                required: true,
                max_length: 200
            },
            size: {},
            type: {}
        }
    };

    model = options => {
        return new model(this.entityModel, options);
    };
};
