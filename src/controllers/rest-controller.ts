import * as express from 'express';
import { NotFoundError, MethodNotAllowed } from '../errors/http.error';
import Filter from '../auth/filter';

/**
 *
 * @module  controller/response
 * */
export default class RestController {
    private model: any = null;
    protected prefix: string; // Url prefix
    protected usePatch: boolean = true; // Will use PATCH instead of PUT on update
    protected fields: string[] = []; // Database fields (not implemented)
    protected middleware: Function[] = [];
    protected disable: string[] = [];

    // Filters used to
    // handle validation etc.
    // before the request-methods (list, retrieve, ...)
    // is called
    protected filters: Filter[] = [];

    constructor(prefix = '') {
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

    async listWrapper(req, res, next) {
        if (this.disable.includes('list')) {
            return next(new MethodNotAllowed());
        }

        try {
            await this.runFilters(req, res, next);
        } catch (e) {
            return next(e);
        }

        req = this._attachDb(req);
        RestController.callHttpMethod(req, res, next, this.list);
    }

    async retrieveWrapper(req, res, next) {
        if (this.disable.includes('retrieve')) {
            return next(new MethodNotAllowed());
        }

        try {
            await this.runFilters(req, res, next);
        } catch (e) {
            return next(e);
        }

        req = this._attachDb(req);

        // Skip loading of content
        // if no content exists
        if (!req.params.id && !this.model) {
            return RestController.callHttpMethod(req, res, next, this.retrieve);
        }

        let data;
        try {
            data = await this._setPagination(
                this.model.findOne({_id: req.params.id}), req);
        } catch(e) {
            return next(e);
        }

        req.db.data[req.db.name] = data;
        RestController.callHttpMethod(req, res, next, this.retrieve);
    }

    async createWrapper(req, res, next) {
        if (this.disable.includes('create')) {
            return next(new MethodNotAllowed());
        }

        try {
            await this.runFilters(req, res, next);
        } catch (e) {
            return next(e);
        }

        req = this._attachDb(req);
        RestController.callHttpMethod(req, res, next, this.create);
    }

    async updateWrapper(req, res, next) {
        if (this.disable.includes('update')) {
            return next(new MethodNotAllowed());
        }

        try {
            await this.runFilters(req, res, next);
        } catch (e) {
            return next(e);
        }

        req = this._attachDb(req);

        if (!req.params.id || !this.model) {
            return RestController.callHttpMethod(req, res, next, this.update);
        }

        let data;
        try {
            data = await this.model.findOne({_id: req.params.id});
        } catch (e) {
            return next(e);
        }

        if (!data) {
            return next(new NotFoundError(`Cannot find resource ${req.params.id}`));
        }

        req.db.data[req.db.name] = data;
        RestController.callHttpMethod(req, res, next, this.update);
    }

    async destroyWrapper(req, res, next) {
        if (this.disable.includes('destroy')) {
            return next(new MethodNotAllowed());
        }

        try {
            await this.runFilters(req, res, next);
        } catch (e) {
            return next(e);
        }

        req = this._attachDb(req);
        return RestController.callHttpMethod(req, res, next, this.destroy);
    }

    /**
     * Method for listing items from a model
     * @function    list
     * @param       req
     * @param       res
     * @param       next
     * */
    list(req, res, next) {
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
    retrieve(req, res, next) {
        if (!this.model) {
            return res.sendStatus(405);
        }

        if (!req.db.data[req.db.name]) {
            return next(new NotFoundError());
        }

        res.status(200).json(req.db.data[req.db.name]);
    }

    update(req, res, next) {
        if (!this.model) {
            return res.sendStatus(405);
        }

        const {id} = req.params;

        this.model.findOneAndUpdate({_id: id}, {$set: req.body}, {new: true})
            .then((data) => {
                res.status(data ? 200 : 404).json(data);
            })
            .catch(err => next(err));
    }

    create(req, res, next) {
        if (!this.model) {
            return res.sendStatus(405);
        }

        this.model.create(req.body)
            .then(data => res.status(201).json(data))
            .catch(err => next(err));
    }

    destroy(req, res, next) {
        if (!this.model) {
            return res.sendStatus(405);
        }

        const {id} = req.params;

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

        router.post(url, ...this.middleware, this.createWrapper);
        router.get(url, ...this.middleware, this.listWrapper);
        router.get(`${url}:id`, ...this.middleware, this.retrieveWrapper);
        router.delete(`${url}:id`, ...this.middleware, this.destroyWrapper);

        if (this.usePatch) {
            router.patch(`${url}:id`, ...this.middleware, this.updateWrapper);
        } else {
            router.put(`${url}:id`, ...this.middleware, this.updateWrapper);
        }

        return router;
    }

    private static callHttpMethod(req, res, next, func) {
        try {
            func(req, res, next);
        } catch (e) {
            return next(e);
        }
    }

    private runFilters(req, res, next) {
        return Promise.all(this.mapFilters(req, res))
    }

    private mapFilters(req, res) {
        return this.filters
            .map(f => f && f.canAccess ? f.canAccess(req, res) : null)
            .filter(f => !!f);
    }

    private _attachDb(req) {
        if (!req.db && this.model) {
            req.db = {name: this.model.modelName.toLowerCase(), data: {}};
        }

        return req;
    }

    /**
     *
     *
     * */
    private _setPagination(query, req) {
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