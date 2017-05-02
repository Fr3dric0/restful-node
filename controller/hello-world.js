const Response = require('./response');
const HelloWorldModel = require('../model/hello-world');

class HelloWorld extends Response {

    constructor () {
        super();
        this.model = HelloWorldModel;
    }

}


module.exports = HelloWorld;
