const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
let jwt = require('jsonwebtoken');
let fs = require('fs');
const userModel = require('../models/users').model({noAccessCheck: true, innerRequest: true});
const sessionModel = require('../models/sessions').model({noAccessCheck: true});

router.route('/').post((req, res) => {
	let user = req.body;
	if(req.body.mobile && req.body.password){
		userModel.getOneByCondition({mobile: user.mobile}, (err, userResult) => {
            if(err){
                res.status(err.status).send({note: err.note});
            }else{
                if(userResult){
                    bcrypt.compare(user.password, userResult.password, (err, compareResult) => {
                        if(err){
                            res.status(503).send({note: "خطای سیستمی رخ داد"});
                        }else{
                            if(compareResult){
                                let privateKey = fs.readFileSync('./pv.key');
                                jwt.sign({userId: userResult._id}, privateKey, {algorithm: 'RS256'}, (err, token) => {
                                    if(err){
                                        res.status(503).send({note: err.message});
                                    }else{
                                        let data = {
                                            user_id: userResult._id,
                                            token,
                                            device: user.device
                                        };
                                        sessionModel.post(data, (err, insertResult) => {
                                            if(err){
                                                res.status(err.status).send({note: err.note});
                                            }else{
                                                res.status(200).send({token: token, user_name: userResult.name});
                                            }
										});
                                    }
                                });
                            }else{
                                res.status(401).send({note: "رمز عبور اشتباه است"});
                            }
                        }
                    });
                }else{
                    res.status(401).send({note: "این موبایل در سیستم وجود ندارد. لطفاً ابتدا عضو شوید."});
                }
            }
		});
	}else{
		res.status(400).send({note: "شماره موبایل و رمز عبور را وارد کنید"});
	}
});

module.exports = router;