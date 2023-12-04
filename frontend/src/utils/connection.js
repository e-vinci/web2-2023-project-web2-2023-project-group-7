function storeUser (responseFetch) {
    localStorage.setItem('project.usrnm',responseFetch.username)
    localStorage.setItem('project.tkn',responseFetch.token)
}

export default storeUser ;
