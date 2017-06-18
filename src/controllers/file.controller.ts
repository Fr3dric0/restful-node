import AuthController from './auth.controller';
import * as multer from 'multer';

import FileValidatorFilter from '../files/file-validator.filter';
import FileMoverFilter from '../files/file-mover.filter';
import { ls, rm } from '../files/file-handler';
import { BadRequestError, MethodNotAllowed, NotFoundError } from '../errors/http.error';

export default class FileController extends AuthController {
    protected root: string = null;
    protected upload: any;
    protected allowedMimeTypes: string[] = [];
    protected maxSize: number = -1;
    protected denyUploadOn: string[] = [];

    constructor(prefix = '', options: { root?: string, fieldname?: string, maxSize?: number } = {}) {
        super(prefix, options);

        this.root = options.root || this.root;
        this.upload = multer({dest: this.root});
        this.maxSize = options.maxSize || this.maxSize;
        this.middleware.push(this.upload.single(options.fieldname || 'file'));

        this.filters.push(
            // Validates that the properties of the files follows the
            // server's restrictions
            new FileValidatorFilter(this.allowedMimeTypes, this.maxSize),

            // 1. Ensures no two identical files overwrites each other
            // 2. Moves the file to the correct position
            new FileMoverFilter(this.root)
        );
    }

    /**
     * Will handle file upload for automatically.
     * Would you like to override this method,
     * the file-properties is available in `req.file`
     * */
    async create(req, res, next) {
        if (this.root == null || this.root == undefined) {
            return next(new MethodNotAllowed());
        }

        if (!req.file) {
            return next(new BadRequestError('No file to upload'));
        }

        res.status(201).json({
            file: {
                name: req.file.filename,
                size: req.file.size,
                mimetype: req.file.mimetype
            }
        })

    }

    /**
     * List all the static content available
     * in the root folder (only if root is specified).
     * */
    async list(req, res, next) {
        if (this.root == null || this.root == undefined) {
            return next(new MethodNotAllowed());
        }

        let items = await ls(this.root);
        res.status(items.length > 0 ? 200 : 204).json(items);
    }

    /**
     * Will delete the file from the root
     * */
    async destroy(req, res, next) {
        if (this.root == null || this.root == undefined) {
            return next(new MethodNotAllowed());
        }

        let items = await ls(this.root);

        if (!items.includes(req.params.id)) {
            return next(new NotFoundError(`Cannot find resource ${req.params[this.pk]}`));
        }

        try {
            await rm(`${this.root}/${req.params[this.pk]}`);
        } catch (e) {
            return next(e);
        }

        res.sendStatus(204);
    }

    async createWrapper(req, res, next) {
        try {
            await this.clearFileIfDisabled('create', req);
        } catch(e) {
            return next(e);
        }

        super.createWrapper(req, res, next);
    }

    async listWrapper(req, res, next) {
        try {
            await this.clearFileIfDisabled('list', req);
        } catch(e) {
            return next(e);
        }

        super.listWrapper(req, res, next);
    }

    async retrieveWrapper(req, res, next) {
        try {
            await this.clearFileIfDisabled('list', req);
        } catch(e) {
            return next(e);
        }

        super.listWrapper(req, res, next);
    }

    async updateWrapper(req, res, next) {
        try {
            await this.clearFileIfDisabled('update', req);
        } catch(e) {
            return next(e);
        }

        super.updateWrapper(req, res, next);
    }

    /**
     * If `destroy` is disabled or denyUploadOn contains `destroy`,
     * we'll remove the buffered file and clear out req.file
     *
     * */
    async destroyWrapper(req, res, next) {
        try {
            await this.clearFileIfDisabled('destroy', req);
        } catch(e) {
            return next(e);
        }

        super.destroyWrapper(req, res, next);
    }

    /**
     * Will remove the buffered file and `req.file`,
     * if `method` is disabled or denied uploading
     * */
    protected async clearFileIfDisabled(method, req) {
        if (!req.file) { return; }

        if (this.disable.includes(method) ||
            this.denyUploadOn.includes(method)) {
            try {
                await rm(`${req.file.path}`);
            } catch(e) {
                throw e;
            }

            req.file = null; // Clear out file
        }

    }
}