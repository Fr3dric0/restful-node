import Filter from '../auth/filter';
import { mv, ls } from './file-handler';
import { BadRequestError, HttpError } from '../errors/http.error';

export default class FileMoverFilter extends Filter {
    private root: string;

    constructor(root: string) {
        super();
        this.root = root;
    }

    canAccess(req, res): Promise<any> {
        return new Promise((rsv, rr) => {
            const { file } = req;

            if (!file) { return rsv(); }

            Promise.all([
                this.abortIfExists(file),
                this.moveFile(file)
            ])
                .then(() => {
                    // Replace the hashed file-name with the new filenames
                    req.file.filename = req.file.originalname;
                    req.file.path = `${req.file.destination}/${req.file.originalname}`;
                    rsv();
                })
                .catch(err => rr(err));
        });
    }

    /**
     * Will move the file to the correct location, with
     * the correct filename
     * @param   {object}    file
     * */
    private moveFile(file): Promise<any> {
        return new Promise((rsv, rr) => {
            mv(`${file.path}`,
            `${file.destination}/${file.originalname}`)
                .then(() => rsv())
                .catch(err => rr(new HttpError(err.message)));
        });
    }

    /**
     * Prevent us from unwanted overwriting of files
     * @param   {object}    file
     * */
    private abortIfExists(file): Promise<any> {
        return new Promise((rsv, rr) => {
            ls(`${file.destination}`)
                .then((items) => {
                    if (items.includes(file.originalname)) {
                        return rr(new BadRequestError(`File: ${file.originalname} already exists`));
                    }

                    rsv();
                })
                .catch(err => rr(err));
        });
    }
}