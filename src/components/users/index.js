/* eslint-disable no-shadow */
import joi from '@hapi/joi';
import argon2 from 'argon2';
import { v4 as uuidv4 } from 'uuid';
import { Router } from 'express';
import { Pool } from 'pg';

import { DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME } from '../../config';

// -- SCHEMAS -----------------------------------------------------------------

const schemas = (() => {
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

  return {
    createUserInputSchema,
    updateUserInputSchema,
    createUserRequestSchema,
    updateUserRequestSchema,
  };
})();

// -- HOR ---------------------------------------------------------------------

const highOrderResolver = (() => {
  function validateSchemaResolver(schema, options) {
    return (resolver) => {
      return async (parent, args, context, info) => {
        const validatedArgs = await schema.validateAsync(args, options);

        return resolver(parent, validatedArgs, context, info);
      };
    };
  }

  return {
    validateSchemaResolver,
  };
})();

// -- STORE: LOCAL ------------------------------------------------------------

const stores = (() => {
  let users = {};

  async function create(user) {
    const value = {
      ...user,
      id: uuidv4(),
    };

    users[value.id] = value;

    return value;
  }

  async function get(id) {
    const user = users[id];

    if (!user) {
      throw new Error('Not found');
    }

    return user;
  }

  async function list({ limit = 10, offset = 0 } = {}) {
    return Object.values(users).slice(offset, limit);
  }

  async function update(user) {
    if (!users[user.id]) {
      throw new Error('Not found');
    }

    users[user.id] = user;

    return user;
  }

  async function remove(id) {
    if (!users[id]) {
      throw new Error('Not found');
    }

    const { [id]: _, ...rest } = users;
    users = rest;

    return true;
  }

  return {
    list,
    get,
    create,
    update,
    remove,
  };
})();

// -- STORE: PG ---------------------------------------------------------------

const pgStores = (() => {
  const client = new Pool({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASS,
    database: DB_NAME,
  });

  async function list({ limit, offset }) {
    const result = await client.query(
      'SELECT id, username, password, roles::text[] FROM users LIMIT $1 OFFSET $2',
      [limit, offset],
    );

    return result.rows;
  }

  async function get(id) {
    const result = await client.query(
      'SELECT id, username, password, roles::text[] FROM users WHERE id = $1',
      [id],
    );

    if (result.rows.length === 0) {
      throw new Error('Not found');
    }

    return result.rows[0];
  }

  async function create(user) {
    const id = uuidv4();
    const result = await client.query(
      'INSERT INTO users (id, username, password, roles) VALUES ($1, $2, $3, $4) RETURNING id, username, password, roles::text[]',
      [id, user.username, user.password, user.roles],
    );

    return result.rows[0];
  }

  async function update(user) {
    const result = await client.query(
      'UPDATE users SET username = $1, password = $2, roles = $3 WHERE id = $4 RETURNING id, username, password, roles::text[]',
      [user.username, user.password, user.roles, user.id],
    );

    return result.rows[0];
  }

  async function remove(id) {
    await client.query('DELETE FROM users WHERE id = $1', [id]);

    return true;
  }

  return {
    list,
    get,
    create,
    update,
    remove,
  };
})();

// -- SERVICES ----------------------------------------------------------------

const services = ((stores) => {
  async function list({ limit, offset }) {
    const users = await stores.list({ limit, offset });

    return users.map(({ password: _, ...rest }) => rest);
  }

  async function get(id) {
    const { password: _, ...rest } = await stores.get(id);

    return rest;
  }

  async function create(user) {
    const value = {
      ...user,
      password: await argon2.hash(user.password),
    };

    const { password: _, ...rest } = await stores.create(value);

    return rest;
  }

  async function update(user) {
    const userOld = await stores.get(user.id);
    const { passwordOld, ...value } = user;

    if (value.password) {
      if (!(await argon2.verify(userOld.password, passwordOld))) {
        throw new Error('Bad password');
      }

      value.password = await argon2.hash(value.password);
    } else {
      value.password = userOld.password;
    }

    const { password: _, ...rest } = await stores.update(value);

    return rest;
  }

  async function remove(id) {
    return stores.remove(id);
  }

  return {
    list,
    get,
    create,
    update,
    remove,
  };
})(pgStores);

// -- TYPE DEFS ---------------------------------------------------------------

const typeDefs = `
extend type Query {
  listUsers(limit: Int = 10, offset: Int = 0): [User]
  getUser(id: String!): User
}

type Mutation {
  createUser(user: CreateUserInput): User
  updateUser(user: UpdateUserInput): User
  deleteUser(id: String!): Boolean
}

input CreateUserInput {
  username: String!
  password: String!
  roles: [String!]
}

input UpdateUserInput {
  id: String!
  username: String!
  password: String
  passwordOld: String
  roles: [String!]
}

type User {
  id: String
  username: String
  roles: [String]
}
`;

// -- RESOLVERS ---------------------------------------------------------------

const resolvers = ((services) => {
  async function list(_parent, { limit, offset }) {
    return services.list({ limit, offset });
  }

  async function get(_parent, { id }) {
    return services.get(id);
  }

  async function create(_parent, { user }) {
    return services.create(user);
  }

  async function update(_parent, { user }) {
    return services.update(user);
  }

  async function remove(_parent, { id }) {
    return services.remove(id);
  }

  return {
    list,
    get,
    create,
    update,
    remove,
  };
})(services);

const userResolvers = ((
  { list, get, create, update, remove },
  { validateSchemaResolver },
  { createUserInputSchema, updateUserInputSchema },
) => {
  return {
    Query: {
      listUsers: list,
      getUser: get,
    },

    Mutation: {
      createUser: validateSchemaResolver(createUserInputSchema)(create),
      updateUser: validateSchemaResolver(updateUserInputSchema)(update),
      deleteUser: remove,
    },
  };
})(resolvers, highOrderResolver, schemas);

// -- MIDDLEWARE --------------------------------------------------------------

const middlewares = (() => {
  function validateSchemaMiddleware(schema, options) {
    return async (req, res, next) => {
      try {
        req.body = await schema.validateAsync(req.body, options);

        await next();
      } catch (err) {
        res.status(400).json({ errors: [{ message: err.message }] });
      }
    };
  }

  // eslint-disable-next-line no-unused-vars
  function unhandledExceptionMiddleware(err, _req, res, _next) {
    const statusCode = err.message === 'Not found' ? 404 : 500;
    res.status(statusCode).json({
      errors: [{ message: err.message }],
    });
  }

  return {
    validateSchemaMiddleware,
    unhandledExceptionMiddleware,
  };
})();

// -- HANDLERS ----------------------------------------------------------------

const handlers = ((services) => {
  async function list(req, res) {
    const { limit, offset } = req.query;

    res.json(await services.list({ limit, offset }));
  }

  async function get(req, res) {
    const { id } = req.params;

    res.json(await services.get(id));
  }

  async function create(req, res) {
    const { user } = req.body;

    res.json(await services.create(user));
  }

  async function update(req, res) {
    const { id } = req.params;
    const { user } = req.body;

    res.json(await services.update({ ...user, id }));
  }

  async function remove(req, res) {
    const { id } = req.query;

    await services.remove(id);

    res.sendStatus(204);
  }

  return {
    list,
    get,
    create,
    update,
    remove,
  };
})(services);

// -- ROUTES ------------------------------------------------------------------

const routes = ((
  { list, get, create, update, remove },
  { createUserRequestSchema, updateUserRequestSchema },
  { validateSchemaMiddleware, unhandledExceptionMiddleware },
) => {
  function asyncHandler(handler) {
    return async (req, res, next) => {
      try {
        return await handler(req, res, next);
      } catch (err) {
        return next(err);
      }
    };
  }

  const router = Router();

  router.get('/', asyncHandler(list));
  router.get('/:id', asyncHandler(get));
  router.post('/', validateSchemaMiddleware(createUserRequestSchema), asyncHandler(create));
  router.put('/:id', validateSchemaMiddleware(updateUserRequestSchema), asyncHandler(update));
  router.delete('/:id', asyncHandler(remove));
  router.use(unhandledExceptionMiddleware);

  return router;
})(handlers, schemas, middlewares);

export {
  highOrderResolver,
  userResolvers,
  middlewares,
  resolvers,
  typeDefs,
  handlers,
  services,
  schemas,
  routes,
  stores,
  pgStores,
};
