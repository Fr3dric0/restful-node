const { Controller } = require('../../dist').controllers;

class BasicController extends Controller {

  
  async get(req, res, next) {
    res.json({title: 'hello world'});
  }
  
  
}

module.exports = BasicController;