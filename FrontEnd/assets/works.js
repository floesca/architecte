//création d'une fonction async pour récupérer les travaux de l'architecte depuis l'API
async function loadWorks() {

    //récupère et traite la réponse de l'API
    const response = await fetch("http://localhost:5678/api/works")
    const works = await response.json()

    const gallery = document.querySelector(".gallery")

    //création des éléments image dans la div gallery
    for (i = 0; i < works.length; i++) {
        //création d'une div pour l'image et le titre
        const figure = document.createElement("div")

        //image
        const worksElement = document.createElement("img")
        worksElement.src = works[i].imageUrl

        //titre de l'image
        const titleElement = document.createElement("p")
        titleElement.textContent = works[i].title

        //image et texte reliés à leur parent div
        figure.appendChild(worksElement)
        figure.appendChild(titleElement)

        //div elle-même reliée au parent gallery
        gallery.appendChild(figure)
    }
}

loadWorks()