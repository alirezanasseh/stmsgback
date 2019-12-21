const db = require('./db');
const before = require('./before');
const after = require('./after');

module.exports = class Model {
	constructor(props, options = {}){
		this.entity = props.entity;
		this.fields = props.fields;
		this.options = options;
	}

    getOneById = (id, next) => {
        let bg = new before({
            model: {
                entity: this.entity,
                fields: this.fields
            },
            fields: {_id: id},
            method: 'get',
            options: this.options
        });
        bg.mount((err, fields) => {
            if (err) {
                next(err);
            } else {
                let myDB = new db();
                myDB.getOne({
                    collection: this.entity,
                    query: {_id: id}
                }, (err, result) => {
                    if(err){
                        next({status: 503, note: "ارتباط با پایگاه داده برقرار نشد"});
                    }else{
                        if(result){
                            let ag = new after({
                                entity: this.entity,
                                result: result,
                                method: 'getOne',
                                options: this.options
                            });
                            ag.mount((err, result) => {
                                if(err){
                                    next(err);
                                }else{
                                    next(null, result.result);
                                }
                            });
                        }else{
                            next(null, null);
                        }
                    }
                });
            }
        });
    };

    getOneByCondition = (query, next) => {
        let bg = new before({
            model: {
                entity: this.entity,
                fields: this.fields
            },
            fields: query,
            method: 'get',
            options: this.options
        });
        bg.mount((err, fields) => {
            if(err){
                next(err);
            }else{
                let myDB = new db();
                myDB.getOne({
                    collection: this.entity,
                    query: fields
                }, (err, result) => {
                    if(err){
                        next({status: 503, note: "ارتباط با پایگاه داده برقرار نشد"});
                    }else{
                        if(result){
                            let ag = new after({
                                entity: this.entity,
                                result: result,
                                method: 'getOne',
                                options: this.options
                            });
                            ag.mount((err, result) => {
                                if(err){
                                    next(err);
                                }else{
                                    next(null, result.result);
                                }
                            });
                        }else{
                            next(null, null);
                        }
                    }
                });
            }
        });
    };

    getMany = (query, next) => {
        let bg = new before({
            model: {
                entity: this.entity,
                fields: this.fields
            },
            fields: query,
            method: 'get',
            options: this.options
        });
        bg.mount((err, fields) => {
            if (err) {
                next(err);
            } else {
                let myDB = new db();
                if(query.conditions && query.conditions['id_list']){
                    query.conditions['_id'] = {"$in": query.conditions.id_list};
                    delete query.conditions['id_list'];
                }
                myDB.getMany({
                    collection: this.entity,
                    query: query.conditions,
                    limit: query.page_size,
                    page: query.page,
                    fields: query.fields
                }, (err, result, count) => {
                    if(err){
                        next({status: 503, note: "ارتباط با پایگاه داده برقرار نشد"});
                    }else{
                        let ag = new after({
                            entity: this.entity,
                            result: result,
                            count,
                            method: 'getMany',
                            options: this.options
                        });
                        ag.mount((err, result) => {
                            if(err){
                                next(err);
                            }else{
                                next(null, result.result, result.count);
                            }
                        });
                    }
                });
            }
        });
    };

    post = (fields, next) => {
        let bp = new before({
            model: {
                entity: this.entity,
                fields: this.fields
            },
            fields: fields,
            method: 'post',
            options: this.options
        });
        bp.mount((err, fields) => {
            if(err){
                next(err);
            }else{
                let myDB = new db();
                myDB.insertOne({
                    collection: this.entity,
                    data: fields
                }, (err, result) => {
                    if(err){
                        next({status: 503, note: "ارتباط با پایگاه داده برقرار نشد"});
                    }else{
                        let response = {note: "عملیات با موفقیت انجام شد", id: result.insertedId};
                        next(null, response);
                    }
                });
            }
        });
    };

    put = (fields, next) => {
        let id = fields.id;
        let bp = new before({
            model: {
                entity: this.entity,
                fields: this.fields
            },
            fields: fields,
            method: 'put',
            options: this.options
        });
        bp.mount((err, fields) => {
            if(err){
                next(err);
            }else{
                let myDB = new db();
                myDB.updateOne({
                    collection: this.entity,
                    query: {_id: id},
                    values: fields
                }, (err, result) => {
                    if(err){
                        next({status: 503, note: "ارتباط با پایگاه داده برقرار نشد"});
                    }else{
                        let response = {note: "عملیات با موفقیت انجام شد",};
                        next(null, response);
                    }
                });
            }
        });
    };

    delete = (id, next) => {
        let bg = new before({
            model: {
                entity: this.entity,
                fields: this.fields
            },
            fields: query,
            method: 'delete',
            options: this.options
        });
        bg.mount((err, fields) => {
            if (err) {
                next(err);
            } else {
                let myDB = new db();
                myDB.deleteOne({
                    collection: this.entity,
                    query: {_id: id}
                }, (err, result) => {
                    if(err){
                        next({status: 503, note: "ارتباط با پایگاه داده برقرار نشد"});
                    }else{
                        let response = {note: "عملیات با موفقیت انجام شد",};
                        next(null, response);
                    }
                });
            }
        });
    };
};
