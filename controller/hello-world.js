const { AuthController } = require('../dist').controllers;
const HelloWorldModel = require('../model/hello-world');
const { BadRequestError } = require('../dist/error/http.error');

class HelloWorld extends AuthController {
  
  constructor () {
    super();
    this.model = HelloWorldModel;
    this.authFilters.push(requireNothing);
  }
  
  list (req, res, next) {
    res.sendStatus(200);
  }
  
}

function requireNothing (req) {
  throw new BadRequestError('Bad values');
}

module.exports = HelloWorld;
