import Filter from '../auth/filter';
import { mv, ls, rm } from './file-handler';
import { BadRequestError } from '../errors/http.error';

export default class FileMoverFilter extends Filter {
    private root: string;

    constructor(root: string) {
        super();
        this.root = root;
    }

    async canAccess(req, res): Promise<any> {
        const {file} = req;

        if (!file) { return; }

        await this.abortIfExists(file); // Expects to throw an HttpError
        await mv(`${file.path}`, `${file.destination}/${file.originalname}`);

        req.file.filename = req.file.originalname;
        req.file.path = `${req.file.destination}/${req.file.originalname}`;

    }

    /**
     * Prevent us from unwanted overwriting of files
     * @param   {object}    file
     * */
    private async abortIfExists(file): Promise<any> {
        let items = await ls(`${file.destination}`);

        if (items.includes(file.originalname)) {
            await rm(file.path); // Remove the buffer file

            throw new BadRequestError(`File: ${file.originalname} already exists`);
        }
    }
}