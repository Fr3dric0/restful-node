const { RestController } = require('../../dist').controllers;

class BasicController extends RestController {

  
  async get(req, res, next) {
    res.json({title: 'hello world'});
  }
  
  
}

module.exports = BasicController;