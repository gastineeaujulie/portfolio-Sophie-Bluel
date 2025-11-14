
// Affichage des travaux dans la galerie
async function showWorks() {
    try {
        const worksResponse = await fetch('http://localhost:5678/api/works');
        const categoriesResponse = await fetch('http://localhost:5678/api/categories');
        if (!worksResponse.ok || !categoriesResponse.ok) {
            throw new Error(`Erreur API`);
        }
        const works = await worksResponse.json();
        const categories = await categoriesResponse.json();
    
        const galerie = document.querySelector(".gallery");

        function displayWorks(worksToDisplay) {
            galerie.innerHTML = "";
            worksToDisplay.forEach((work) => {
                const figure = document.createElement("figure");
                const img = document.createElement("img");
                const caption = document.createElement("figcaption");
            
                img.src = work.imageUrl;
                img.alt = work.title;
                caption.textContent = work.title;

                figure.appendChild(img);
                figure.appendChild(caption);
                galerie.appendChild(figure);
            });
        }   
        displayWorks(works);

        const filtersContainer = document.createElement("div");
        filtersContainer.classList.add("filters");
        const divGallery = document.querySelector(".gallery");
        const portfolioSection = divGallery.parentNode;
        portfolioSection.insertBefore(filtersContainer, divGallery);

        const boutonTous = document.createElement("button");
        boutonTous.textContent = "Tous";
        boutonTous.classList.add("filtre-actif");
        filtersContainer.appendChild(boutonTous);

        boutonTous.addEventListener("click", () => {
            const allButtons = filtersContainer.querySelectorAll("button");
            allButtons.forEach(btn => btn.classList.remove("filtre-actif"));
            boutonTous.classList.add("filtre-actif");
            displayWorks(works);
        });

        categories.forEach((category) => {
            const button = document.createElement("button");
            button.textContent = category.name;
            button.dataset.id = category.id;
            filtersContainer.appendChild(button);

            button.addEventListener("click",() => {
                const allButtons = filtersContainer.querySelectorAll("button");
                allButtons.forEach(btn => btn.classList.remove("filtre-actif"));
                button.classList.add("filtre-actif");

                //Filtrer les travaux en fonction de la catégorie sélectionnée
                const worksFilters = works.filter(work => work.categoryId === category.id);
                displayWorks(worksFilters);
            });
        });
    
        const token = localStorage.getItem("token");
        if (token) {
            filtersContainer.style.display = "none";

            const portfolioSection = document.querySelector("#portfolio");
            const titre = portfolioSection.querySelector("h2");
            const portfolioHeader = document.createElement("div");
            portfolioHeader.classList.add("portfolio-header");
            portfolioSection.insertBefore(portfolioHeader, titre);
            portfolioHeader.appendChild(titre);
            const buttonModifier = document.createElement("button");
            buttonModifier.innerHTML = '<a href="#modal1" class="js-modal"><i class="fa-regular fa-pen-to-square"></i> modifier</a>';
            buttonModifier.classList.add("edit-btn");
            portfolioHeader.appendChild(buttonModifier);

            let modal = null
            const focusableSelector = "button, a, input, textarea";
            let focusables = []

            const openModal = function (e){
                e.preventDefault()
                modal= document.querySelector(e.target.getAttribute('href'))
                modal.style.display = null;
                modal.removeAttribute('aria-hidden');
                modal.setAttribute('aria-modal', 'true');
                modal.addEventListener('click', closeModal)
                modal.querySelector('.js-modal-close').addEventListener('click', closeModal);
                modal.querySelector('..js-modal-stop').addEventListener('click', stopPropagation);
            }

            const closeModal = function (e){
                if(modal === null) return
                e.preventDefault()
                modal.style.display = "none";
                modal.setAttribute('aria-hidden', 'true');
                modal.removeAttribute('aria-modal');
                modal.removeEventListener('click', closeModal);
                modal.querySelector('.js-modal-close').removeEventListener('click', closeModal);
                modal.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation);
                modal = null;
            }

            const stopPropagation = function (e) {
                e.stopPropagation()
            }

            const focusInModal = function (e) {
                e.preventDefault()
        
            }

            document.querySelectorAll('.js-modal').forEach(a => {
                a.addEventListener('click', openModal)
            })

            window.addEventListener('keydown', function (e) {
                if(e.key === "Escape" || e.key === "Esc") {
                    closeModal(e)
                }
                if(e.key === "Tab" && modal !== null) {
                    focusInModal(e)
                }
            })

        }else{
            filtersContainer.style.display = "flex";
            buttonModifier?.remove(); 
        }

    } catch (error) {
        console.error("Erreur lors du chargement des travaux :", error);
    }  
}      
// Appel de la fonction pour afficher les travaux au chargement de la page
showWorks();

// Vérification du token pour afficher les éléments d'édition
function checkToken() {
    const token = localStorage.getItem("token");

    if (token) {
        const editBar = document.createElement("div");
        editBar.classList.add("edit-bar");
        editBar.innerHTML = '<i class="fa-regular fa-pen-to-square"></i> Mode édition';
        const body = document.querySelector("body");
        body.insertBefore(editBar, body.firstChild);
        
        editBar.style.display = "flex";

        const header = document.querySelector("header");
        header.style.marginBottom = "-50px";
        header.style.paddingTop = "50px";

        const loginButton = document.getElementById("login-button");
        if (loginButton) {
            loginButton.textContent = "logout";
            loginButton.addEventListener("click", (event) => {
                event.preventDefault();
                localStorage.removeItem("token");
                window.location.href = "index.html";
            });
        }

    } else {
        editBar.style.display = "none";
    }
}

checkToken();


