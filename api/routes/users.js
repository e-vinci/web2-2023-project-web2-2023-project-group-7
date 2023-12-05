const express = require('express');
const { writescore, getRanking } = require('../models/users');

const router = express.Router();
/* const {
  writescore,
  // login,
  // register,
  // readOneUserFromUsername,
} = require('../models/users'); */
// const { authorize, isAdmin } = require('../utils/auths');

// Route pour l'inscription du score
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
/* GET users listing. */
router.get('/ranking', async (req, res) => {
  const ranking = await getRanking();

  if (!ranking) return res.sendStatus(401); // 401 Unauthorized
  return res.json(ranking);
});

/* GET users listing. */
/* router.get('/', (req, res) => {
  res.json({ users: [{ name: 'e-baron' }] });
}); */

module.exports = router;
