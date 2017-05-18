const { AuthController } = require('../../../dist').controllers;
const HelloWorldModel = require('../model/hello-world');
const { BadRequestError } = require('../../../dist').errors;

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
