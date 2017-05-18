import Controller from './controller';
import Filter from '../auth/filter';

export default class AuthController extends Controller {
    protected authFilters: Filter[] = [];
    protected ignoreMethods: string[] = [];

    constructor (prefix = '') {
        super(prefix);
        this._runFilters = this._runFilters.bind(this);
    }

    listWrapper(req, res, next) {
        if (this.ignoreMethods.includes('list')) {
            return super.listWrapper(req, res, next);
        }

        this._runFilters()
            .then(() => super.listWrapper(req, res, next))
            .catch(err => next(err));
    }

    retrieveWrapper(req, res, next) {
        if (this.ignoreMethods.includes('retrieve')) {
            return super.retrieveWrapper(req, res, next);
        }

        this._runFilters()
            .then(() => super.retrieveWrapper(req, res, next))
            .catch(err => next(err));
    }

    createWrapper (req, res, next) {
        if (this.ignoreMethods.includes('create')) {
            return super.createWrapper(req, res, next);
        }

        this._runFilters()
            .then(() => super.createWrapper(req, res, next))
            .catch(err => next(err));
    }

    updateWrapper (req, res, next) {
        if (this.ignoreMethods.includes('update')) {
            return super.updateWrapper(req, res, next);
        }

        this._runFilters()
            .then(() => super.updateWrapper(req, res, next))
            .catch(err => next(err));
    }

    destroyWrapper (req, res, next) {
        if (this.ignoreMethods.includes('destroy')) {
            return super.destroyWrapper(req, res, next);
        }

        this._runFilters()
            .then(() => super.destroyWrapper(req, res, next))
            .catch(err => next(err));
    }

    private _runFilters(req = null): Promise<any> {
        return new Promise((rsv, rr) => {
            Promise
                .all(this._mapFilters())
                .then((results) => rsv())
                .catch( err => rr(err));
        });
    }

    private _mapFilters (): any {
        return this.authFilters
            .map((f) => f.canAccess);
    }
}