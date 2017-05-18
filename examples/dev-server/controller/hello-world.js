const { AuthController, JWTAuthController } = require('restful-node').controllers;
const HelloWorldModel = require('../model/hello-world');
const { BadRequestError } = require('restful-node').errors;
const { JWT } = require('restful-node').auth;

class HelloWorld extends JWTAuthController {
  
  constructor () {
    super('', {secret: 'horselord'});
    this.model = HelloWorldModel;
    this.ignoreMethods.push('create');
  }
  
  create(req, res, next) {
    res.json({token: new JWT(this.secret, 9099999999).create({name: 'Jon Snow'})});
  }
  
}

module.exports = HelloWorld;
