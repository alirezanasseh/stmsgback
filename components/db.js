const MongoClient = require('mongodb').MongoClient;
const {ObjectId} = require('mongodb');
const url = "mongodb://root:xvTEl4LiGTSyDztVDUGHdDHW@s7.liara.ir:32317/my-app?authSource=admin";
const database = "smsg";

module.exports = class DB {
    
    insertOne(props, next){
        MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, (err, db) => {
            if (err){
                next(err);
            }else{
                let dbo = db.db(database);
                let data = props.data;
                let tzOffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
                data.create_date = (new Date(Date.now() - tzOffset)).toISOString();
                data.last_update = (new Date(Date.now() - tzOffset)).toISOString();
                dbo.collection(props.collection).insertOne(props.data, (err, res) => {
                    if (err){
                        next(err);
                    }else{
                        next(null, res);
                        db.close();
                    }
                });
            }
        });
    }

    getOne(props, next){
        MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, (err, db) => {
            if (err){
                next(err);
            }else{
                let dbo = db.db(database);
                if(props.query['_id']){
                    props.query['_id'] = ObjectId(props.query['_id']);
                }
                dbo.collection(props.collection).findOne(props.query, (err, result) => {
                    if (err){
                        next(err);
                    }else{
                        next(null, result);
                        db.close();
                    }
                });
            }
        });
    }

    getMany(props, next){
        MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, (err, db) => {
            if (err){
                next(err);
            }else{
                let dbo = db.db(database);
                if(!props.limit){
                    props.limit = 0;
                }
                dbo.collection(props.collection).find(props.query).count((e, count) => {
                    dbo.collection(props.collection).find(props.query).sort(props.sort).limit(parseInt(props.limit)).skip(props.page > 0 ? (props.page - 1) * props.limit : 0).toArray((err, result) => {
                        if(err){
                            next(err);
                        }else{
                            next(null, result, count);
                            db.close();
                        }
                    });
                });
            }
        });
    }

    updateOne(props, next){
        MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, (err, db) => {
            if(err){
                next(err);
            }else{
                let dbo = db.db(database);
                let tzOffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
                props.values.last_update = (new Date(Date.now() - tzOffset)).toISOString();
                let values = {$set: props.values};
                if(props.query['_id']){
                    props.query['_id'] = ObjectId(props.query['_id']);
                }
                dbo.collection(props.collection).updateOne(props.query, values, (err, res) => {
                    if(err){
                        next(err);
                    }else{
                        next(null, res);
                        db.close();
                    }
                });
            }
        });
    }

    deleteOne(props, next){
        MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, (err, db) => {
            if(err){
                next(err);
            }else{
                let dbo = db.db(database);
                if(props.query['_id']){
                    props.query['_id'] = ObjectId(props.query['_id']);
                }
                dbo.collection(props.collection).deleteOne(props.query, (err, obj) => {
                    if(err){
                        next(err);
                    }else{
                        next(null, {status: 'true'});
                        db.close();
                    }
                });
            }
        });
    }
}