Express CRUD-API
================

## Table Of Contents

1. [Installation](#installation)
2. [Adding Controllers](#adding-controllers)
3. [Creating Models](#creating-models)

The _Express CRUD-API_ is a skeleton REST-API in express with _mongodb_ as model.
Out of the box the skeleton supports the operations.

- Create `POST /`
- list `GET /`
- Retrieve `GET /:id`
- Update `PATCH /:id` (will add support to use PUT)
- Delete `DELETE /:id`

Checkout the `Response`-class in `controller/response.js`
and the `HelloWorld`-controller for more details and examples.

The primary thought for this skeleton and it's structure,
is to have a generalized _REST-API_ where one would only
have to provide a _pointer_ to the data-model.
The parent controller would do the rest.

With this base, we can add features and security
just by extending the `Response`-controller, or adding `pre-` and `post-save` functions
to the model.


## Installation

### Minimum requirements

- NodeJS v.7.4.0 (_Might support down to v.6.9.0. Must support ES2015 syntax_)
- MongoDB (primary database client, planning to add support for Sequelize)

### NodeJS
Ensure you have installed NodeJS >= v.7.4.0.
This can be done with `apt-get install nodejs` in Ubuntu,
`brew install nodejs` for Mac OS,
checkout [nodejs.org](https://nodejs.org/en/) for more information.

### MongoDB
Checkout their website for installation.
When installed you should be able to call `mongod` to run the server,
and `mongo` to run the client.

### Fork or Clone Repository
To get the _Express CRUD-API_ fork or clone the repository,
through `git clone https://github.com/Fr3dric0/express-crud-api.git`.

Remember to run `npm install`.

### Rename application
To rename the application, visit the _config-file_ `config/config.js`,
and replace the existing value in `name` with something fitting.

When all is set, you should be able to run your server.
I personally recommend to use `nodemon` in development and `forever` in production.

## Adding Controllers

> N.B. - Do NOT rewrite the `Response`-class. This is our base-controller

## Extending the Response controller

After installation you probably want to add
your own controller and serve custom data. To do this,
simply create a new file, with a fitting name, in the `controller`-folder.
Here you'll want to declare a new class
(preferably matching the filename just in _PascalCase_),
and _extend_ the `Response`-controller

> Notice I'm using the words "controller" and "class" interchangeability,
> when referring to the `Response`-class in `controller/response.js`.
> This is because I want to make it clear the controller is a class,
> and not a function.

If the only thing you want to do is to implement simple CRUD operations,
you only have to point to your _model_,
in the constructor method `this.model = MyModel`.

> If no model is provided, and you haven't overridden the methods.
> the controller will respond with `HTTP 405 Method Not Allowed`

Otherwise, you can choose to override the _generic-methods_

- `list (req, res, next)`
- `retrieve (req, res, next)`
- `create (req, res, next)`
- `update (req, res, next)`
- `delete (req, res, next)`

## Registering the controller to the urls
When your controller is complete you'll need to register
it with some routes. The quickest and easiest way to do this,
is with the help of the `routeMapper`-helper (`helper/route-mapper.js`).

In `routes/index.js`, attach your route to the `app` parameter.

**Example**

```js
// Without options
app.use(prefix + '/user', routeMapper(new MyController());

// With options
app.use(prefix + '/user', routeMapper(new MyController(), {
    prefix: ':name/:age'
});
```

As demonstrated in the example, you can add more prefixes to the url,
and even include more _request-parameters_ by adding the `prefix` option
to the `routeMapper`-function.

## Creating models
I will not go into detail on how to create models,
because it is already well documented by the `mongoose` team,
who created this schema.

The `HelloWorld`-model (`model/hello-world.js`),
should give enough information to create your own.

Checkout out the `Response`-controller for how to interact with the model.


