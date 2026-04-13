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


// champ ajouter photo, listener bouton
const fileElement = document.getElementById("file-element")
const btnAddFile = document.getElementById("btn-add-file")

btnAddFile.addEventListener("click", (e) => {
  console.log("test")
})

