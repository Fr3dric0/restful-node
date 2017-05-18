Express CRUD-API
================
[![Known Vulnerabilities](https://snyk.io/test/github/fr3dric0/express-crud-api/badge.svg)](https://snyk.io/test/github/fr3dric0/express-crud-api)

**Quick install**
`npm install --save express-crud-module`

## Table Of Contents

1. [General Description](#general-description)
2. [Installation](#installation)
3. [Adding Controllers](#adding-controllers)
4. [Creating Models](#creating-models)

## General Description
The _Express CRUD-API_ is a module built on top of _ExpressJS_,
with _mongodb_ as an ORM. It's built in Typescript,
but is compiled down to `ES2015`.

> For a basic skeleton, checkout example _basic-server_

Express CRUD-API focuses heavily on _classes_ and _inheritance_
to provide the features we expect.

A controller is therefore a `class`,
with the following methods and linked http-requests and routes:

- `list` = `GET /`
- `retrieve` = `GET /:id`
- `create` = `POST /`
- `update` = `PUT /:id` or `PATCH /:id`
- `destroy` = `DELETE /:id`

Note, each request-url can be prefixed with a string (or/and url-parameter).
This can be done when calling `urls(...)`.

## Installation

### Minimum requirements

- NodeJS v6.9.0 (_Built with v7.4.0. Must support ES2015 syntax_)
- MongoDB (primary database client, planning to add support for Sequelize in the future)

### NodeJS
Ensure you have installed NodeJS >= v.6.9.0.
This can be done with `apt-get install nodejs` in Ubuntu,
`brew install nodejs` for Mac OS,
checkout [nodejs.org](https://nodejs.org/en/) for more information.

### MongoDB
Checkout their website for installation.
When installed you should be able to call `mongod` to run the database-server,
and `mongo` to run a simple client.

### Add to package.json
Add `express-crud-module` to `package.json`.

```shell
$ npm install --save express-crud-module
```

Express CRUD-module will automatically add `express` and `mongoose`, ...
to your modules (read _package.json_, for all the included modules).

### Folder structure
The module requires _no_ strict folder structure.
My personal starting-point is to use `express-generator`,
and remove the files I don't need (_which is most of them_).

When completed, my structure usually looks like this:

```
project-name
| bin
| | www
|
| config
| | _config.js (secret configuration, untracked)
| | config.js (public configuration)
|
| controllers
| | name1.controller.js
| | name2.controller.js
| | ...
|
| model
| | model1.js
| | ...
|
| library (if necessary)
| | ...
|
| app.js
| package.json
| README.md
```

## Adding Controllers
Creating your own controllers i generally simple,
and it does allot with generally little.
If you only want basic CRUD operations,
it should suffice to only register a _model_ to the controller.

```js
this.model = YourMongooseModel // Add in constructor
```

### Extending `Controller`
In the folder of your choosing create a controller-file (`example1.controller.js`).
Declare a class,
and make it extend `Controller` (`require("express-crud-module").controllers.Controller`),
or `AuthController`.

> If no model is provided, and you haven't overridden the methods.
> the controller will respond with `HTTP 405 Method Not Allowed`

Methods to override is:

- `list (req, res, next)`
- `retrieve (req, res, next)`
- `create (req, res, next)`
- `update (req, res, next)`
- `delete (req, res, next)`




### Registering a controller to the urls
When a controller is created you can register it to a route
by calling `urls(...)`

**Example**
```js
// app.js

const HelloWorld = require('./controller/hello-world');

const { urls } = require('express-crud-api').routes;

urls(app, '/api', [
  { url: '/user', controller: new ExampleController() },
  { controller: new HelloWorld() } // Controller uses default prefix
]);
```

## Creating models
I will not go into detail on how to create models,
because it is already well documented by `mongoose`,
who created this schema.

The `HelloWorld`-model in examples,
should give enough information to create your own.

To setup a connection use, `setupMongoose` in `require("express-crud-module").database`

Checkout out the examples for how to interact with the model.


