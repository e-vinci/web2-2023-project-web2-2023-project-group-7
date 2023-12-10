const express = require('express');
const { writescore, getRanking } = require('../models/users');

const router = express.Router();

/**
 * Endpoint to register a user's score.
 *
 * @route POST /writescore
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Object} - Express response object.
 */
router.post('/writescore', async (req, res) => {
  const { username, score } = req.body;
  try {
    await writescore(username, score);
  } catch (error) {
    console.error('Erreur lors de l\'inscription du score:', error);
    res.status(500).json({
      message: 'Une erreur est survenue lors de l\'inscription du score',
    });
  }
  return res.json();
});

/**
 * Endpoint to retrieve the ranking of users.
 *
 * @route GET /ranking
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Object} - Express response object.
 */
router.get('/ranking', async (req, res) => {
  const ranking = await getRanking();

  if (!ranking) return res.sendStatus(401); // 401 Unauthorized
  return res.json(ranking);
});

module.exports = router;
