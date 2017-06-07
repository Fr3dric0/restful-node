const { RestController } = require('../../dist').controllers;

class BasicController extends RestController {
    
    constructor () {
        super();
        this.ignoreParamOn.push('update')
    }
    
    async update(req, res, next) {
        res.json('hello');
    }
    
    
}

module.exports = BasicController;