const clearPage = () => {
  const main = document.querySelector('main');
  main.innerHTML = '';
};

/**
 * Ajoute un titre à la balise <main> du document HTML.
 *
 * @param {string} title - Le titre à afficher.
 */
const renderPageTitle = (title) => {
  if (!title) return;
  const main = document.querySelector('main');
  const pageTitle = document.createElement('h4');
  pageTitle.innerText = title;
  main.appendChild(pageTitle);
};

export { clearPage, renderPageTitle };
