const AuthResponse = require('./auth-response');
const HelloWorldModel = require('../model/hello-world');
const { BadRequestError } = require('../error/http.error');
const func = require('../dist/');

class HelloWorld extends AuthResponse {
  
  constructor () {
    super();
    this.model = HelloWorldModel;
    this.authFilters.push(requireNothing);
  }
  
  list(req, res, next) {
    console.log(func.name());
    
    res.sendStatus(200);
  }
  
}

function requireNothing(req) {
  throw new BadRequestError('Bad values');
}

module.exports = HelloWorld;
