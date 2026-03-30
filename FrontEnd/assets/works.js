let works = []

//création d'une fonction async pour récupérer les travaux de l'architecte depuis l'API
async function fetchWorks() {
    //récupère et traite la réponse de l'API
    const response = await fetch("http://localhost:5678/api/works")
    works = await response.json()
    loadWorks(works)
}

//fonction affichage des travaux
function loadWorks(works) {
    const gallery = document.querySelector(".gallery")
    gallery.innerHTML = "" 
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
//récupération initiale
fetchWorks()

//création boutons filtres
const filters = document.querySelector(".filters")

    //bouton tous
    const filtreTous = document.createElement("button")
    filtreTous.textContent = "Tous"

    filtreTous.addEventListener("click", () => {
        loadWorks(works)
        console.log(works)
    })
    filters.appendChild(filtreTous)

    //bouton objets
    const filtreObjets = document.createElement("button")
    filtreObjets.textContent = "Objets"

    filtreObjets.addEventListener("click", () => {
    const objets = works.filter(works => works.categoryId === 1)
    
    //effacement de l'écran et régénération de la page avec les images filtrées
    document.querySelector(".gallery").innerHTML = ""
    loadWorks(objets)
    console.log(objets)
    })
    filters.appendChild(filtreObjets)

    //bouton appartements
    const filtreAppartements = document.createElement("button")
    filtreAppartements.textContent = "Appartements"

    filtreAppartements.addEventListener("click", () => {
    const appartements = works.filter(works => works.categoryId === 2)
    document.querySelector(".gallery").innerHTML = ""
    loadWorks(appartements)
    console.log(appartements)
    })
    filters.appendChild(filtreAppartements)

    //bouton hôtels
    const filtreHotels = document.createElement("button")
    filtreHotels.textContent = "Hôtels & restaurants"
    
    filtreHotels.addEventListener("click", () => {
    const hotels = works.filter(works => works.categoryId === 3)
    document.querySelector(".gallery").innerHTML = ""
    loadWorks(hotels)
    console.log(hotels)
    })
    filters.appendChild(filtreHotels)
