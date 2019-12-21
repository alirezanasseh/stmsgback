const express = require('express');
const router = express.Router();

router.route('/:id').get((req, res) => {
    let id = req.params.id;
    if(id){
        const entities = require('../models/files').model({noAccessCheck: true});
        entities.getOneById(id, (err, fileResult) => {
            if(err){
                res.status(err.status).send(res.note);
            }else{
                if(fileResult){
                    res.download('./files/' + fileResult.file_name, fileResult.original_name);
                }else {
                    res.status(400).send({note: "فایل مورد نظر پیدا نشد"});
                }
            }
        });
    }
});

module.exports = router;