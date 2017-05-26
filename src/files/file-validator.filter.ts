import Filter from '../auth/filter';
import { BadRequestError, EntityTooLargeError } from '../errors/http.error';

export default class FileValidatorFilter extends Filter {
    private allowedMimeTypes;
    private maxSize: number = -1;

    constructor(allowedMimeTypes, maxSize: number) {
        super();

        this.allowedMimeTypes = allowedMimeTypes;
        this.maxSize = maxSize;
    }

    async canAccess(req, res): Promise<any> {
        if (!req.file) { return; }
        const file = req.file;

        if (this.allowedMimeTypes.length > 0 &&
            !this.allowedMimeTypes.includes(file.mimetype)) {

            throw new BadRequestError(`Illegal filetype ${file.mimetype}`);
        }

        if (this.maxSize > -1 && file.size > this.maxSize) {
            throw new EntityTooLargeError(
                `Entity-size ${file.size} bytes exceeds the max-size ${this.maxSize} bytes`
            );
        }
    }
}