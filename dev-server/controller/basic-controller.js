const { RestController } = require('../../dist').controllers;

class BasicController extends RestController {
    
    constructor (name) {
        super('', { pk: 'title' });
        this.ignorePkOn.push('update');
        this.model = require('../model/hello-world');
    }
    
    
    async update(req, res, next) {
        res.send(req.settings);
    }
    
}

module.exports = BasicController;