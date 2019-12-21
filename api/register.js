const express = require('express');
const router = express.Router();
const userModel = require('../models/users').model({noAccessCheck: true});

router.route('/').post((req, res) => {
    let user = req.body;
    if(!user.name || !user.mobile || !user.password){
        res.status(400).send({note: "فیلدهای اجباری را وارد کنید"});
    }else{
        userModel.getOneByCondition({mobile: user.mobile}, (err, userResult) => {
            if(err){
                res.status(err.status).send({note: err.note});
            }else{
                if(userResult){
                    res.status(409).send({note: "شماره موبایل تکراری است."});
                }else{
                    user.role = 'user';
                    userModel.post(user, (err, insertResult) => {
                        if(err){
                            res.status(err.status).send({note: err.note});
                        }else{
                            res.status(200).send({note: "عملیات با موفقیت انجام شد"});
                        }
                    });
                }
            }
        });
    }
});

module.exports = router;