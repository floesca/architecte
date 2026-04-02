function ajoutListenerLogin() {
    const envoyerLogin = document.getElementById("login")
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
        alert("Erreur de connexion")
    }   
})
}

ajoutListenerLogin()
