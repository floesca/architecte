const token = localStorage.getItem("token")
const btnLogin = document.getElementById("btnLogin")

if (token) {
  console.log("connecté")
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