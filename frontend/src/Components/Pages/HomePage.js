
const HomePage = () => {
  const main = document.querySelector('main');

  // Création de la structure de la page d'accueil
  const homePageContent = document.createElement('div');
  homePageContent.classList.add('home-page-content');

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

  // Ajout des boutons à la page d'accueil
  homePageContent.appendChild(playButton);
  homePageContent.appendChild(rankingButton);

  // Effacement du contenu précédent du main
  main.innerHTML = '';

  // Ajout de la nouvelle structure à la page principale
  main.appendChild(homePageContent);
};

export default HomePage;



