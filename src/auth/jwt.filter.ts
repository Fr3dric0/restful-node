import JWT from './jwt';
import Filter from './filter';
import { ForbiddenError, UnauthorizedError } from '../errors';

export default class JWTFilter extends Filter {
    private secret: string;
    private ttl: number;
    private jwt: JWT;

    constructor(secret: string, ttl: number = null) {
        super();
        this.secret = secret;
        this.ttl = ttl;
        this.jwt = new JWT(secret, ttl);
    }

    canAccess(req: any, res: any): Promise<any> {
        return new Promise((rsv, rr) => {
            if (!req.headers['authorization']) {
                return rr(new UnauthorizedError('Missing Authorization header'));
            } else if (!req.headers['authorization'].startsWith('bearer ')) {
                return rr(new UnauthorizedError('Authorization header must be prefixed with "bearer "'));
            }

            this.jwt.verify(req.headers['authorization'].substring('bearer '.length))
                .then((decoded) => {
                    req.decoded = decoded;
                    rsv(true);
                })
                .catch(err => rr(new ForbiddenError(err.message)));
        });
    }
}