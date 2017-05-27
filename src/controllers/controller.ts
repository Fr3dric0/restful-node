import * as express from 'express';
import { MethodNotAllowed } from '../errors/http.error';

export default class Controller {
    private opt: { prefix: string };
    private disable: string[] = [];

    constructor(options: any = {}) {
        this.opt = options;

        this.get = this.get.bind(this);
        this.post = this.post.bind(this);
        this.put = this.put.bind(this);
        this.patch = this.patch.bind(this);
        this.delete = this.delete.bind(this);
        this.head = this.head.bind(this);
        this.options = this.options.bind(this);

        this.getWrapper = this.getWrapper.bind(this);
        this.postWrapper = this.postWrapper.bind(this);
        this.patchWrapper = this.patchWrapper.bind(this);
        this.putWrapper = this.putWrapper.bind(this);
        this.deleteWrapper = this.deleteWrapper.bind(this);
        this.headWrapper = this.headWrapper.bind(this);
        this.optionsWrapper = this.optionsWrapper.bind(this);

        this.disableMethod = this.disableMethod.bind(this);
        this.generalFilter = this.generalFilter.bind(this);
        this.asView = this.asView.bind(this);
    }

    disableMethod(method: string): void {
        if (!this.disable.includes(method.toLowerCase())) {
            this.disable.push(method.toLowerCase());
        }
    }

    async get(req, res, next) {
        res.sendStatus(405);
    }

    async post(req, res, next) {
        res.sendStatus(405);
    }

    async put(req, res, next) {
        res.sendStatus(405);
    }

    async patch(req, res, next) {
        res.sendStatus(405);
    }

    async delete(req, res, next) {
        res.sendStatus(405);
    }

    async head(req, res, next) {
        res.sendStatus(405);
    }

    async options(req, res, next) {
        res.sendStatus(405);
    }

    protected async getWrapper(req, res, next) {
        return this.get(req, res, next);
    }

    protected async postWrapper(req, res, next) {
        return this.post(req, res, next);
    }

    protected async putWrapper(req, res, next) {
        return this.put(req, res, next);
    }

    protected async patchWrapper(req, res, next) {
        return this.patch(req, res, next);
    }

    protected async deleteWrapper(req, res, next) {
        return this.delete(req, res, next);
    }

    protected async headWrapper(req, res, next) {
        return this.head(req, res, next);
    }

    protected async optionsWrapper(req, res, next) {
        return this.options(req, res, next);
    }

    /**
     * Is called on every request
     *
     * */
    private async generalFilter(req, res, next) {
        // Will disable methods
        if (this.disable.includes(req.method.toLowerCase())) {
            return next(new MethodNotAllowed());
        }

        next();
    }

    /**
     * Will register the methods to it's adjacent
     * HTTP-methods
     *
     * */
    asView() {
        const router = express.Router();

        router.post(this.opt.prefix || '', this.generalFilter, this.postWrapper);
        router.get(this.opt.prefix || '', this.generalFilter, this.getWrapper);
        router.put(this.opt.prefix || '', this.generalFilter, this.putWrapper);
        router.patch(this.opt.prefix || '', this.generalFilter, this.patchWrapper);
        router.delete(this.opt.prefix || '', this.generalFilter, this.deleteWrapper);
        router.head(this.opt.prefix || '', this.generalFilter, this.headWrapper);
        router.options(this.opt.prefix || '', this.generalFilter, this.optionsWrapper);

        return router;
    }
}