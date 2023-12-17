
/**
 * Ajoute un préfixe au chemin d'URL fourni en fonction des conditions d'environnement.
 *
 * @param {string} path - Le chemin d'URL à traiter.
 * @returns {string} - Le chemin d'URL avec le préfixe ajouté (si applicable).
 */
const usePathPrefix = (path) => {
  if (process.env.BUILD_MODE !== 'production') return path;

  let pathPrefix = process.env.PATH_PREFIX;
  if (pathPrefix.length > 1) {
    if (pathPrefix.at(-1) === '/') pathPrefix = pathPrefix.slice(0, -1);
    return pathPrefix + path;
  }
  return path;
};

/**
 * Supprime le préfixe du chemin d'URL fourni en fonction des conditions d'environnement.
 *
 * @param {string} path - Le chemin d'URL à traiter.
 * @returns {string} - Le chemin d'URL sans le préfixe (si applicable).
 */
const removePathPrefix = (path) => {
  if (process.env.BUILD_MODE !== 'production') return path;

  let pathPrefix = process.env.PATH_PREFIX;
  if (pathPrefix.length > 1) {
    if (pathPrefix.at(-1) === '/') pathPrefix = pathPrefix.slice(0, -1);
    return path.replace(pathPrefix, '');
  }
  return path;
};

export { usePathPrefix, removePathPrefix };
