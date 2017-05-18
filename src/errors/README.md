Error modules
=============

The _error-folder_ contains exceptions and handlers used by the application.
You can generally add and remove modules from this folder.
The only required ones are `error-handler.js` and `http-errors.js`.


## ErrorHandler (error-handler.js)
Endpoint for error-routes. Defines how to the error should be responded to the user.
If you want to add more error handlers, simply extend the existing one,
and add it in before the `ErrorHandler` in `routes/index:urls`.


## Errors and Exceptions (http-errors.js)
The primary Error module is `HttpError`.
This has a `status`-property attached to it, which is used by
the `ErrorHandler` to send appropriate _response-messages_.

If you want to create your own _errors_,
I recommend to extend the `HttpError` class, so that you are guaranteed
to have a `status`-property attached to it.



