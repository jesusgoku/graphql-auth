import joi from '@hapi/joi';

const idSchema = joi.string().uuid();
const usernameSchema = joi
  .string()
  .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } });
const rolesSchema = joi.array().items(joi.valid('user', 'admin'));
const passwordSchema = joi.string().pattern(new RegExp('^[a-zA-Z0-9]{8,30}$'));

const baseSchema = joi.object({
  username: usernameSchema.required(),
  roles: rolesSchema.required(),
});

const createSchema = baseSchema.keys({
  password: passwordSchema.required(),
});

const updateSchema = baseSchema
  .keys({
    password: passwordSchema,
    passwordOld: passwordSchema,
  })
  .with('password', 'passwordOld');
const createUserInputSchema = joi.object({
  user: createSchema.required(),
});

const updateUserInputSchema = joi.object({
  user: updateSchema
    .keys({
      id: idSchema.required(),
    })
    .required(),
});

const createUserRequestSchema = joi.object({
  user: createSchema.required(),
});

const updateUserRequestSchema = joi.object({
  user: updateSchema.required(),
});

export {
  createUserInputSchema,
  updateUserInputSchema,
  createUserRequestSchema,
  updateUserRequestSchema,
};
