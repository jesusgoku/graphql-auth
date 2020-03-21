import { verify as verifyCallback } from 'jsonwebtoken';
import { promisify } from 'util';

import { SECRET } from './config';
import { extractTokenFromRequest } from './utils';

const verify = promisify(verifyCallback);

async function authentication(req, res, next) {
  const token = extractTokenFromRequest(req);

  if (!token) {
    next();

    return;
  }

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
