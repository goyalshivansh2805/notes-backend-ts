import {Request,Response,NextFunction} from "express";
import loginValidator from "../validators/login";
import CustomError from "../types/customError";

const validateLogin = (req:Request,res:Response,next:NextFunction) => {
    const {error} = loginValidator.validate(req.body,{abortEarly:false});
    if(error){
        const err:CustomError = new CustomError(error.message,400);      
        next(err);
    }
    next();
}

export default validateLogin;