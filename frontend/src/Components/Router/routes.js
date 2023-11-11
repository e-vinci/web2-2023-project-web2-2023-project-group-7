import GamePage from '../Pages/GamePage';
import HomePage from '../Pages/HomePage';
import NewPage from '../Pages/NewPage';
import RankingPage from '../Pages/RankingPage';
import ConnectionPage from '../Pages/ConnectionPage';


const routes = {
  '/': HomePage,
  '/game': GamePage,
  '/new': NewPage,
  '/ranking':RankingPage,
  '/connectionPage': ConnectionPage
};

export default routes;
