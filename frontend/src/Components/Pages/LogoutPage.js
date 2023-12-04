 // import Navigate from '../Router/Navigate';
const LogoutPage = () => {
    const main = document.querySelector('main');
  
    const logoutPageContent = document.createElement('div');
    logoutPageContent.classList.add('logout-page-content');
    // Personnalisez le style de la page de déconnexion selon vos besoins
  
    const logoutButton = document.createElement('button');
    logoutButton.textContent = 'Logout';
    logoutButton.classList.add('btn', 'btn-danger', 'mt-3');
    logoutButton.addEventListener('click', async (event) => {
      event.preventDefault();
      
  
      try {
        const response = await fetch('api/auths/logout', {
          method: 'POST',
          
          headers: { 'Content-Type': 'application/json' },
        });
  
        if (!response.ok) {
          // Gérez les erreurs de déconnexion si nécessaire
          console.error('Logout failed:', response.status, response.statusText);
          throw new Error(`Fetch error: ${response.status} : ${response.statusText}`);
        }
  
        // Redirigez l'utilisateur vers la page de connexion après la déconnexion
        // eslint-disable-next-line no-undef
        ConnectionPage();
      } catch (error) {
        console.error('Logout failed:', error.message);
      }
    });
  
    logoutPageContent.appendChild(logoutButton);
  
    main.innerHTML = '';
    main.appendChild(logoutPageContent);
  };
  
  export default LogoutPage;