import ecrandefondhomepage from '../../assets/Capture.png';

import cookieMgt from '../../utils/cookieMgt'

const HomePage = () => {

  const main = document.querySelector('main');
 

  // Création de la structure de la page d'accueil
  const homePageContent = document.createElement('div');
  homePageContent.classList.add('home-page-content');
  homePageContent.id = 'home-page-content';

  // Ajout de styles pour définir l'image de fond
  homePageContent.style.backgroundImage = `url(${ecrandefondhomepage})`;
  homePageContent.style.backgroundSize = 'cover';
  homePageContent.style.backgroundPosition = 'center';
  homePageContent.style.backgroundRepeat = 'no-repeat';

  const buttonsContainer = document.createElement('div');
  buttonsContainer.classList.add('buttons-container');

  const playButton = document.createElement('button');
  playButton.textContent = 'Play';
  playButton.addEventListener('click', () => {
    // Ajoutez ici la logique pour rediriger l'utilisateur vers la page de jeu
    window.location.href = '/game';
  });

  const rankingButton = document.createElement('button');
  rankingButton.textContent = 'Ranking';
  rankingButton.addEventListener('click', () => {
    // Ajoutez ici la logique pour rediriger l'utilisateur vers la page de classement
    window.location.href = '/ranking';
  });

  // Ajout des boutons au conteneur
  buttonsContainer.appendChild(playButton);
  buttonsContainer.appendChild(rankingButton);

  // Ajout du conteneur de boutons à la page d'accueil
  homePageContent.appendChild(buttonsContainer);

  // Effacement du contenu précédent du main
  main.innerHTML = '';

  // Ajout de la nouvelle structure à la page principale
  main.appendChild(homePageContent);

  cookieMgt(homePageContent.id);
};
export default HomePage;
