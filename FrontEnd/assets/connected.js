const token = localStorage.getItem("token")
const btnLogin = document.getElementById("btnLogin")

const isValid = token && isTokenValid(token)
// devrait être isTokenValid(token) mais ne marche pas, je ne peux plus me connecter donc problème avec cette fonction

function isTokenValid(token) {
  console.log(token)
  if (!token) return false

  try {
    const payload = parseJwt(token)
    console.log(payload)
    const now = Date.now() / 1000 // en secondes

    return payload.exp > now
  } catch {
    return false
  }
}
// Source - https://stackoverflow.com/a/38552302
// Posted by Peheje, modified by community. See post 'Timeline' for change history
// Retrieved 2026-04-13, License - CC BY-SA 4.0

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    console.log(base64)
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
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
    document.querySelector(".filters").style.display = "flex"
}

// Modale
let modal = null
let currentStep = 1

// ouvrir la modale
function openModal(e) {
 
  modal = document.querySelector("#modal")

  modal.style.display = "flex"
  modal.removeAttribute("aria-hidden")
  modal.setAttribute("aria-modal", "true")

  showStep(1)

  modal.addEventListener("click", function (e) {
  if (e.target === modal) {
    closeModal(e)
  }
})
}

// fermer la modale
function closeModal(e) {
  
  if (!modal) return

  modal.style.display = "none"
  modal.setAttribute("aria-hidden", "true")
  modal.removeAttribute("aria-modal")

  modal.removeEventListener("click", closeModal)

  modal = null
}

// afficher une étape
function showStep(step) {
  currentStep = step

  document.querySelectorAll(".modal-wrapper").forEach(el => {
    el.style.display = el.dataset.step == step ? "block" : "none"
  })
}

// navigation
document.addEventListener("click", function (e) {

  if (e.target.closest("#btn-add-photo")) {
    showStep(2)
  }

  if (e.target.closest(".js-back")) {
    showStep(1)
  }

  if (e.target.closest(".js-close-modal")) {
    closeModal(e)
  }
})

// quand on clique sur chaque lien avec la classe js-modal, la fonction openModal se lance (bouton modifier)
document.querySelectorAll(".js-modal").forEach(a => {
  a.addEventListener("click", (e) => {
  openModal(e);
  })
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
        figure.classList.add("image-container-modal")
        figure.dataset.id = works[i].id

        const worksElement = document.createElement("img")
        worksElement.src = works[i].imageUrl

        const deleteIcon = document.createElement("i")
        deleteIcon.className = "fa-solid fa-trash-can delete-icon"

        figure.appendChild(worksElement)
        figure.appendChild(deleteIcon)

        modalGallery.appendChild(figure)
    }
}
fetchWorks()

// fermeture de la modale avec la touche escape
window.addEventListener("keydown", (e) => {
  
  if (e.key !== "Escape") return
  if (!modal) return

  closeModal()
})

// supression des travaux existants
// API fetch DELETE