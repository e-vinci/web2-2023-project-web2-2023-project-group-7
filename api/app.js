const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const corsOptions = {
  origin: ['http://localhost:8080', 'https://e-baron.github.io'],
};

const usersRouter = require('./routes/users');
const authsRouter = require('./routes/auths');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(cors(corsOptions));

app.use('/users', usersRouter);
app.use('/auths', authsRouter);

module.exports = app;

/*

const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth'); // Assurez-vous d'ajuster le chemin en conséquence

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware pour analyser les demandes JSON
app.use(bodyParser.json());

// Utilisez les routes d'authentification
app.use('/auths', authRoutes);

// Lancez le serveur
app.listen(PORT, () => {
  console.log(`Le serveur fonctionne sur le port ${PORT}`);
});
*/
