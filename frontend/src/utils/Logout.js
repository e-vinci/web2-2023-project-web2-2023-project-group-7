import Navigate from '../Components/Router/Navigate';

/**
 * Déconnecte l'utilisateur en supprimant les informations de connexion stockées localement
 * et en redirigeant l'utilisateur vers la page d'accueil tout en actualisant la page.
 */
const Logout = () => {
    localStorage.removeItem('project.usrnm');
    localStorage.removeItem('project.tkn');
        // Redirige vers la home page et la rafraichit
        Navigate('/');
        window.location.reload();
}
export default Logout

