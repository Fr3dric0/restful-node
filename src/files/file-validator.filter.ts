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

    canAccess(req, res): Promise<any> {
        return new Promise((rsv, rr) => {
            const file = req.file;

            if (!file) {
                return rsv(); // No file to check
            }

            if (this.allowedMimeTypes.length > 0 &&
                !this.allowedMimeTypes.includes(file.mimetype)) {

                return rr(new BadRequestError(`Illegal filetype ${file.mimetype}`));
            }

            if (this.maxSize > -1 && file.size > this.maxSize) {
                return rr(new EntityTooLargeError(
                    `Entity-size ${file.size} bytes exceeds the max-size ${this.maxSize} bytes`
                ));
            }
            rsv();
        })
    }
}