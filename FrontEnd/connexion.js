function ajoutListenerConnexion() {
    console.log("Ajout du listener au formulaire de connexion");
    const formulaireLogIn = document.querySelector("#login-form");
    formulaireLogIn.addEventListener("submit", async function (event) {
        event.preventDefault();

        const payload = {
            email: event.target.querySelector("#email").value,
            password: event.target.querySelector("#password").value,
        };

        const userDataResponse = await fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(payload)
        });
        const userData = await userDataResponse.json();
        console.log(userData);
 
        // Si la connexion est un succes,
        if(userDataResponse.ok){
            // Alors: stocker le token dans le localStorage et rediriger vers la page principale
            localStorage.setItem("token", userData.token);
            window.location.href = "index.html";
        }else{
            // Sinon afficher un message d'erreur
            const messageErreur = document.createElement("span");
            messageErreur.textContent = "Erreur dans l'email ou le mot de passe";
            messageErreur.style.color = "red";
            formulaireLogIn.appendChild(messageErreur);
            
            console.log("Erreur dans la connexion");
        }
        
        
    });
}

ajoutListenerConnexion();

