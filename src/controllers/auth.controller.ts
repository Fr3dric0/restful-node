import Controller from './controller';
import Filter from '../auth/filter';

export default class AuthController extends Controller {
    protected authFilters: Filter[] = [];
    protected ignoreMethods: string[] = [];

    constructor(prefix = '') {
        super(prefix);
        this.runAuthFilter = this.runAuthFilter.bind(this);
    }

    listWrapper(req, res, next) {
        if (this.ignoreMethods.includes('list')) {
            return super.listWrapper(req, res, next);
        }

        this.runAuthFilter(req, res)
            .then(() => super.listWrapper(req, res, next))
            .catch(err => next(err));
    }

    retrieveWrapper(req, res, next) {
        if (this.ignoreMethods.includes('retrieve')) {
            return super.retrieveWrapper(req, res, next);
        }

        this.runAuthFilter(req, res)
            .then(() => super.retrieveWrapper(req, res, next))
            .catch(err => next(err));
    }

    createWrapper(req, res, next) {
        if (this.ignoreMethods.includes('create')) {
            return super.createWrapper(req, res, next);
        }

        this.runAuthFilter(req, res)
            .then(() => super.createWrapper(req, res, next))
            .catch(err => next(err));
    }

    updateWrapper(req, res, next) {
        if (this.ignoreMethods.includes('update')) {
            return super.updateWrapper(req, res, next);
        }

        this.runAuthFilter(req, res)
            .then(() => super.updateWrapper(req, res, next))
            .catch(err => next(err));
    }

    destroyWrapper(req, res, next) {
        if (this.ignoreMethods.includes('destroy')) {
            return super.destroyWrapper(req, res, next);
        }

        this.runAuthFilter(req, res)
            .then(() => super.destroyWrapper(req, res, next))
            .catch(err => next(err));
    }

    private runAuthFilter(req, res): Promise<any> {
        return new Promise((rsv, rr) => {
            Promise
                .all(this.mapAuthFilters(req, res))
                .then((results) => rsv())
                .catch(err => rr(err));
        });
    }

    private mapAuthFilters(req, res): any {
        return this.authFilters
            .map((f) => f && f.canAccess ? f.canAccess(req, res) : null)
            .filter(f => f != null);
    }
}