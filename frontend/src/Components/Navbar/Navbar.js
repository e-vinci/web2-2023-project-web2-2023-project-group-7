// eslint-disable-next-line no-unused-vars
import { Navbar as BootstrapNavbar } from 'bootstrap';

/**
 * Render the Navbar which is styled by using Bootstrap
 * Each item in the Navbar is tightly coupled with the Router configuration :
 * - the URI associated to a page shall be given in the attribute "data-uri" of the Navbar
 * - the router will show the Page associated to this URI when the user click on a nav-link
 */

const Navbar = () => {
  const navbarWrapper = document.querySelector('#navbarWrapper');
  const navbar = `
  <nav class="navbar navbar-expand-lg navbar bg-dark navbar-dark fixed-top">
        <div class="container-fluid">
          
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
              <li class="nav-item">
                <a class="nav-link" aria-current="page" href="#" data-uri="/">Home</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#" data-uri="/game">Game</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#" data-uri="/ranking">Ranking</a>
              </li>
              <li class="nav-item dropdown ml-auto">
                <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">Dropdown</a>
                <ul class="dropdown-menu">
                  <li><a class="dropdown-item" href="#" data-uri="/loginPage">Login</a></li>
                  <li><a class="dropdown-item" href="#" data-uri="/registerPage">Register</a></li>
                </ul>
              </li>  
                     
            </ul>
          </div>
        </div>
      </nav>
  `;
  navbarWrapper.innerHTML = navbar;
};

export default Navbar;
