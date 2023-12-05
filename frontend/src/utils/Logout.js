import Navigate from '../Components/Router/Navigate';

const Logout = () => {
    localStorage.removeItem('project.usrnm');
    localStorage.removeItem('project.tkn');
        // Redirige vers la home page et la rafraichit
        Navigate('/');
        window.location.reload();
}
export default Logout

