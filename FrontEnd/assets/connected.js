const token = localStorage.getItem("token")
const btnLogin = document.getElementById("btnLogin")

const isValid = token && isTokenValid

function isTokenValid(token) {
  try {
    const payload = jwtDecode(token)
    const now = Date.now() / 1000 // en secondes

    return payload.exp > now
  } catch {
    return false
  }
}
// jwt-decode est une librairie JS qui permet de lire le contenu JWT facilement
// extrait le payload (la deuxième partie du token)
// ne vérifie pas la signature et l'authenticité, lit juste la date d'expiration

if (isValid) {
  console.log("connecté (token valide)")
  document.querySelector(".filters").style.display = "none"
  
  btnLogin.textContent = "logout"

  btnLogin.addEventListener("click", () => {
    localStorage.removeItem("token")
    window.location.reload()

  })
} else {
    console.log("non connecté")
    document.querySelector(".bandeau-edit-mode").style.display = "none"
    document.querySelector(".edit-mode").style.display = "none"
}

// Modale
let modal = null

const openModal = function (e) {
  e.preventDefault()
  const target = document.querySelector(e.target.getAttribute("href"))
  target.style.display = null //le style display: none passe au display: flex et devient visible
  target.removeAttribute("aria-hidden")
  target.setAttribute("aria-modal", "true")
  modal = target
  modal.addEventListener("click", closeModal)
  modal.querySelector(".js-close-modal").addEventListener("click", closeModal)
  modal.querySelector(".js-stop-modal").addEventListener("click", stopPropagation)
}

const closeModal = function (e) {
  if (modal === null) return
  e.preventDefault()
  modal.style.display = "none"
  modal.setAttribute("aria-hidden", "true")
  modal.removeAttribute("aria-modal")
  modal.removeEventListener("click", closeModal)
  modal.querySelector(".js-close-modal").removeEventListener("click", closeModal)
  modal.querySelector(".js-stop-modal").removeEventListener("click", stopPropagation)
  modal = null
}

// évite que la modale se ferme en appuyant n'importe où
const stopPropagation = function (e) {
  e.stopPropagation()
}

// quand on clique sur chaque lien avec la classe js-modal, la fonction openModal se lance
document.querySelectorAll(".js-modal").forEach(a => {
  a.addEventListener("click", openModal)
})

// récupération de la gallerie depuis l'API
let works = []
async function fetchWorks() {
    //récupère et traite la réponse de l'API
    const response = await fetch("http://localhost:5678/api/works")
    works = await response.json()
    loadWorks(works)
}

// affichage des travaux dans la modale
function loadWorks(works) {
    const modalGallery = document.querySelector(".modal-gallery")
    modalGallery.innerHTML = "" 
    for (let i = 0; i < works.length; i++) {
        const figure = document.createElement("div")

        const worksElement = document.createElement("img")
        worksElement.src = works[i].imageUrl

        figure.appendChild(worksElement)

        modalGallery.appendChild(figure)
    }
}
fetchWorks()