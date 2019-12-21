const sessionModel = require('../models/sessions').model({innerRequest: true, noAccessCheck: true});
const userModel = require('../models/users').model({innerRequest: true, noAccessCheck: true});

module.exports = (token, next) => {
    sessionModel.getOneByCondition({token: token}, (err, sesResult) => {
        if(err){
            next(err);
        }else{
            if(sesResult){
                userModel.getOneById(sesResult.user_id, (err, userResult) => {
                    if(err){
                        next(err);
                    }else{
                        if(userResult){
                            next(null, userResult);
                        }else{
                            next({status: 404, note: "User not found!"});
                        }
                    }
                });
            }else{

            }
        }
    });
};