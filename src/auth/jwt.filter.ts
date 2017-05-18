import JWT from './jwt';
import Filter from './filter';

export default class JWTFilter extends Filter {

    canAccess(req: Request, res: Response): Promise<any> {
        return new Promise((rsv, rr) => {

        });
    }
}