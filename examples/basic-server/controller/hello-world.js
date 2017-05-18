const { AuthController } = require('express-crud-api').controllers;
const HelloWorldModel = require('../model/hello-world');
const { BadRequestError } = require('express-crud-api');

class HelloWorld extends AuthController {
  
  constructor () {
    super();
    this.model = HelloWorldModel;
    this.authFilters.push(requireNothing);
  }
  
}

function requireNothing (req) {
  throw new BadRequestError('Bad values');
}

module.exports = HelloWorld;
