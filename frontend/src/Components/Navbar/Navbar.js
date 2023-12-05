// eslint-disable-next-line no-unused-vars
import { Navbar as BootstrapNavbar } from 'bootstrap';

import logo from '../../assets/logoHuman.png';

/**
 * Render the Navbar which is styled by using Bootstrap
 * Each item in the Navbar is tightly coupled with the Router configuration :
 * - the URI associated to a page shall be given in the attribute "data-uri" of the Navbar
 * - the router will show the Page associated to this URI when the user click on a nav-link
 */
let usrnmSession = null;
     
if(localStorage.getItem('project.usrnm')!== null ){
  usrnmSession = localStorage.getItem('project.usrnm')
}else{
  usrnmSession = "Unknow"

}
const Navbar = () => {
  const navbarWrapper = document.querySelector('#navbarWrapper');
  const navbar = `
  height: 10%;
  <nav class="navbar navbar-expand-sm bg-dark navbar-dark fixed-top">
  <div class="container-fluid">

    <!-- Links -->
    <ul class="navbar-nav mr-auto">
    <li class="nav-item">
      <!-- Brand -->
      <a class="navbar-brand" href="#" data-uri="/game">
        <img src="${logo}" alt="logo" style="width:50px">
      </a>
      </li>
      <!-- Links -->
      <li class="nav-item">
        <a class="nav-link" aria-current="page" href="#" data-uri="/">Home</a>
      </li>
      <li class="nav-item">
      <a class="nav-link" href="#" data-uri="/game">Game</a>
      </li>
      <li class="nav-item">
      <a class="nav-link" href="#" data-uri="/ranking">Ranking</a>
    </li>
    </ul>
    <!-- Dropdown -->
    <ul class="navbar-nav ml-auto">
    <li class="nav-item-right dropdown">
    <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">${usrnmSession}</a>
    <ul class="dropdown-menu">
    <li><a class="dropdown-item" href="#" data-uri="/logout">Logout</a></li>
    </ul>
  </div><!-- /.container-fluid -->

    <!-- Dropdown -->
    <ul class="navbar-nav ml-auto">
    <li class="nav-item-right dropdown">
    <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">connection</a>
    <ul class="dropdown-menu">
      <li><a class="dropdown-item" href="#" data-uri="/loginPage">Login</a></li>
      <li><a class="dropdown-item" href="#" data-uri="/registerPage">Register</a></li>
    </ul>
  </div><!-- /.container-fluid -->
</nav>

 
  `;
  navbarWrapper.innerHTML = navbar;
};


export default Navbar ;
