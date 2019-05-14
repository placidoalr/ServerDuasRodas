export class VpAppConfig {
    private debug : boolean = false;

    public redisServer() : string{
        let result = '';

        if (this.debug){
            result = 'localhost';
        }

        if (!this.debug){
            if (process.env.REDIS_SERVER !== undefined){
                result = (process.env.REDIS_SERVER as string);
            }
        }

        return result;
    }

    public redisPassword() : string {
        let result = '';

        if (!this.debug){
            if (process.env.REDIS_PASSWORD !== undefined){
                result = (process.env.REDIS_PASSWORD as string);
            }
        }

        return result;
    }

    public redisPort() : number{
        let result = 6379;

        if (!this.debug){
            if (process.env.REDIS_PORT !== undefined){
                result = Number(process.env.REDIS_PORT);
            }
        }

        return result;
    }

    public redisDB() : number{
        let result = 0;

        if (!this.debug){
            if (process.env.REDIS_DB !== undefined){
                result = Number(process.env.REDIS_DB);
            }
        }

        return result;
    }
}