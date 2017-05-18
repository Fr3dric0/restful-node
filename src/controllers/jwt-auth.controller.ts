import JWTFilter from '../auth/jwt.filter';
import AuthController from './auth.controller';

export default class JWTAuthController extends AuthController {
    protected secret: string;

    constructor(prefix = '', options: {secret:string, ttl?:number}) {
        super(prefix);

        this.secret = options.secret;
        this.authFilters.push(new JWTFilter(options.secret, options.ttl));
    }


}