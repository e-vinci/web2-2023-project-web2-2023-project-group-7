// import 'bootstrap/dist/css/bootstrap.min.css'; // Import du fichier CSS Bootstrap
// eslint-disable-next-line import/no-unresolved
import ecrandefondhomepage from '../../assets/Capture3.png';
import { getRanking } from '../../utils/connection';

const RankingPage = async () => {
  const main = document.querySelector('main');

  // Création de la structure de la page de classement
  const rankingPageContent = document.createElement('div');
  rankingPageContent.classList.add('ranking-page-content', 'd-flex', 'flex-column', 'align-items-center', 'justify-content-center', 'text-center', 'h-100');

  // Fetch ranking data
  try {
    const rankingData = await getRanking();

    // Création du tableau pour afficher les données de classement
    const rankingTable = document.createElement('table');
    rankingTable.classList.add('table', 'table-striped', 'mt-3'); // Ajout des classes Bootstrap pour styliser le tableau

    // Création de l'en-tête du tableau
    const tableHeader = document.createElement('thead');
    const headerRow = document.createElement('tr');
    const headerColumns = ['Rank', 'Username', 'Score']; // Mettez les noms de colonnes appropriés ici

    headerColumns.forEach((column) => {
      const th = document.createElement('th');
      th.textContent = column;
      headerRow.appendChild(th);
    });

    tableHeader.appendChild(headerRow);
    rankingTable.appendChild(tableHeader);

    // Création du corps du tableau avec les données
    const tableBody = document.createElement('tbody');
    rankingData.forEach((rowData) => {
      const row = document.createElement('tr');
      Object.values(rowData).forEach((value) => {
        const td = document.createElement('td');
        td.textContent = value;
        row.appendChild(td);
      });
      tableBody.appendChild(row);
    });

    rankingTable.appendChild(tableBody);

    // Ajout du tableau à la page de classement
    rankingPageContent.appendChild(rankingTable);
  } catch (error) {
    console.error('Error fetching ranking data:', error);
  }

  const backButton = document.createElement('button');
  backButton.textContent = 'Back to Home';
  backButton.classList.add('btn', 'btn-primary', 'mt-3'); // Ajout des classes Bootstrap pour styliser le bouton
  backButton.addEventListener('click', () => {
    // Ajoutez ici la logique pour rediriger l'utilisateur vers la page d'accueil
    window.location.href = '/'; // Assurez-vous que "/" est le chemin correct de votre page d'accueil
  });

  // Ajout des éléments à la page de classement
  rankingPageContent.appendChild(backButton);

  // Effacement du contenu précédent du main
  main.innerHTML = '';

  // Ajout de la nouvelle structure à la page principale
  main.appendChild(rankingPageContent);

  // Pour définir l'image en arrière-plan en plein écran, nous pouvons utiliser le style directement sur le body
  document.body.style.backgroundImage = `url(${ecrandefondhomepage})`;
  document.body.style.backgroundSize = 'cover';
  document.body.style.backgroundPosition = 'center';
  document.body.style.backgroundAttachment = 'fixed'; // Ajout d'une propriété pour fixer l'image en arrière-plan
};

export default RankingPage;
