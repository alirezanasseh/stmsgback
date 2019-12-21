const express = require('express');
const router = express.Router();
let multer = require('multer');

let storage = multer.diskStorage({
    destination: (req, file, next) => {
        next(null, 'files');
    },
    filename: (req, file, next) => {
        next(null, Date.now() + '-' + file.originalname)
    }
});
let upload = multer({storage: storage}).single('file');

router.route('/').post(upload, (req, res) => {
    let data = {
        file_name: req.file.filename,
        original_name: req.file.originalname,
        size: req.file.size,
        type: req.file.mimetype
    };
    const entities = require('../models/files').model({token: req.body.token});
    entities.post(data, (err, insertResult) => {
        if(err){
            console.log("File not inserted to DB!", err);
            res.status(err.status).send({note: err.note});
        }else{
            if(insertResult){
                insertResult.file_name = req.file.originalname;
                insertResult.link = global.server + 'download/' + insertResult.id;
                let response = {
                    note: "عملیات با موفقیت انجام شد",
                    data: {
                        count: 1,
                        item: insertResult,
                        list: {}
                    }
                };
                res.status(200).send(response);
            }else{
                res.status(503).send({note: "ارتباط با پایگاه داده برقرار نشد"});
            }
        }
    });
});

module.exports = router;