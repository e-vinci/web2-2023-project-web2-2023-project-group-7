import Navigate from '../Components/Router/Navigate';
let currentUser;

const getUser = () => {

  if (currentUser !== undefined) return currentUser;

  const serializedUser = localStorage.getItem('project.usrnm');
  if (!serializedUser) return undefined;

  currentUser = JSON.parse(serializedUser);
  return currentUser;

};

const isAuthenticated = () => currentUser !== undefined;

const Logout = () => {
    localStorage.removeItem('project.usrnm');
    localStorage.removeItem('project.tkn');
    currentUser = undefined;
    Navigate('/');
    window.location.reload();
};

// export methode
export { getUser, isAuthenticated, Logout};