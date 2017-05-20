import * as fs from 'fs';

/**
 * Moves the file from one location to another
 * @param   {string}    src     Source path
 * @param   {string}    dest    Destination path
 * @return  {Promise}
 * */
export function mv(src:string, dest:string): Promise<string> {
    return new Promise((rsv, rr) => {
        const srcStream = fs.createReadStream(src);
        const destStream = fs.createWriteStream(dest);

        srcStream.pipe(destStream);

        srcStream.on('error', (err) => rr(err));
        srcStream.on('end', () => {
           fs.unlink(src);
           rsv(dest);
        });
    });
}

/**
 * Will remove a file
 * @param   {string}    src     Source Folder
 * */
export function rm(src:string): Promise<any> {
    return new Promise((rsv, rr) => {
        fs.unlink(src, (err) => {
            if (err) { return rr(err); }
            rsv(src);
        })
    });
}


/**
 * Lists items in a directory
 * @param   {string}    dir     Directory
 * @return  {Promise}   List of all files
 * */
export function ls(dir: string): Promise<string[]> {
    return new Promise((rsv, rr) => {
        fs.readdir(dir, (err, items) => {
            if (err) { return rr(err); }
            rsv(items);
        })
    });
}