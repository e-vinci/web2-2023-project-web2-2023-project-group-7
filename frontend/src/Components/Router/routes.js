import GamePage from '../Pages/GamePage';
import HomePage from '../Pages/HomePage';
import NewPage from '../Pages/NewPage';
import RankingPage from '../Pages/RankingPage';
import LoginPage from '../Pages/LoginPage';
import RegisterPage from '../Pages/RegisterPage';
import LogoutPage from '../Pages/LogoutPage';
// eslint-disable-next-line import/no-unresolved
import Logout from '../../utils/Logout';

const routes = {
  '/': HomePage,
  '/game': GamePage,
  '/new': NewPage,
  '/ranking':RankingPage,
  '/loginPage': LoginPage,
  '/registerPage': RegisterPage,
  '/logoutPage': LogoutPage,
  '/logout':Logout,

};

export default routes;
