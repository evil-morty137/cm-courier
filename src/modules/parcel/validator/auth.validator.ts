import { Joi, validate } from "express-validation";

export const exchangePublicToken = validate({
    body: Joi.object()
})