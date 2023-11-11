
const RankingPage = () => {
  const main = document.querySelector('main');

  // Création de la structure de la page de classement
  const rankingPageContent = document.createElement('div');
  rankingPageContent.classList.add('ranking-page-content');

  const titleLabel = document.createElement('h2');
  titleLabel.textContent = 'Voici vos 10 dernières parties';

  const backButton = document.createElement('button');
  backButton.textContent = 'Back to Home';
  backButton.addEventListener('click', () => {
    // Ajoutez ici la logique pour rediriger l'utilisateur vers la page d'accueil
    window.location.href = '/'; // Assurez-vous que "/" est le chemin correct de votre page d'accueil
  });

  // Ajout des éléments à la page de classement
  rankingPageContent.appendChild(titleLabel);
  rankingPageContent.appendChild(backButton);

  // Effacement du contenu précédent du main
  main.innerHTML = '';

  // Ajout de la nouvelle structure à la page principale
  main.appendChild(rankingPageContent);
};

export default RankingPage;

