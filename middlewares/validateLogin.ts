import {Request,Response,NextFunction} from "express";
import loginValidator from "../validators/login";

const validateLogin = (req:Request,res:Response,next:NextFunction) => {
    const {error} = loginValidator.validate(req.body,{abortEarly:false});
    if(error){
        res.status(400).json({success:false,message:error.message});
        return;
    }
    next();
}

export default validateLogin;