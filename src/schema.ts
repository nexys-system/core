import Joi from '@hapi/joi'
import { validate } from './middleware';
import { types as T } from '@nexys/utils'

export const id:Joi.ObjectSchema<{id:T.Id}> = Joi.object({
  id: Joi.number().required()
});

export const uuid:Joi.ObjectSchema<{uuid:T.Uuid}> = Joi.object({
  id: Joi.string().guid().required()
});

export const name:Joi.ObjectSchema<{name:string}> = Joi.object({
  id: Joi.string().required()
});

export const validateId = validate<{id:T.Id}>(id);

export const validateUuid = validate<{uuid:T.Uuid}>(uuid);

export const validateName = validate<{name:string}>(name);