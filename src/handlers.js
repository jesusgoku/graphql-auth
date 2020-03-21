import { sign as signCallback } from 'jsonwebtoken';
import { promisify } from 'util';
import { uid } from 'rand-token';

import { SECRET } from './config';

const sign = promisify(signCallback);

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
async function login(req, res) {
  const { username } = req.body;

  // TODO: check credentials
  if (!username) {
    res.status(400).json({ errors: [{ message: 'username not found' }] });
  }

  try {
    const token = await sign({ user }, SECRET, { expiresIn: '5m' });
    const refreshToken = uid(256);

    res.json({ token, refreshToken });
  } catch (err) {
    res.status(500).json({ errors: [{ message: 'no token generation' }] });
  }
}

/**
 * Authenticate user from refresh token
 *
 * @param {Request} req express request object
 * @param {Response} res express response object
 */
async function refresh(req, res) {
  const { refreshToken } = req.body;

  // TODO: check refresh token
  if (!refreshToken) {
    res.status(400).json({ errors: [{ message: 'refresh token not found' }] });
  }

  try {
    const token = await sign({ user }, SECRET, { expiresIn: '5m' });

    res.json({ token });
  } catch (err) {
    res.status(500).json({ errors: [{ message: 'no token generation' }] });
  }
}

export { login, refresh };
