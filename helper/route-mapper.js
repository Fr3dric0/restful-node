/**
 *
 * @module helper/router
 * */
const express = require('express');

module.exports = function(controller, options = {}) {
    const router = express.Router();
    let prefix = options.prefix || '';

    if (controller.prefix) {
        prefix = controller.prefix;
    }

    const url = `/${prefix ? prefix + '/' : ''}`;

    router.get(url, controller.list);
    router.post(url, controller.create);
    router.get(`${url}:id`, controller.retrieve);
    router.patch(`${url}:id`, controller.update);
    router.delete(`${url}:id`, controller.delete);

    return router;
};