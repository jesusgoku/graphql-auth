import jwt from 'jsonwebtoken';

import { SECRET } from './config';

function authentication(req, res, next) {
  const { authorization } = req.headers;

  if (!authorization || typeof authorization !== 'string' || !authorization.startsWith('JWT')) {
    next();

    return;
  }

  const [, token] = authorization.split(' ');

  jwt.verify(token, SECRET, (err, { user } = {}) => {
    if (err) {
      res.json({ errors: [{ message: err.message }] });

      return;
    }

    req.user = user;

    next();
  });
}

export {
  // eslint-disable-next-line import/prefer-default-export
  authentication,
};
