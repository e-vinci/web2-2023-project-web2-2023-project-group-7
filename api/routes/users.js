const express = require('express');
const {
  login,
  register,
  readOneUserFromUsername,
  createOneUser,
  getNextId,
} = require('../models/users');
const { authorize, isAdmin } = require('../utils/auths');

const router = express.Router();

/* GET users listing. */
router.get('/', (req, res) => {
  res.json({ users: [{ name: 'e-baron' }] });
});

module.exports = router;
