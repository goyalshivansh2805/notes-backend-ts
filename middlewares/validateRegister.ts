import {Request,Response,NextFunction} from "express";
import registerValidatorSchema from "../validators/register";
import CustomError from "../types/customError";

const validateRegister = (req:Request,res:Response,next:NextFunction) => {
    const {error} = registerValidatorSchema.validate(req.body,{abortEarly:false});
    if(error){
        const err:CustomError = new CustomError(error.message,400);
        next(err);
    }
    next();
}

export default validateRegister;