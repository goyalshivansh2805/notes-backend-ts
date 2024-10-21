import {Request,Response,NextFunction} from "express";
import loginValidator from "../validators/login";
import { CustomError } from "../types/express";

const validateLogin = (req:Request,res:Response,next:NextFunction) => {
    const {error} = loginValidator.validate(req.body,{abortEarly:false});
    if(error){
        const err:CustomError = new Error(error.message);
        err.statusCode = 400;
        next(err);
    }
    next();
}

export default validateLogin;