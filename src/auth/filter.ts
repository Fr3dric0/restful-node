
export default class Filter {

    canAccess(req: Request, res: Response): Promise<any> {
        return new Promise((rsv, rr) => {
            rsv(true);
        });
    }
}