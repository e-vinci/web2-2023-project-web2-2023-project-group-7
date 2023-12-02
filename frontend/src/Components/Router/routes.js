import GamePage from '../Pages/GamePage';
import HomePage from '../Pages/HomePage';
import NewPage from '../Pages/NewPage';
import RankingPage from '../Pages/RankingPage';
import LoginPage from '../Pages/LoginPage';
import RegisterPage from '../Pages/RegisterPage';
import LogoutPage from '../Pages/LogoutPage';


const routes = {
  '/': HomePage,
  '/game': GamePage,
  '/new': NewPage,
  '/ranking':RankingPage,
  '/loginPage': LoginPage,
  '/registerPage': RegisterPage,
  '/logout': LogoutPage,

};

export default routes;
