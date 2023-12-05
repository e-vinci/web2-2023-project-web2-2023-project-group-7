const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const path = require('node:path');
const { parse, serialize } = require('../utils/json');

const jwtSecret = 'ilovemypizza!';
const lifetimeJwt = 24 * 60 * 60 * 1000; // in ms : 24 * 60 * 60 * 1000 = 24h

const saltRounds = 10;

const jsonDbPath = path.join(__dirname, '/../data/users.json');
const jsonDbScorePath = path.join(__dirname, '/../data/score.json');

const defaultUsers = [
  {
    id: 1,
    username: 'admin',
    password: bcrypt.hashSync('admin', saltRounds),
  },
];

async function login(username, password) {
  const userFound = readOneUserFromUsername(username);
  if (!userFound) return undefined;

  const passwordMatch = await bcrypt.compare(password, userFound.password);
  if (!passwordMatch) return undefined;

  const token = jwt.sign(
    { username }, // session data added to the payload (payload : part 2 of a JWT)
    jwtSecret, // secret used for the signature (signature part 3 of a JWT)
    { expiresIn: lifetimeJwt }, // lifetime of the JWT (added to the JWT payload)
  );

  const authenticatedUser = {
    username,
    token,
  };

  return authenticatedUser;
}

async function register(username, password) {
  const userFound = readOneUserFromUsername(username);
  if (userFound) return 'exist';

  await createOneUser(username, password);

  const token = jwt.sign(
    { username }, // session data added to the payload (payload : part 2 of a JWT)
    jwtSecret, // secret used for the signature (signature part 3 of a JWT)
    { expiresIn: lifetimeJwt }, // lifetime of the JWT (added to the JWT payload)
  );

  const authenticatedUser = {
    username,
    token,
  };

  return authenticatedUser;
}

function readOneUserFromUsername(username) {
  const users = parse(jsonDbPath, defaultUsers);
  const indexOfUserFound = users.findIndex((user) => user.username === username);
  if (indexOfUserFound < 0) return undefined;

  return users[indexOfUserFound];
}

async function createOneUser(username, password) {
  const users = parse(jsonDbPath, defaultUsers);

  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const createdUser = {
    id: getNextId(),
    username,
    password: hashedPassword,
  };

  users.push(createdUser);

  serialize(jsonDbPath, users);

  return createdUser;
}

function getNextId() {
  const users = parse(jsonDbPath, defaultUsers);
  const lastItemIndex = users?.length !== 0 ? users.length - 1 : undefined;
  if (lastItemIndex === undefined) return 1;
  const lastId = users[lastItemIndex]?.id;
  const nextId = lastId + 1;
  return nextId;
}

async function writescore(username, score) {
  const userFound = readScoreFromUsername(username);
  if (userFound) {
    console.log(userFound);
    await replaceScoreUser(username, score);
  } else {
    await writeScoreUser(username, score);
  }
  await sortScoreUser();
  const scoredUser = {
    username,
    score,
  };

  return scoredUser;
}

function readScoreFromUsername(username) {
  const users = parse(jsonDbScorePath, []);
  const indexOfUserFound = users.findIndex((user) => user.username === username);
  if (indexOfUserFound < 0) return undefined;

  return users[indexOfUserFound];
}

async function writeScoreUser(username, score) {
  const rankingUsers = parse(jsonDbScorePath, []);
  const scoreUser = {
    id: getNextIdList(jsonDbScorePath, []),
    username,
    score,
  };

  rankingUsers.push(scoreUser);

  serialize(jsonDbScorePath, rankingUsers);

  return scoreUser;
}
function getNextIdList(pathList, defaultList) {
  const itemList = parse(pathList, defaultList);
  const lastItemIndex = itemList?.length !== 0 ? itemList.length - 1 : undefined;
  if (lastItemIndex === undefined) return 1;
  const lastId = itemList[lastItemIndex]?.id;
  const nextId = lastId + 1;
  return nextId;
}
async function replaceScoreUser(username, newscore) {
  const users = parse(jsonDbScorePath, []);
  let newlistusers = null;
  // Trouver l'index du user dans la liste
  const indexOfUserFound = users.findIndex((user) => user.username === username);

  // Vérifier si le user a été trouvé
  if (indexOfUserFound !== -1) {
    // Créer une nouvelle liste mise à jour
    const updatedUsers = users.map((user, index) => {
      if (index === indexOfUserFound) {
        if (user.score < newscore) {
        // Mettre à jour le score du user trouvé
          return { ...user, score: newscore };
        }
      }
      // Garder les autres users inchangés
      return user;
    });

    // Retourner la liste mise à jour
    newlistusers = updatedUsers;
  } else {
  // Si le user n'est pas trouvé, retourner la liste originale
    newlistusers = users;
  }

  serialize(jsonDbScorePath, newlistusers);
  return newlistusers;
}
async function sortScoreUser() {
  const users = parse(jsonDbScorePath, []);
  let newlistusers = null;

  const updatedUsers = [...users]; // Copie du tableau pour éviter la mutation directe

  // Trier la liste mise à jour par ordre décroissant des scores
  updatedUsers.sort((a, b) => b.score - a.score);

  // Mettre à jour les ID après le tri
  updatedUsers.forEach((user, index) => {
    updatedUsers[index].id = index + 1; // Adaptation de l'ID
    // Attantion : si indique user.id au lieu de updatedUsers[index].id
    // cela marche mais le programme indique un erreur :-(
  });

  newlistusers = updatedUsers;

  serialize(jsonDbScorePath, newlistusers);
}
async function getRanking() {
  const ranking = parse(jsonDbScorePath, []);
  return ranking;
}

module.exports = {
  login,
  register,
  readOneUserFromUsername,
  writescore,
  getRanking,
};
