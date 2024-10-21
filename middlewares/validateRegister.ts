import {Request,Response,NextFunction} from "express";
import registerValidatorSchema from "../validators/register";

const validateRegister = (req:Request,res:Response,next:NextFunction) => {
    const {error} = registerValidatorSchema.validate(req.body,{abortEarly:false});
    if(error){
        res.status(400).json({success:false,message:error.message});
        return;
    }
    next();
}

export default validateRegister;