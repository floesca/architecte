function init() {
    createLoginForm()
    ajoutListenerLogin()
}

init()

//création formulaire de connexion JS

//pas nécessaire, page login HTML OK aussi
//une boucle éviterai la répétition

function createLoginForm() {
    const loginForm = document.querySelector(".login-form")

    const form = document.createElement("form")

    const labelEmail = document.createElement("label")
    labelEmail.textContent = "E-mail"
    const inputEmail = document.createElement("input")
    inputEmail.type = "email"
    inputEmail.name = "email"
    inputEmail.id = "email"
    inputEmail.required = true

    const labelPassword = document.createElement("label")
    labelPassword.textContent = "Mot de passe"
    const inputPassword = document.createElement("input")
    inputPassword.type = "password"
    inputPassword.name = "password"
    inputPassword.id = "pass"
    inputPassword.minLength = "6"
    inputPassword.required = true

    const errorSpan = document.createElement("span")
    errorSpan.className = "error"

    const btnSubmit = document.createElement("input")
    btnSubmit.type = "submit"
    btnSubmit.value = "Se connecter"

    const forgottenPassword = document.createElement("p")
    forgottenPassword.textContent = "Mot de passe oublié"

    form.appendChild(labelEmail)
    form.appendChild(inputEmail)
    form.appendChild(labelPassword)
    form.appendChild(inputPassword)
    form.appendChild(errorSpan)
    form.appendChild(btnSubmit)
    form.appendChild(forgottenPassword)

    loginForm.appendChild(form)
}


function ajoutListenerLogin() {
    const errorPassword = document.querySelector("span.error")

    const envoyerLogin = document.querySelector(".login-form")
    envoyerLogin.addEventListener("submit", async (event) => {
        console.log("Formulaire soumis")
    event.preventDefault()

    const login = {
        email: event.target.querySelector("[name=email]").value,
        password: event.target.querySelector("[name=password]").value
    }

    const chargeUtile = JSON.stringify(login)
    const response = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: chargeUtile
    })
    const data = await response.json()
    if (response.ok) {
        console.log("Connexion réussie ! Token :", data.token)
        localStorage.setItem("token", data.token)
        window.location.href = "index.html"
    } else {
        errorPassword.textContent = "Le mot de passe est incorrect."
        errorPassword.className = "error active"
    }   
})
}