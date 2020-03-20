import { sign } from 'jsonwebtoken';
import { uid } from 'rand-token';

import { SECRET } from './config';

const user = {
  id: '1234567890',
  username: 'anonymous',
  roles: ['anonymous'],
};

/**
 * Authenticate user from credentials
 *
 * @param {Request} req express request object
 * @param {Response} res express response object
 */
function login(req, res) {
  const { username } = req.body;

  // TODO: check credentials
  if (!username) {
    res.status(400).json({ errors: [{ message: 'username not found' }] });
  }

  sign({ user }, SECRET, { expiresIn: '5m' }, (err, token) => {
    if (err) {
      res.status(500).json({ errors: [{ message: 'no token generation' }] });
    }

    const refreshToken = uid(256);

    res.json({ token, refreshToken });
  });
}

/**
 * Authenticate user from refresh token
 *
 * @param {Request} req express request object
 * @param {Response} res express response object
 */
function refresh(req, res) {
  const { refreshToken } = req.body;

  // TODO: check refresh token
  if (!refreshToken) {
    res.status(400).json({ errors: [{ message: 'refresh token not found' }] });
  }

  sign({ user }, SECRET, { expiresIn: '5m' }, (err, token) => {
    if (err) {
      res.status(500).json({ errors: [{ message: 'no token generation' }] });
    }

    res.json({ token });
  });
}

export { login, refresh };
