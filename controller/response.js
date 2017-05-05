const express = require('express');

/**
 *
 * @module  controller/response
 * */
class Response {

    constructor (prefix = '') {
        this.model = null;
        this.prefix = prefix;
        this.usePatch = true; // Will use PATCH instead of PUT on update
        this.fields = [];

        this.list = this.list.bind(this);
        this.retrieve = this.retrieve.bind(this);
        this.update = this.update.bind(this);
        this.create = this.create.bind(this);
        this.destroy = this.destroy.bind(this);

        this.listWrapper = this.listWrapper.bind(this);
        this.retrieveWrapper = this.retrieveWrapper.bind(this);
        this.createWrapper = this.createWrapper.bind(this);
        this.updateWrapper = this.updateWrapper.bind(this);
        this.destroyWrapper = this.destroyWrapper.bind(this);

        this.asView = this.asView.bind(this);
    }


    listWrapper(req, res, next) {

      return this.list(req, res, next);
    }

    retrieveWrapper(req, res, next) {

        return this.retrieve(req, res, next);
    }

    createWrapper(req, res, next) {

        return this.create(req, res, next);
    }

    updateWrapper(req, res, next) {

        return this.update(req, res, next);
    }

    destroyWrapper(req, res, next) {

        return this.destroy(req, res, next);
    }

    /**
     * Method for listing items from a model
     * @function    list
     * @param       req
     * @param       res
     * @param       next
     * */
    list (req, res, next) {
        if (!this.model) {
            return res.sendStatus(405);
        }

        let query = this._setPagination(this.model.find(req.body), req);

        query
            .then((data) => {
                res.status(data ? 200 : 404).json(data);
            })
            .catch(err => next(err));
    }

    retrieve (req, res, next) {
        if (!this.model) {
            return res.sendStatus(405);
        }

        const { id } = req.params;

        let query = this._setPagination(this.model.findOne({_id: id}), req);

        query
            .then((data) => {
                res.status(data ? 200 : 404).json(data);
            })
            .catch(err => next(err));
    }

    update (req, res, next) {
        if (!this.model) {
            return res.sendStatus(405);
        }

        const { id } = req.params;

        this.model.findOneAndUpdate({_id: id}, {$set: req.body}, {new: true})
            .then((data) => {
                res.status(data ? 200 : 404).json(data);
            })
            .catch(err => next(err));
    }

    create (req, res, next) {
        if (!this.model) {
            return res.sendStatus(405);
        }

        this.model.create(req.body)
            .then(data => res.status(201).json(data))
            .catch(err => next(err));
    }

    destroy (req, res, next) {
        if (!this.model) {
            return res.sendStatus(405);
        }

        const { id } = req.params;

        this.model.remove({_id: id})
            .then(result => res.status(204).json(result))
            .catch(err => next(err));

    }

    /**
     * Converts controller methods to
     * a router friendly object.
     *
     * @return  {Router}    express Router object
     */
    asView() {
        const router = express.Router();
        const url = `/${this.prefix ? this.prefix + '/' : ''}`;

        router.post(url, this.createWrapper);
        router.get(url, this.listWrapper);
        router.get(`${url}:id`, this.retrieveWrapper);

        if (this.usePatch) {
            router.patch(`${url}:id`, this.updateWrapper);
        } else {
            router.put(`${url}:id`, this.updateWrapper);
        }

        router.delete(`${url}:id`, this.destroyWrapper);

        return router;
    }

    /**
     * Will assure only the elements specified
     * in the `fields`-array is displayed for the user.
     *
     * */
    _export(data) {
        if (typeof data === '[object Array]') {
            return data.map((item) => {

            });
        }
    }

    /**
     *
     *
     * */
    _setPagination (query, req) {
        let limit = req.query.limit || -1;

        if (req.query.offset) {
            limit += req.query.offset;
        }

        // We only want to set limit on the query
        // if limit is larger than -1 and limit is set.
        // I.e. we ignore limit if offset is set, but limit is not
        if (limit > -1 && req.query.limit) {
            query.limit(limit);
        }

        return query;
    }
}

module.exports = Response;