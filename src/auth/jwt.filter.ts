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

    async canAccess(req: any, res: any): Promise<any> {
        if (!req.headers['authorization']) {
            throw new UnauthorizedError('Missing Authorization header');
        } else if (!req.headers['authorization'].startsWith('bearer ')) {
            throw new UnauthorizedError('Authorization header must be prefixed with "bearer "');
        }

        let decoded;
        try {
            decoded = await this.jwt.verify(
                req.headers['authorization'].substring('bearer '.length));
        } catch (e) {
            throw new ForbiddenError(e.message);
        }
        req.decoded = decoded;

        return true;
    }
}