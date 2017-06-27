const { RestController, JWTAuthController } = require('../../dist').controllers;
const { JWT } = require('../../dist').auth;

class BasicController extends JWTAuthController {
    
    constructor (name) {
        super('', { pk: 'title', secret: 'sdfsdflkjrfer' });
        this.ignoreMethods.push('create', 'list');
        this.model = require('../model/hello-world');
    }
    
    async create(req, res, next) {
        const jwt = new JWT('sdfsdflkjrfer');
    
        res.json({ token: jwt.create({uid: 'name'}) });
    }
    
}

module.exports = BasicController;