const express = require('express');
const router = express.Router();

router.route('/')
    .get((req, res) => {
        let token = req.query.token;
        delete req.query['token'];
        let entities = require('../models' + req.baseUrl).model({token: token});
        entities.getMany(req.query, (err, result, count) => {
            if(err){
                res.status(err.status).send({note: err.note});
            }else{
                let response = {
                    note: "عملیات با موفقیت انجام شد",
                    data: {
                        count: count,
                        item: {},
                        list: result
                    }
                };
                res.status(200).send(response);
            }
        });
    })
    .post((req, res) => {
        let entities = require('../models' + req.baseUrl).model({token: req.body.token});
        entities.post(req.body, (err, result) => {
            if(err){
                res.status(err.status).send({note: err.note});
            }else{
                res.status(200).send(result);
            }
        });
    })
    .put((req, res) => {
        let entities = require('../models' + req.baseUrl).model({token: req.body.token});
        entities.put(req.body, (err, result) => {
            if(err){
                res.status(err.status).send({note: err.note});
            }else{
                res.status(200).send(result);
            }
        });
    });
router.route('/:id')
    .get((req, res) => {
        let query = req.query;
        query.id = req.params.id;
        let token = query.token;
        delete req.query['token'];
        let entities = require('../models' + req.baseUrl).model({token: token});
        entities.getOneByCondition(query, (err, result) => {
            if(err){
                res.status(err.status).send({note: err.note});
            }else{
                let response = {
                    note: "عملیات با موفقیت انجام شد",
                    data: {
                        count: 1,
                        item: result,
                        list: {}
                    }
                };
                res.status(200).send(response);
            }
        });
    })
    .delete((req, res) => {
        let entities = require('../models' + req.baseUrl).model({token: req.params.token});
        entities.delete(req.params.id, (err, result) => {
            if(err){
                res.status(err.status).send({note: err.note});
            }else{
                res.status(200).send(result);
            }
        });
    });

module.exports = router;