const db = require('./db');
const bcrypt = require('bcrypt');
const saltRound = 10;

module.exports = class Before {
    constructor(props){
        this.model = props.model;
        this.fields = props.fields;
        this.method = props.method;
        this.options = props.options;
    }

    mount = (next) => {
        this.accessControl(err => {
            if(err){
                next(err);
            }else{
                if(this.method === 'post' || this.method === 'put') {
                    this.validateFields((err, fields) => {
                        if (err) {
                            next(err);
                        } else {
                            if (this.model.entity === "users") {
                                if (fields["password"]) {
                                    this.hashPassword(fields.password, (err, hash) => {
                                        if (err) {
                                            next(err);
                                        } else {
                                            fields.password = hash;
                                            next(null, fields);
                                        }
                                    });
                                }else{
                                    next(null, fields);
                                }
                            } else {
                                next(null, fields);
                            }
                        }
                    });
                }else if(this.method === 'get'){
                    delete this.fields['locale'];
                    if(this.fields['id']){
                        this.fields['_id'] = this.fields.id;
                        delete this.fields['id'];
                    }
                    next(null, this.fields);
                }else{
                    next(null, this.fields);
                }
            }
        });
    };

    accessControl = next => {
        if(this.options.noAccessCheck){
            next(null);
        }else{
            let myDB = new db();
            // Check token
            myDB.getOne({
                collection: 'sessions',
                query: {token: this.options.token}
            }, (err, sesResult) => {
                if(err){
                    next({status: 500, note: "ارتباط با پایگاه داده برقرار نشد"});
                }else{
                    if(sesResult){
                        // Check user
                        myDB.getOne({
                            collection: "users",
                            query: {_id: sesResult.user_id}
                        }, (err, userResult) => {
                            if(err){
                                next({status: 500, note: "ارتباط با پایگاه داده برقرار نشد"});
                            }else{
                                if(userResult){
                                    // Check permissions by user role
                                    myDB.getOne({
                                        collection: "permissions",
                                        query: {role: userResult.role, allow: {$in: [this.method]}}
                                    }, (err, permResult) => {
                                        if(err){
                                            next({status: 500, note: "ارتباط با پایگاه داده برقرار نشد"});
                                        }else{
                                            if(permResult){
                                                next(null)
                                            }else{
                                                next({status: 403, note: "شما به این بخش دسترسی ندارید"});
                                            }
                                        }
                                    });
                                }else{
                                    next({status: 401, note: "دسترسی مجاز نیست، لطفاً وارد شوید"});
                                }
                            }
                        });
                    }else{
                        next({status: 401, note: "دسترسی مجاز نیست، لطفاً وارد شوید"});
                    }
                }
            });
        }
    };

    validateFields = (next) => {
        let new_fields = {};
        let error_note = '';
        for(let field of Object.entries(this.model.fields)){
            if(this.fields[field[0]]){
                let max_length = field[1].max_length;
                let min_length = field[1].min_length;
                let length = field[1].length;
                if(min_length){
                    if(this.fields[field[0]].length < min_length){
                        error_note = "طول فیلد " + field[0] + " حداقل " + min_length + " می تواند باشد.";
                        break;
                    }
                }
                if(max_length){
                    if(this.fields[field[0]].length > max_length){
                        error_note = "طول فیلد " + field[0] + " حداکثر " + max_length + " می تواند باشد.";
                        break;
                    }
                }
                if(length){
                    if(this.fields[field[0]].length !== length){
                        error_note = "طول فیلد " + field[0] + " باید " + length + " باشد.";
                        break;
                    }
                }
                new_fields[field[0]] = this.fields[field[0]];
            }else{
                if(field[1].required){
                    if(this.model.entity !== "users" || this.method !== "put" || field[0] !== "password"){
                        error_note = "فیلد " + field[0] + " الزامی است.";
                    }
                    break;
                }
            }
        }
        if(error_note){
            next({
                status: 400,
                note: error_note
            });
        }else{
            next(null, new_fields);
        }
    };

    hashPassword = (purePass, next) => {
        bcrypt.genSalt(saltRound, (err, salt) => {
            if(err){
                next({status: 500, note: "خطای سیستمی رخ داد"});
            }else{
                bcrypt.hash(purePass, salt, (err, hash) => {
                    if(err){
                        next({status: 500, note: "خطای سیستمی رخ داد"});
                    }else{
                        next(null, hash);
                    }
                });
            }
        });
    };
};