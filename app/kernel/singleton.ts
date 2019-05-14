import express = require("express");

class Singleton {
    private app : any;
    private actions : Array<any> = [];

    getExpressApp() : express.Application{
        return this.app;
    }

    setExpressApp(value : any){
        this.app = value;
    }

    addAction(action : any){
        this.actions.push(action);
    }
}

module.exports = new Singleton();