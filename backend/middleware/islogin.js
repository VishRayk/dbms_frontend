import jwt from 'jsonwebtoken'
import db from '../sql_Setup/sql_Setup.js'

async function middleware(req,res, next){
    const token = req.headers.token

    try{
        if(!token){
            return res.status(401).json({error: "No token provided"})
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if(!decoded){
            return res.status(401).json({error: "Invalid token"})
        }

        

    }
    catch(error){
        res.status(401).json({error: "Invalid token"})
    }
}


function withDB(dbInstance) {
  return function (req, res, next) {
    req.db = dbInstance;
    next();
  };
}

export { middleware, withDB }