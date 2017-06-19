const { RestController } = require('../../dist').controllers;

class BasicController extends RestController {
    
    constructor (name) {
        super('', { pk: 'title' });
        this.model = require('../model/hello-world');
    }
    
}

module.exports = BasicController;