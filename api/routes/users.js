// code mort à supprimer

const express = require('express');
/* const {
  // login,
  // register,
  // readOneUserFromUsername,
} = require('../models/users');
// const { authorize, isAdmin } = require('../utils/auths'); */

const router = express.Router();

/* GET users listing. */
/* router.get('/', (req, res) => {
  res.json({ users: [{ name: 'e-baron' }] });
});
// Route pour l'inscription
router.post('/registerg', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await register(username, password);

    if (user) {
      res.status(201).json({
        message: 'Inscription réussie',
        user,
      });
    } else {
      res.status(400).json({
        message: 'L\'utilisateur existe déjà',
      });
    }
  } catch (error) {
    console.error('Erreur lors de l\'inscription :', error);
    res.status(500).json({
      message: 'Une erreur est survenue lors de l\'inscription',
    });
  }
}); */
module.exports = router;
