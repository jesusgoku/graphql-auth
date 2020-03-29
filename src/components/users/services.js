import argon2 from 'argon2';

import * as stores from './stores';

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

export { list, get, create, update, remove };
