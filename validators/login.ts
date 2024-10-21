import joi from "joi";

const loginValidatorSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().min(6).max(15).required(),
});


export default loginValidatorSchema;