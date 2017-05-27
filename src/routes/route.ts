import Controller from '../controllers/rest-controller';

export interface Route {
    url?: string;
    controller: Controller;
}