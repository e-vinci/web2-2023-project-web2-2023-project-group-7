const express = require('express');
const { register, login } = require('../models/users');

const router = express.Router();

/**
 * Endpoint to register a new user.
 *
 * @route POST /register
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Object} - Express response object.
 */
router.post('/register', async (req, res) => {
  const username = req?.body?.username?.length !== 0 ? req.body.username : undefined;
  const password = req?.body?.password?.length !== 0 ? req.body.password : undefined;

  if (!username || !password) return res.sendStatus(400); // 400 Bad Request

  const result = await register(username, password);

  if (result === 'exist') {
    return res.status(400).json({
      message: 'L\'utilisateur existe déjà',
    });
  }

  if (!result) return res.sendStatus(409); // 409 Conflict

  return res.json(result);
});

/**
 * Endpoint to log in a user.
 *
 * @route POST /login
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Object} - Express response object.
 */
router.post('/login', async (req, res) => {
  const username = req?.body?.username?.length !== 0 ? req.body.username : undefined;
  const password = req?.body?.password?.length !== 0 ? req.body.password : undefined;

  if (!username || !password) return res.sendStatus(400); // 400 Bad Reques

  const authenticatedUser = await login(username, password);

  if (!authenticatedUser) return res.sendStatus(401); // 401 Unauthorized
  return res.json(authenticatedUser);
});

/**
 * Endpoint to log out a user.
 *
 * @route GET /logout
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Object} - Express response object.
 */router.get('/logout', (req, res) => {
  req.session = null;
  return res.sendStatus(200);
});

module.exports = router;
