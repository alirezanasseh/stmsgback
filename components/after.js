module.exports = class After {
    constructor(props){
        this.entity = props.entity;
        this.result = props.result;
        this.count = props.count;
        this.method = props.method;
        this.options = props.options;
    }

    mount = (callback) => {
        switch (this.method) {
            case 'getOne':
                if(!this.options.innerRequest){
                    this.result['id'] = this.result['_id'];
                    delete this.result['_id'];
                    if(this.entity === 'users'){
                        delete this.result['password'];
                    }
                }
                callback(null, {result: this.result});
                break;
            case 'getMany':
                if(!this.options.innerRequest){
                    this.result = this.result.map(result => {
                        result['id'] = result['_id'];
                        delete result['_id'];
                        if(this.entity === 'users'){
                            delete result['password'];
                        }
                        return result;
                    });
                }
                callback(null, {result: this.result, count: this.count});
                break;
            default:
                callback(null, {result: this.result});
        }
    };
};