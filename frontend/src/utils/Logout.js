import Navigate from '../Components/Router/Navigate';

const Logout = () => {
    // pas de page Logout
/*     fetch('api/auths/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
 */      // fin de page de page logout
    localStorage.removeItem('project.usrnm');
    localStorage.removeItem('project.tkn');
        // Redirige vers la home page et la rafraichit
        Navigate('/');
        window.location.reload();
}
export default Logout

