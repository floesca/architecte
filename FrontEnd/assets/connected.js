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
let workToDelete = null

document.addEventListener("click", async (e) => {

  const deleteBtn = e.target.closest(".delete-icon")
  
  if (!deleteBtn) return

  // if (!confirm("Supprimer cet élément ?")) return message du navigateur mais on pourrait mettre un message dans le code
  
  const figure = deleteBtn.closest(".image-container-modal")

  if (!figure) return

  workToDelete = figure

  document.getElementById("confirm-delete").classList.remove("hidden")

  // figure.remove()  supprime seulement dans la modale mais pas la gallerie principale
})

document.getElementById("confirm-yes").addEventListener("click", async () => {

  if (!workToDelete) return

  const id = workToDelete.dataset.id

  try {
    await deleteWork(id)

     // suppression modale
    workToDelete.remove()

    // suppression galerie principale
    document.querySelectorAll(`.gallery [data-id="${id}"]`).forEach(el => {
      el.remove()
    })
    showMessage("Supprimé")

  } catch {
    showMessage("Erreur", true)
  }

  workToDelete = null
  document.getElementById("confirm-delete").classList.add("hidden")
})

document.getElementById("confirm-no").addEventListener("click", () => {
  workToDelete = null
  document.getElementById("confirm-delete").classList.add("hidden")
})

async function deleteWork(id) {
  try {
    const token = localStorage.getItem("token")

    const response = await fetch(`http://localhost:5678/api/works/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`
    }
    })
    if (!response.ok) {
      throw new Error("Erreur suppression")
    }
  } catch (error) {
    console.error(error)
  }
}

function showMessage(text) {
  const message = document.getElementById("message")

  message.textContent = text

  // disparition du message automatiquement
  setTimeout(() => {
    message.textContent = ""
  }, 3000)
}

// ajout travaux
const fileInput = document.getElementById("file-element")
const btnAddFile = document.getElementById("btn-add-file")

btnAddFile.addEventListener("click", (e) => {
  e.preventDefault()
  fileInput.click()
})

fileInput.addEventListener("change", () => {
  const file = fileInput.files[0]
  if (!file) return

  const preview = document.getElementById("preview-image")
  const placeholder = document.getElementById("upload-placeholder")

  preview.src = URL.createObjectURL(file)
  preview.style.display = "block"
  placeholder.style.display = "none"
})

// catégories pour la liste déroulante
let categories = []

async function fetchCategories() {
  const response = await fetch("http://localhost:5678/api/categories")
  categories = await response.json()

    loadCategories(categories)
}
function loadCategories(categories) {
  const select = document.getElementById("category")
  select.innerHTML = "" 

  categories.forEach(cat => {
    const option = document.createElement("option")
    option.value = cat.id
    option.textContent = cat.name

    select.appendChild(option)
  })
}
fetchCategories()

const titleInput = document.getElementById("title")
const categorySelect = document.getElementById("category")
const btnValidate = document.getElementById("btn-validate")

btnValidate.addEventListener("click", async (e) => {
  e.preventDefault()

  const file = fileInput.files[0]
  const title = titleInput.value
  const category = categorySelect.value

  if (!file || !title || !category) {
    console.log("bloqué validation")
    showMessage("Tous les champs sont obligatoires", true)
    return
  }

// formData capture le formulaire HTML et le soumet avec fetch
  const formData = new FormData()
  formData.append("image", file)
  formData.append("title", title)
  formData.append("category", category)

  try {
    const token = localStorage.getItem("token")

    const response = await fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`
      },
      body: formData
    })

    if (!response.ok) {
      throw new Error("Erreur upload")
    }

    const newWork = await response.json()

    // ajout dans la galerie principale
    addWorkToGallery(newWork)

    // ajout dans la modale
    addWorkToModal(newWork)

    showMessage("Projet ajouté")

    // revenir étape 1
    showStep(1)

  } catch (error) {
    showMessage("Erreur lors de l'ajout", true)
    console.error(error)
  }
})

function addWorkToGallery(work) {
  const gallery = document.querySelector(".gallery")

  const figure = document.createElement("figure")
  figure.dataset.id = work.id

  const img = document.createElement("img")
  img.src = work.imageUrl

  const caption = document.createElement("figcaption")
  caption.textContent = work.title

  figure.appendChild(img)
  figure.appendChild(caption)

  gallery.appendChild(figure)
}

function addWorkToModal(work) {
  const modalGallery = document.querySelector(".modal-gallery")

  const div = document.createElement("div")
  div.classList.add("image-container-modal")
  div.dataset.id = work.id

  const img = document.createElement("img")
  img.src = work.imageUrl

  const deleteIcon = document.createElement("i")
  deleteIcon.className = "fa-solid fa-trash-can delete-icon"

  div.appendChild(img)
  div.appendChild(deleteIcon)

  modalGallery.appendChild(div)
}
