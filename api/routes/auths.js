const express = require('express');
const { register, login } = require('../models/users');

const router = express.Router();

/* Register a user */
router.post('/register', async (req, res) => {
  // console.log('fffffffffffffffffffffffffffffffff');
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
/*   const authenticatedUser = await register(username, password);

  if (authenticatedUser==='exist') {
    return res.status(400).json({
       message: 'L\'utilisateur existe déjà',
    })
  }

  if (!authenticatedUser) return res.sendStatus(409); // 409 Conflict
  // req.session.username = authenticatedUser.username;
  // req.session.token = authenticatedUser.token;
  return res.json(authenticatedUser);
});
 *//* Login a user */
router.post('/login', async (req, res) => {
  const username = req?.body?.username?.length !== 0 ? req.body.username : undefined;
  const password = req?.body?.password?.length !== 0 ? req.body.password : undefined;
  // const token = req?.body?.authentification?.length !== 0 ? req.body.authent : undefined;

  // [EIO : DEBUT - Token Test] test si token est présent - TBI

  //  [EIO : FIN - Token Test]

  if (!username || !password) return res.sendStatus(400); // 400 Bad Reques

  const authenticatedUser = await login(username, password);

  if (!authenticatedUser) return res.sendStatus(401); // 401 Unauthorized
  // req.session.username = authenticatedUser.username;
  // req.session.token = authenticatedUser.token;
  return res.json(authenticatedUser);
});
/* Logout a user */
router.get('/logout', (req, res) => {
  req.session = null;
  return res.sendStatus(200);
});

/* router.post('/writescore', async (req, res) => {
  const { username, score } = req.body;
  try {
    await writescore(username, score);
    return res.json();
  } catch (error) {
    console.error('Erreur lors de l\'inscription du score:', error);
    return res.status(500).json({
      message: "Une erreur est survenue lors de l'inscription du score",
    });
  }
}); */

module.exports = router;
