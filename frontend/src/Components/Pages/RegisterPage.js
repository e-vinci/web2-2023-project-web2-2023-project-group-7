// eslint-disable-next-line import/no-unresolved
import ecranRanking from '../../assets/Capture1.png';
import Navigate from '../Router/Navigate';

// Définition du composant ConnectionPage
const ConnectionPage = () => {
  // Sélection de l'élément <main> dans le document HTML
  const main = document.querySelector('main');

  // Création d'un conteneur pour la page de connexion
  const connectionPageContent = document.createElement('div');
  connectionPageContent.classList.add('register-page-content');
  connectionPageContent.style.backgroundImage = `url(${ecranRanking})`;
  connectionPageContent.style.backgroundSize = 'cover';
  connectionPageContent.style.backgroundPosition = 'center';
  connectionPageContent.style.height = '100vh';
  connectionPageContent.style.display = 'flex';
  connectionPageContent.style.justifyContent = 'center';
  connectionPageContent.style.alignItems = 'center';

  // Création d'un conteneur pour le formulaire
  const formContainer = document.createElement('div');
  formContainer.classList.add('container', 'col-md-4');

  // Création du formulaire
  const form = document.createElement('form');
  form.classList.add('bg-light', 'p-4', 'rounded');

  // Fonction utilitaire pour créer des éléments de formulaire
  const createFormElement = (labelText, inputType, inputName) => {
    const label = document.createElement('label');
    label.textContent = labelText;
    label.classList.add('form-label');

    const input = document.createElement('input');
    input.type = inputType;
    input.classList.add('form-control');
    input.id = inputName;
    input.name = inputName;
    input.required = true;

    return { label, input };
  };

  // Création des champs du formulaire
  const username = createFormElement('Username', 'text', 'username');
  const password = createFormElement('Password', 'password', 'password');
  const confirmPassword = createFormElement('Confirm Password', 'password', 'confirmPassword');
  const submitButton = document.createElement('button');
  submitButton.textContent = 'Register';

  // Configuration du bouton de soumission
  submitButton.classList.add('btn', 'btn-primary', 'mt-3');
  form.addEventListener('submit', async (event) => {
    // Vérification si les mots de passe correspondent
    if (confirmPassword.input.value !== password.input.value) {
      alert('Passwords do not match');
      Navigate('/');
      event.preventDefault();
      return;
    }

    // Construction de l'objet FormData à partir des valeurs du formulaire
    const formData = {
      username: username.input.value,
      password: password.input.value,
      confirmPassword: confirmPassword.input.value,
    };

    try {
      // Envoi de la requête POST vers l'API d'enregistrement
      const response = await fetch('api/auths/register', {
        method: 'POST',
        body: JSON.stringify(formData),
        mode: 'cors',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });

      // Gestion des erreurs de requête
      if (!response.ok) {
        throw new Error(`Fetch error: ${response.status} : ${response.statusText}`);
      }

      // Redirection vers la page d'accueil après l'enregistrement
      Navigate('/');
      event.preventDefault();
    } catch (error) {
      console.error('Registration failed:', error.message);
    }

    // Redirection vers la page d'accueil (à nouveau)
    Navigate('/');
  });

  // Ajout des champs au formulaire
  [username, password, confirmPassword].forEach(({ label, input }) => {
    form.appendChild(label);
    form.appendChild(input);
  });

  // Ajout du bouton de soumission au formulaire
  form.appendChild(submitButton);

  // Ajout du formulaire au conteneur du formulaire
  formContainer.appendChild(form);

  // Ajout du conteneur du formulaire à la page de connexion
  connectionPageContent.appendChild(formContainer);

  // Effacement du contenu actuel de <main>
  main.innerHTML = '';

  // Ajout de la page de connexion à <main>
  main.appendChild(connectionPageContent);
};

// Exportation du composant ConnectionPage
export default ConnectionPage;
