//création d'une fonction async pour récupérer les travaux de l'architecte depuis l'API
async function loadWorks() {

    //récupère et traite la réponse de l'API
    const response = await fetch("http://localhost:5678/api/works")
    const works = await response.json()

    const gallery = document.querySelector(".gallery")

    //création des éléments image dans la div gallery
    for (i = 0; i < works.length; i++) {
        const worksElement = document.createElement("img")
        worksElement.src = works[i].imageUrl

        gallery.appendChild(worksElement)
    }
}

loadWorks()