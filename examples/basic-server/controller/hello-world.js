const { AuthController } = require('restful-node').controllers;
const HelloWorldModel = require('../model/hello-world');
const { BadRequestError } = require('restful-node');

class HelloWorld extends AuthController {
  
  constructor () {
    super();
    this.model = HelloWorldModel;
  }
  
}

module.exports = HelloWorld;
