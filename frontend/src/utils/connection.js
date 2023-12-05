// sauve les données utilisateur pour une utilisation future tant qu'il ne se délogue pas
const storeUser =  (responseFetch) => {
    localStorage.setItem('project.usrnm',responseFetch.username);
    localStorage.setItem('project.tkn',responseFetch.token);
}
// enregistre les scores
const sentScore = async (username, score) => {
    try {
        const formData = {
            'username': username,
            'score': score,
        };

        const response = await fetch('api/users/writescore', {
            method: 'POST',
            body: JSON.stringify(formData),
            headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
            throw new Error(`Request failed with status: ${  response.status}`);
        }

        // Vérifie la valeur du retour
        const responseData = await response.json();
        console.log('Response data:', responseData);

    } catch (error) {
        console.error('Request failed:', error.message);
    }
};
// Aller chercher le classement
const getRanking = async  () => {
    // GET car pas besoin de modifier, passer des données & rien de secret
    const response = await fetch('api/users/Ranking', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
        throw new Error(`Request failed with status: ${  response.status}`);
    }

    // Vérifie la valeur du retour
    const responseData = await response.json();
    return responseData;
}
export { storeUser, sentScore , getRanking };

