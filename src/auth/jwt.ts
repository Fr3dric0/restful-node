import * as jwt from 'jsonwebtoken';

export default class JWT {
    private secret: string;
    private ttl: number;

    constructor(secret: string, ttl: number = null) {
        this.secret = secret;
        this.ttl = ttl;
    }

    create(sub: any): string {
        return jwt.sign({data: sub}, this.secret, this.ttl ? {expiresIn: this.ttl} : {});
    }

    verify(token: string): Promise<any> {
        return new Promise((rsv, rr) => {
            jwt.verify(token, this.secret, (err, decoded) => {
                if (err) { return rr(err); }

                rsv(decoded);
            });
        });
    }
}