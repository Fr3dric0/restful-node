const { FileController } = require('../../dist').controllers;
const HelloWorldModel = require('../model/hello-world');
const { BadRequestError } = require('../../dist').errors;
const { JWT } = require('../../dist').auth;

class HelloWorld extends FileController {
    
    constructor () {
        super('', { root: 'dev-server/resources' });
        this.denyUploadOn.push('create');
        this.model = HelloWorldModel;
    }
    
    async create(req, res, next) {
        res.send(req.file);
    }
    
}

module.exports = HelloWorld;
