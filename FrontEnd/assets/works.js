

//La fonction init() sert à organiser le démarrage de l'application
//dit dans quel ordre lancer les fonctions et attend les données avant d'agir
//les données doivent être chargées avant de lancer les boutons
async function init() {
    await fetchWorks()
    await fetchCategories()
    btnCategories()
}
init()


//création d'une fonction async pour récupérer les travaux de l'architecte depuis l'API
let works = []
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
    for (let i = 0; i < works.length; i++) {
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
let categories = []

async function fetchCategories() {
    const response = await fetch("http://localhost:5678/api/categories")
    categories = await response.json()
}

function btnCategories() {
const filters = document.querySelector(".filters")

// bouton "Tous"
const btnTous = document.createElement("button")
btnTous.textContent = "Tous"
btnTous.addEventListener("click", () => {
    loadWorks(works)
})
filters.appendChild(btnTous)

//création des bouton pour chaque catégorie
for (let i = 0; i < categories.length; i++) {
    const category = categories[i]
    const btnFiltre = document.createElement("button")
    btnFiltre.textContent = category.name

    btnFiltre.addEventListener("click", () => {
        const filteredWorks = works.filter(works => works.categoryId === category.id)
        loadWorks(filteredWorks)
    })
    filters.appendChild(btnFiltre)
}
}

