import Controller from '../controllers/controller';

export interface Route {
    url?: string;
    controller: Controller;
}