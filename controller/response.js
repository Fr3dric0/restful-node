/**
 *
 * @module  controller/response
 * */
class Response {

    constructor (prefix = null) {
        this.model = null;
        this.prefix = prefix;

        this.list = this.list.bind(this);
        this.retrieve = this.retrieve.bind(this);
        this.update = this.update.bind(this);
        this.create = this.create.bind(this);
        this.delete = this.delete.bind(this);
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

        let query = this._setFilters(this.model.find(req.body), req);

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

        let query = this._setFilters(this.model.findOne({id}), req);

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

        this.model.findOneAndUpdate({id}, {$set: req.body}, {new: true})
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

    delete (req, res, next) {
        if (!this.model) {
            return res.sendStatus(405);
        }

        const { id } = req.params;

        this.model.remove({id})
            .then(result => res.status(204).json(result))
            .catch(err => next(err));

    }

    _setFilters (query, req) {
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