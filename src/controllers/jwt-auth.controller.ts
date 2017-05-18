import JWTFilter from '../auth/jwt.filter';
import AuthController from './auth.controller';

export default class JWTAuthController extends AuthController {

    constructor(prefix = '') {
        super(prefix);

        this.authFilters.push(new JWTFilter());
    }


}