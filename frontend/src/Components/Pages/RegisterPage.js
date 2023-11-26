// eslint-disable-next-line import/no-unresolved
import ecranRanking from '../../assets/Capture1.png';

const ConnectionPage = () => {
  const main = document.querySelector('main');

  // Création de la structure de la page de connexion
  const connectionPageContent = document.createElement('div');
  connectionPageContent.classList.add('register-page-content');
  connectionPageContent.style.backgroundImage = `url(${ecranRanking})`; // Ajout de l'image comme fond d'écran
  connectionPageContent.style.backgroundSize = 'cover'; // Ajustez la taille de l'image selon vos besoins
  connectionPageContent.style.backgroundPosition = 'center'; // Ajustez la position de l'image selon vos besoins
  connectionPageContent.style.height = '100vh'; // Utilisation de la hauteur de la fenêtre pour occuper tout l'écran
  connectionPageContent.style.display = 'flex'; // Utilisation de flexbox pour centrer le contenu
  connectionPageContent.style.justifyContent = 'center'; // Centrage horizontal
  connectionPageContent.style.alignItems = 'center'; // Centrage vertical

  const formContainer = document.createElement('div');
  formContainer.classList.add('container', 'col-md-4');

  const form = document.createElement('form');
  form.classList.add('bg-light', 'p-4', 'rounded');

  const usernameLabel = document.createElement('label');
  usernameLabel.textContent = 'username';
  usernameLabel.classList.add('form-label');
  const usernameInput = document.createElement('input');
  usernameInput.type = 'text';
  usernameInput.classList.add('form-control');
  usernameInput.id = 'username';
  usernameInput.name = 'username';
  usernameInput.required = true;

  const passwordLabel = document.createElement('label');
  passwordLabel.textContent = 'password';
  passwordLabel.classList.add('form-label');
  const passwordInput = document.createElement('input');
  passwordInput.type = 'password';
  passwordInput.classList.add('form-control');
  passwordInput.id = 'password';
  passwordInput.name = 'password';
  passwordInput.required = true;

  const confirmPasswordLabel = document.createElement('label');
  confirmPasswordLabel.textContent = 'Confirmation password';
  confirmPasswordLabel.classList.add('form-label');
  const confirmPasswordInput = document.createElement('input');
  confirmPasswordInput.type = 'password';
  confirmPasswordInput.classList.add('form-control');
  confirmPasswordInput.id = 'confirmPassword';
  confirmPasswordInput.name = 'confirmPassword';
  confirmPasswordInput.required = true;

  const submitButton = document.createElement('button');
  submitButton.textContent = 'register';
  submitButton.classList.add('btn', 'btn-primary', 'mt-3');
  submitButton.addEventListener('click', (event) => {
    
  // Ajoutez ici la logique pour soumettre le formulaire de connexion
  const username = usernameInput.value;
  const password = passwordInput.value;
  const confirmPassword = confirmPasswordInput.value;

    // Exemple : Validation basique des champs
    if (username  && password && confirmPassword && password === confirmPassword) {
      alert('register complet!');
      /*const response = await fetch(`${process.env.API_BASE_URL}/auths/register`, {
        method: 'POST',
        body: JSON.stringify({ username, password }),
        mode: 'cors',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
    
      //if (!response.ok) {throw new Error(fetch error : ${response.status} : ${response.statusText});}
    
      const authenticatedUser = await response.json();*/

    } else {
      alert('Veuillez remplir tous les champs et assurez-vous que les mots de passe correspondent.');
    }
  });

  // Ajout des éléments au formulaire
  form.appendChild(usernameLabel);
  form.appendChild(usernameInput);
  form.appendChild(passwordLabel);
  form.appendChild(passwordInput);
  form.appendChild(confirmPasswordLabel);
  form.appendChild(confirmPasswordInput);
  form.appendChild(submitButton);

  // Ajout du formulaire au conteneur
  formContainer.appendChild(form);

  // Ajout du conteneur du formulaire à la page de connexion
  connectionPageContent.appendChild(formContainer);

  // Effacement du contenu précédent du main
  main.innerHTML = '';

  // Ajout de la nouvelle structure à la page principale
  main.appendChild(connectionPageContent);
};

export default RegisterPage;
