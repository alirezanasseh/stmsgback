const model = require('../components/model');

module.exports = new class Users {
    entityModel = {
        entity: "users",
        fields: {
            pic: {},
            name: {
                required: true,
                max_length: 100
            },
            gender: {},
            country_id: {},
            city_id: {},
            address: {},
            lat: {},
            lon: {},
            email: {
                max_length: 100
            },
            mobile: {
                required: true,
                max_length: 20
            },
            password: {
                required: true,
                min_length: 3,
                max_length: 100
            },
            instagram: {},
            education: {},
            specialties: {},
            skills: {},
            job: {},
            bio: {},
            referrer_id: {},
            role: {}
        }
    };

    model = options => {
        return new model(this.entityModel, options);
    };
};
