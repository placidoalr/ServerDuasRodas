import {Request, Response } from 'express';
import {HttpMethod, Route} from './route-types';
import { RouteExecute } from './route-execute';

import express = require("express");

export class ApplyRoutes {

    constructor (private app : express.Application, private routes : Array<Route>) {
        this.makeRoutes();
    }

    private executeAction(route : Route, req : Request, resp : Response){
        new RouteExecute(route, req, resp);
    }

    private makeRoutes(){
        this.routes.forEach(route => {
            switch (route.httpMethod){
                case HttpMethod.get:
                    this.app.get(route.routeName, (req : Request, resp : Response) => {
                        this.executeAction(route, req, resp);    
                    });
                break;

                case HttpMethod.post:
                    this.app.post(route.routeName, (req : Request, resp : Response) => {
                        this.executeAction(route, req, resp);
                    });
                break;

                case HttpMethod.put:
                    this.app.put(route.routeName, (req : Request, resp : Response) => {
                        this.executeAction(route, req, resp);
                    });
                break;

                case HttpMethod.patch:
                    this.app.patch(route.routeName, (req : Request, resp : Response) => {
                        this.executeAction(route, req, resp);
                    });
                break;
            };
        });
    }

}