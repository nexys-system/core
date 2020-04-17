import Joi from '@hapi/joi'
import { validate } from './middleware';
import * as T from './type';

export const id:Joi.ObjectSchema<{id:T.Id}> = Joi.object({
  id: Joi.number().required()
});

export const validateId = validate<{id:T.Id}>(id);

export const name:Joi.ObjectSchema<{name:string}> = Joi.object({
  id: Joi.string().required()
});

export const validateName = validate<{name:string}>(name);