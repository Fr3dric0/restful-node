import * as express from 'express';
import { NotFoundError, MethodNotAllowed } from '../errors/http.error';
import Filter from '../auth/filter';

/**
 * RestController is the root-controller for _restful-node_.
 * It provides a simple way to built a CRUD server, in a
 * "MVC-like" structure. Everything builds
 * on classes and inheritance, to provide the expected functionality.
 *
 * A simple child of RestController, should only have to provide a `model`,
 * for it to support all the basic CRUD operations.
 *
 * @module  controller/response
 * @typedef RestController
 * */
export default class RestController {
    protected model: any = null;
    protected prefix: string; // Url prefix
    protected usePatch: boolean = true; // Will use PATCH instead of PUT on update
    protected fields: string[] = []; // Database fields (not implemented)
    protected middleware: Function[] = [];
    protected disable: string[] = [];

    /**
     * Option to ignore Primary Key (pk), on specific methods.
     * Will not work on `retrieve`, as `list` already exists
     * @type string[]
     * */
    protected ignorePkOn: string[] = [];

    /**
     * Primary Key (pk) is the url identifier added
     * to the requests:
     *  - `retrieve` (GET /:<pk>)
     *  - `update` (PATCH /:<pk>)
     *  - `destroy (DELETE /:<pk>)
     *
     * The default value is `id`, synonymous with
     * mongoose's `_id` field. And will be
     * treated as an ObjectId. Every other fields
     * will be treated as a string or number
     * @type string
     * */
    protected pk: string = 'id'; // Primary key (pk), used when handling single items


    /**
     * Filters are used to handle validation
     * of requests before `list`, `retrieve`, `create`, etc.
     * is called.
     *
     * Built to run on every request for the controller (might be changed in the future).
     * Useful when validating a form, header values, file properties, etc.
     * @type Filter[]
     * */
    protected filters: Filter[] = [];

    constructor(prefix = '', options: { pk?: string } = {}) {
        this.prefix = prefix;

        if (this.prefix && this.prefix.startsWith('/')) {
            this.prefix = this.prefix.substring(1); // Skip first letter
        }

        this.pk = options.pk || this.pk;

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

    /**
     * Lists items from a model
     * @function    list
     * @route       GET /
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
     * @function retrieve
     * @route GET /:<pk>
     * @param req
     * @param res
     * @param next
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

    /**
     * Updates a specific item, primarily with the help of the
     * primary key (pk), but can be specified to ignore the pk
     * through the `ignorePkOn` list
     * @function update
     * @route PATCH /:<pk?> | PUT /:<pk?>
     * @param req
     * @param res
     * @param next
     * */
    update(req, res, next) {
        if (!this.model) {
            return res.sendStatus(405);
        }

        if (req.body.includes('_id') || req.body.includes('__v')) {
            delete req.body._id;
            delete req.body.__v;
        }

        this.model.findOneAndUpdate(
            this.getPkQuery(req),
            { $set: req.body },
            { new: true }
        )
            .then((data) => {
                res.status(data ? 200 : 404).json(data);
            })
            .catch(err => next(err));
    }

    /**
     * Creates a new resource
     * @function create
     * @route POST /
     * @param req
     * @param res
     * @param next
     * */
    create(req, res, next) {
        if (!this.model) {
            return res.sendStatus(405);
        }

        this.model.create(req.body)
            .then(data => res.status(201).json(data))
            .catch(err => next(err));
    }

    /**
     * Removes a resource
     * @function destroy
     * @route DELETE /:<pk?>
     * @param req
     * @param res
     * @param next
     * */
    destroy(req, res, next) {
        if (!this.model) {
            return res.sendStatus(405);
        }

        this.model.remove(this.getPkQuery(req))
            .then(result => res.status(204).json(result))
            .catch(err => next(err));
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
        this.list(req, res, next);
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
        if (!req.params[this.pk] || !this.model) {
            return this.retrieve(req, res, next);
        }

        let data;
        try {
            data = await this._setPagination(
                this.model.findOne(this.getPkQuery(req)), req);
        } catch (e) {
            return next(e);
        }

        req.db.data[req.db.name] = data;

        this.retrieve(req, res, next);
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
        this.create(req, res, next);
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

        if (!req.params[this.pk] || !this.model) {
            return this.update(req, res, next);
        }

        let data;
        try {
            data = await this.model.findOne(this.getPkQuery(req));
        } catch (e) {
            return next(e);
        }

        if (!data) {
            return next(new NotFoundError(`Cannot find resource ${req.params[this.pk]}`));
        }

        req.db.data[req.db.name] = data;
        this.update(req, res, next)
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
        this.destroy(req, res, next);
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
        const modifyUrl = (method = null) =>
            `${url}${!this.ignorePkOn.includes(method) || method === null ? ':' + this.pk : ''}`;

        // Create
        router.post(url, ...this.middleware, this.createWrapper);

        // List
        router.get(url, ...this.middleware, this.listWrapper);

        // Retrieve
        router.get(modifyUrl(), ...this.middleware, this.retrieveWrapper);

        // Update
        if (this.usePatch) {
            router.patch(modifyUrl('update'), ...this.middleware, this.updateWrapper);
        } else {
            router.put(modifyUrl('update'), ...this.middleware, this.updateWrapper);
        }

        // Delete
        router.delete(
            modifyUrl('destroy'),
            ...this.middleware,
            this.destroyWrapper
        );

        // router.stack.forEach((s) => console.log(s.route.stack));
        return router;
    }

    private runFilters(req, res, next) {
        return Promise.all(this.mapFilters(req, res))
    }

    private mapFilters(req, res) {
        return this.filters
            .map(f => f && f.canAccess ? f.canAccess(req, res) : null)
            .filter(f => !!f);
    }

    /**
     * Gives a mongoose-friendly
     * query, for extracting items through
     * the primary key (pk)
     * */
    private getPkQuery(req): object {
        const query = {};
        // If id is pk, then we must prefix the query with '_'
        query[this.pk === 'id' ? '_id' : this.pk] = req.params[this.pk];

        return query;
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