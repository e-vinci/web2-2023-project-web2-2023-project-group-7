import { login } from "../../../../api/models/users";

const ConnectionPage = () => {
    const main = document.querySelector('main');
  
    // Création de la structure de la page de connexion
    const connectionPageContent = document.createElement('div');
    connectionPageContent.classList.add('connection-page-content');
  
    const usernameLabel = document.createElement('label');
    usernameLabel.textContent = 'Nom d\'utilisateur:';
    const usernameInput = document.createElement('input');
    usernameInput.type = 'text';
    usernameInput.id = 'username';
    usernameInput.name = 'username';
    usernameInput.required = true;
  
    const passwordLabel = document.createElement('label');
    passwordLabel.textContent = 'Mot de passe:';
    const passwordInput = document.createElement('input');
    passwordInput.type = 'password';
    passwordInput.id = 'password';
    passwordInput.name = 'password';
    passwordInput.required = true;
  
    const submitButton = document.createElement('button');
    submitButton.textContent = 'Se connecter';
    submitButton.addEventListener('click', () => {
      // Ajoutez ici la logique pour soumettre le formulaire de connexion
      const username = usernameInput.value;
      const password = passwordInput.value;
  
      // Exemple : Validation basique des champs
      if (username && password) {
        // Envoyez les informations au serveur (vous devrez mettre en place une logique côté serveur pour l'authentification)
        // window.location.href = '/dashboard'; // Redirigez l'utilisateur après la connexion
        // login(username,password);
        alert('Connexion réussie!');
        window.location.href = '/';
      } else {
        alert('Veuillez remplir tous les champs.');
      }
    });
  
    // Ajout des éléments à la page de connexion
    connectionPageContent.appendChild(usernameLabel);
    connectionPageContent.appendChild(usernameInput);
    connectionPageContent.appendChild(passwordLabel);
    connectionPageContent.appendChild(passwordInput);
    connectionPageContent.appendChild(submitButton);
  
    // Effacement du contenu précédent du main
    main.innerHTML = '';
  
    // Ajout de la nouvelle structure à la page principale
    main.appendChild(connectionPageContent);
  };
  
  export default ConnectionPage;
  