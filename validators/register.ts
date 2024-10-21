import joi from "joi";

const registerValidatorSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().min(6).max(15).required(),
  username: joi.string().required(),
});

export default registerValidatorSchema;