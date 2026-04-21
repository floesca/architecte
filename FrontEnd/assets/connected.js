// initialisation (chargement de la page)
const API = "http://localhost:5678/api"

createModal()

function getToken() {
  return localStorage.getItem("token")
}

async function apiFetch(path, options = {}) {
  const token = getToken()

  const response = await fetch(API + path, {
    ...options,
    headers: {
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  })

  if (!response.ok) {
    throw new Error(`Erreur API : ${response.status} ${response.statusText}`)
  }

  return response.status === 204 ? null : response.json()
}

// Vérifie que la date d'expiration du token est valide
const token = getToken()
function isTokenValid(token) {
  if (!token) return false

  try {
    const payload = parseJwt(token)
    const now = Date.now() / 1000 // en secondes

    return payload.exp > now
  } catch {
    return false
  }
}

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}
const isValid = token && isTokenValid(token)

// UI (filtres, bouton d'édition, mode admin)
const btnLogin = document.getElementById("btnLogin")
if (isValid) {
  document.querySelector(".filters").style.display = "none"
  
  btnLogin.textContent = "logout"

  btnLogin.addEventListener("click", () => {
    localStorage.removeItem("token")
    window.location.reload()

  })
} else {
    document.querySelector(".bandeau-edit-mode").style.display = "none"
    document.querySelector(".edit-mode").style.display = "none"
    document.querySelector(".filters").style.display = "flex"
}

// Récupération des données API
let works = []
async function fetchWorks() {
    works = await apiFetch("/works")
    loadModalWorks(works)
}

let categories = []
async function fetchCategories() {
  categories = await apiFetch("/categories")
    loadCategories(categories)
}

// Affichage des projets et des catégories dans la modale
function loadModalWorks(works) {
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

// Gestion de la modale
// création de la modale
function createModal() {
const modalAside = document.createElement("aside")
modalAside.id = "modal"
modalAside.className = "modal"
modalAside.setAttribute = ("aria-hidden", "true")
modalAside.setAttribute = ("role", "dialog")
modalAside.style.display = "none"

const step1 = document.createElement("div")
step1.className = "modal-wrapper"
step1.dataset.step = "1"

const closeIcon1 = document.createElement("i")
closeIcon1.className = "fa-solid fa-xmark js-close-modal"

const title1 = document.createElement("p")
title1.textContent = "Galerie photo"

const modalGallery = document.createElement("div")
modalGallery.className = "modal-gallery"

const hr1 = document.createElement("hr")

const divMessage = document.createElement("div")
divMessage.id = "message"

const btnAddPhoto = document.createElement("button")
btnAddPhoto.textContent = "Ajouter une photo"
btnAddPhoto.id = "btn-add-photo"

const confirmBox = document.createElement("div")
confirmBox.id = "confirm-delete"
confirmBox.className = "hidden"

const confirmText = document.createElement("p")
confirmText.textContent = "Supprimer cet élément ?"

const btnYes = document.createElement("button")
btnYes.textContent = "Oui"
btnYes.id = "confirm-yes"

const btnNo = document.createElement("button")
btnNo.textContent = "Non"
btnNo.id = "confirm-no"

confirmBox.append(confirmText, btnYes, btnNo)

step1.append(
  closeIcon1,
  title1,
  modalGallery,
  hr1,
  divMessage,
  btnAddPhoto,
  confirmBox)

const step2 =document.createElement("div")
step2.className = "modal-wrapper"
step2.dataset.step = "2"
step2.style.display = "none"

const icons = document.createElement("div")
icons.className = "modal-icons"

const backIcon = document.createElement("i")
backIcon.className = "fa-solid fa-arrow-left js-back"

const closeIcon2 = document.createElement("i")
closeIcon2.className = "fa-solid fa-xmark js-close-modal"

icons.append(backIcon, closeIcon2)

const title2 = document.createElement("p")
title2.textContent = "Ajout photo"

const form = document.createElement("div")
form.className = "add-photo-form"

const fileBlock = document.createElement("div")
fileBlock.className = "add-file"

const divPlaceholder = document.createElement("div")
divPlaceholder.id = "upload-placeholder"

const icon = document.createElement("i")
icon.className = "fa-regular fa-image"

const btnAddFileDiv = document.createElement("button")
btnAddFileDiv.id = "btn-add-file"
btnAddFileDiv.textContent = "+ Ajouter photo"

const info = document.createElement("p")
info.textContent = "jpg, png : 4mo max"

divPlaceholder.append(
  icon,
  btnAddFileDiv,
  info)

const preview = document.createElement("img")
preview.id = "preview-image"
preview.src = ""
preview.style.display = "none"

const fileInput = document.createElement("input")
fileInput.id = "file-element"
fileInput.type = "file"
fileInput.accept = "image/*"
fileInput.style.display = "none"

fileBlock.append(
  divPlaceholder,
  preview,
  fileInput)

const labelTitle = document.createElement("label")
labelTitle.textContent = "Titre"

const inputTitle = document.createElement("input")
inputTitle.id = "title"

const labelCat = document.createElement("label")
labelCat.textContent = "Catégories"

const select = document.createElement("select")
select.id = "category"

form.append(
  fileBlock,
  labelTitle,
  inputTitle,
  labelCat,
  select
)

const hr2 = document.createElement("hr")

const btnValidate = document.createElement("button")
btnValidate.textContent = "Valider"
btnValidate.id = "btn-validate"

step2.append(
  icons,
  title2,
  form,
  hr2,
  btnValidate)

modalAside.append(step1, step2)  

document.body.appendChild(modalAside)
return modalAside
}

let modal = null
let currentStep = 1

// quand on clique sur chaque lien avec la classe js-modal, la fonction openModal se lance (bouton modifier)
document.querySelectorAll(".js-modal").forEach(a => {
  a.addEventListener("click", (e) => {
  openModal(e);
  })
})

document.querySelector("#modal").addEventListener("click", function (e) {
  if (e.target === e.currentTarget) {
    closeModal(e)
  }
})

function openModal(e) {
  modal = document.querySelector("#modal")

  modal.style.display = "flex"
  modal.removeAttribute("aria-hidden")
  modal.setAttribute("aria-modal", "true")

  showStep(1)
}

function closeModal(e) {
  if (!modal) return

  modal.style.display = "none"
  modal.setAttribute("aria-hidden", "true")
  modal.removeAttribute("aria-modal")

  modal = null
}

function showStep(step) {
  currentStep = step

  document.querySelectorAll(".modal-wrapper").forEach(el => {
    el.style.display = el.dataset.step == step ? "block" : "none"
  })
}

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

// Fermeture de la modale avec la touche escape
window.addEventListener("keydown", (e) => {
  
  if (e.key !== "Escape") return
  if (!modal) return

  closeModal()
})

// Suppression d'un projet
let workToDelete = null

document.addEventListener("click", async (e) => {

  const deleteBtn = e.target.closest(".delete-icon")
  
  if (!deleteBtn) return
  
  const figure = deleteBtn.closest(".image-container-modal")

  if (!figure) return

  workToDelete = figure

  document.getElementById("confirm-delete").classList.remove("hidden")
})

// Confirmation de suppression
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
    showMessage("Erreur")
  }

  workToDelete = null
  document.getElementById("confirm-delete").classList.add("hidden")
})

document.getElementById("confirm-no").addEventListener("click", () => {
  workToDelete = null
  document.getElementById("confirm-delete").classList.add("hidden")
})

async function deleteWork(id) {
    await apiFetch(`/works/${id}`, {
    method: "DELETE",
    })
}

// Ajout d'un projet
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

const titleInput = document.getElementById("title")
const categorySelect = document.getElementById("category")
const btnValidate = document.getElementById("btn-validate")

btnValidate.addEventListener("click", async (e) => {
  e.preventDefault()

  const file = fileInput.files[0]
  const title = titleInput.value
  const category = categorySelect.value

  if (!file || !title || !category) {
    console.log("validation bloquée")
    showMessage("Tous les champs sont obligatoires")
    return
  }

// formData capture le formulaire HTML et le soumet avec fetch
  const formData = new FormData()
  formData.append("image", file)
  formData.append("title", title)
  formData.append("category", category)

  try {
    const newWork = await apiFetch("/works", {
      method: "POST",
      body: formData
    })

    addWorkToGallery(newWork)

    addWorkToModal(newWork)

    showMessage("Projet ajouté")

    // Réinitialisation du formulaire d'ajout après l'ajout du nouveau projet
    titleInput.value = ""
    fileInput.value = ""

    const preview = document.getElementById("preview-image")
    const placeholder = document.getElementById("upload-placeholder")
    URL.revokeObjectURL(preview.src)
    preview.src = ""
    preview.style.display = "none"
    placeholder.style.display = "flex"

    showStep(1)

  } catch (error) {
    showMessage("Erreur lors de l'ajout")
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

// Feedback utilisateur grâce à un message
function showMessage(text) {
  const message = document.getElementById("message")

  message.textContent = text
  // disparition du message automatiquement
  setTimeout(() => {
    message.textContent = ""
  }, 3000)
}