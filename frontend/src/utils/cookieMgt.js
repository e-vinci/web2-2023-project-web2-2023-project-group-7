import 'bootstrap/dist/css/bootstrap.min.css';

// texte pour le bandeau cookie
// texte par défaut
const acceptTxtcookie = `        <div>
Ce site utilise des cookies et des technologies similaires pour améliorer votre expérience de navigation. Ils sont utilisés uniquement à des fins d'identification afin de permettre l'utilisation technique du site.
<br><br>
En continuant à naviguer sur ce site, vous consentez à l'utilisation de ces cookies. Pour en savoir plus sur la manière dont nous utilisons les cookies et comment vous pouvez les gérer, veuillez consulter notre politique de confidentialité.
<br><br>
En cliquant sur "Accepter", vous consentez à l'utilisation de tous les cookies à des fins d'identification. Si vous choisissez de ne pas accepter, certaines fonctionnalités du site pourraient être limitées.
<br><br>
Merci de votre compréhension et bonne navigation sur notre site.
<br><br>
<button id = 'cookie-accept-button' >Accepter</button>
<button id = 'cookie-info-button' >En savoir plus</button>
</div>`

// texte info cookie
const infoTxtcookie = ` <div id="infoCookieTechnique">
<p>
    Ce site utilise uniquement des cookies techniques ou des technologies similaires aux fins suivantes :
    Ces cookies permettent aux internautes d’accéder à la plateforme tout en sécurisant leurs données personnelles. Ils sont essentiellement nécessaires à la navigation et s’avèrent indispensables pour l'application. Ils donnent accès à toutes les fonctionnalités du site ou de l’application et reconnaissent les utilisateurs à chacune de leurs visites. Ils aident à la mémorisation des mots de passe ainsi que des informations renseignées dans un formulaire rempli sur le site.
</p>
<p>
    Les cookies techniques ont la particularité de sécuriser la navigation. À cet effet, ils peuvent, par exemple, demander aux visiteurs de se reconnecter à l’espace adhérent après une longue période d’inactivité. L’accès au site est conditionné par l’utilisation de cookies ou de technologies similaires, ce qui veut dire qu’il n'est pas possible d'accéder à la plateforme en cas de suppression de cookies.
</p>
<p>
    Ces cookies ne durent pas longtemps. Ils peuvent être supprimés à travers les paramètres du navigateur. Dans ce cas, l’utilisateur risque de ne plus accéder au site, à l’application ou aux services de la plateforme web. Leur durée de vie peut se limiter à quelques heures ou à une année au maximum.
</p>
<button id = 'cookie-accept-button' >Accepter</button>
<button id = 'cookie-refus-button' >Refuser</button>
</div>`

/**
 * Gère l'affichage d'un bandeau de cookies et les actions associées.
 *
 * @param {string} id - L'identifiant de l'élément à verrouiller en cas de refus des cookies.
 * @returns {boolean} - Retourne true si les cookies ont déjà été acceptés, sinon false.
 */
const cookieBandeau = (id) => {
  const acceptCookies = () => {
    const banner = document.getElementById('cookie-banner');
    banner.style.display = 'none';
    sessionStorage.setItem('project.cookies', true);
    document.getElementById('main-navbar').classList.remove('page-locked');
    document.getElementById(id).classList.remove('page-locked');
   
  };
   const refuserCookies = () => {
    const banner = document.getElementById('cookie-banner');
    banner.style.display = 'none';
    localStorage.removeItem('project.usrnm');
    localStorage.removeItem('project.tkn');
    window.location.reload();
   
  };

  const cookieOrNotCookie = sessionStorage.getItem('project.cookies');

  if (!cookieOrNotCookie) {
    // Affiche le bandeau uniquement si les cookies n'ont pas encore été acceptés
    const cookieBanner = document.createElement('div');
    cookieBanner.id = 'cookie-banner';
    cookieBanner.innerHTML =acceptTxtcookie;
    document.body.appendChild(cookieBanner);
    // gestion des boutons
    const acceptButton = document.getElementById('cookie-accept-button');
    acceptButton.addEventListener('click', acceptCookies);
    const infoButton = document.getElementById('cookie-info-button');

    if (infoButton !== null) {
      // L'élément existe, vous pouvez l'utiliser en toute sécurité
      infoButton.addEventListener('click', () => {
        cookieBanner.innerHTML =infoTxtcookie;
        const refusButton = document.getElementById('cookie-refus-button');
        if (refusButton !== null) {
                refusButton.addEventListener('click', refuserCookies);
        }
      });
  }
    // Ajoute la classe "page-locked" uniquement à l'élément <nav>
    document.getElementById('main-navbar').classList.add('page-locked');
    document.getElementById(id).classList.add('page-locked');
   
  }
 
  return !!cookieOrNotCookie;
};

const cookiesMgt = (id) => cookieBandeau(id);

export default cookiesMgt ;
