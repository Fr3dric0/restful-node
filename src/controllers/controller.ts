import * as express from 'express';
import { NotFoundError } from '../errors';

/**
 *
 * @module  controller/response
 * */
export default class Controller {
    private model: any = null;
    protected prefix: string;
    protected usePatch: boolean = true; // Will use PATCH instead of PUT on update
    protected fields: string[] = [];

    constructor (prefix = '') {
        this.prefix = prefix;

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

    listWrapper (req, res, next) {
        req = this._attachDb(req);
        return this.list(req, res, next);
    }

    retrieveWrapper (req, res, next) {
        req = this._attachDb(req);

        // Skip loading of content
        // if no content exists
        if (!req.params.id && !this.model) {
            return this.retrieve(req, res, next);
        }

        let query = this._setPagination(
            this.model.findOne({ _id: req.params.id }), req);

        query
            .then((data) => {
                req.db.data[req.db.name] = data;
                this.retrieve(req, res, next);
            })
            .catch(err => next(err));
    }

    createWrapper (req, res, next) {
        req = this._attachDb(req);

        return this.create(req, res, next);
    }

    updateWrapper (req, res, next) {
        req = this._attachDb(req);

        if (!req.params.id || !this.model) {
            return this.update(req, res, next);
        }

        this.model.findOne({ _id: req.params.id })
            .then((data) => {
                // There is on point in continuing the
                // update, if there is no resource
                // to update.
                if (!data) {
                    return next(new NotFoundError(`Cannot find resource ${req.params.id}`));
                }

                req.db.data[req.db.name] = data;
                this.update(req, res, next);
            })
            .catch(err => next(err));
    }

    destroyWrapper (req, res, next) {
        req = this._attachDb(req);

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

    /**
     * Retrieves a single item from a model
     * @function  retrieve
     * @param     req
     * @param     res
     * @param     next
     * */
    retrieve (req, res, next) {
        if (!this.model) {
            return res.sendStatus(405);
        }

        if (!req.db.data[req.db.name]) {
            return next(new NotFoundError());
        }

        res.status(200).json(req.db.data[req.db.name]);
    }

    update (req, res, next) {
        if (!this.model) {
            return res.sendStatus(405);
        }

        const { id } = req.params;

        this.model.findOneAndUpdate({ _id: id }, { $set: req.body }, { new: true })
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

        this.model.remove({ _id: id })
            .then(result => res.status(204).json(result))
            .catch(err => next(err));

    }

    /**
     * Converts controller methods to
     * a router friendly object.
     *
     * @return  {Router}    express Router object
     */
    asView () {
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


    private _attachDb (req) {
        if (!req.db && this.model) {
            req.db = { name: this.model.modelName.toLowerCase(), data: {} };
        }

        return req;
    }

    /**
     *
     *
     * */
    private _setPagination (query, req) {
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

//module.exports = Response;