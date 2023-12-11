
function demanderConsentement() {
    // Utiliser la boîte de confirmation pour demander le consentement de l'utilisateur
    const consentement = window.confirm("En utilisant ce site web, vous acceptez les Conditions Générales d'Utilisation. Voulez-vous continuer?");

    // Vérifier la réponse de l'utilisateur
    if (consentement) {
        

        // Vous pouvez également enregistrer le consentement de l'utilisateur dans les cookies ou le stocker d'une manière appropriée
        localStorage.setItem('consentementUtilisateur', true);
    } else {
        // L'utilisateur a refusé les conditions, vous pouvez prendre des mesures appropriées
        alert("Désolé, vous devez accepter les Conditions Générales d'Utilisation pour utiliser le site.");
        // Vous pouvez rediriger l'utilisateur, désactiver certaines fonctionnalités, etc.
    }
}

export default demanderConsentement;