export function ajoutListenerConnexion() {
    console.log("Ajout du listener au formulaire de connexion");
    const formulaireLogIn = document.querySelector("#login-form");
    formulaireLogIn.addEventListener("submit", function (event) {
        event.preventDefault();

        const payload = {
            email: event.target.querySelector("#email").value,
            password: event.target.querySelector("#password").value,
        };

        fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(payload)
        });
    });
}

