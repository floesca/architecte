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