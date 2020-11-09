
require("dotenv-safe").config();
var jwt = require('jsonwebtoken');


export class jwts {
    public verifyJWT(req:any, res:any) {
        
        var token = req.headers['authorization'];
        if (!token) return {val : false,res:res.status(401).json(
            { auth: false, message: 'No token provided.' })};

        return jwt.verify(token, process.env.SECRET,  function abc (err:any, decoded:any) {
            if (err) return {val : false,res:res.status(500).json(
                { auth: false, message: 'Failed to authenticate token.' })};

            // se tudo estiver ok, salva no request para uso posterior
            req.userIdentification = decoded.id;
            return {val:true,res:null};
        });
    }
}