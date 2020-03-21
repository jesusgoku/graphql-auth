import { verify as verifyCallback } from 'jsonwebtoken';
import { promisify } from 'util';

import { SECRET } from './config';

const verify = promisify(verifyCallback);

async function authentication(req, res, next) {
  const { authorization } = req.headers;

  if (!authorization || typeof authorization !== 'string' || !authorization.startsWith('JWT')) {
    next();

    return;
  }

  const [, token] = authorization.split(' ');

  try {
    const { user } = await verify(token, SECRET);

    req.user = user;

    next();
  } catch (err) {
    res.status(500).json({ errors: [{ message: err.message }] });
  }
}

export {
  // eslint-disable-next-line import/prefer-default-export
  authentication,
};
