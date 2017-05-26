import AuthController from './auth.controller';
import * as multer from 'multer';

import FileValidatorFilter from '../files/file-validator.filter';
import FileMoverFilter from '../files/file-mover.filter';

export default class FileController extends AuthController {
    protected root: string = '';
    protected upload: any;
    protected allowedMimeTypes: string[] = [];
    protected maxSize: number = -1;

    constructor(prefix = '', options: { root?: string, fieldname?: string, maxSize?:number } = {}) {
        super(prefix);

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


}