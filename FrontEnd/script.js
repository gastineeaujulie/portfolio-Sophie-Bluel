const isAuthenticated = localStorage.getItem("token");
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
    } catch (error) {
        console.error("Erreur lors du chargement des travaux :", error);
    }  
}
// Appel de la fonction pour afficher les travaux au chargement de la page
await showWorks();

function showEditMode() {
    if (!isAuthenticated) {
        return;
    }
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
}
showEditMode();
    
function activateEditBtn() {
    const filtersContainer = document.querySelector(".filters");
    if (isAuthenticated) {
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

    } else {
        filtersContainer.style.display = "flex";
        buttonModifier?.remove(); 
    }
}
activateEditBtn();

function createWorkItemInModal(work) {
    if(!isAuthenticated){
        return;
    }

    const imgContainer = document.createElement("div");
    const image = document.createElement("img");
    const btn = document.createElement("button");

    imgContainer.classList.add("img-container");
    image.src = work.imageUrl;
    image.alt = work.title;

    btn.classList.add("delete-button");
    btn.innerHTML = '<i class="fa-solid fa-trash-can"></i>';

    const galleryModal = document.querySelector('.gallery-modal');
    galleryModal.appendChild(imgContainer);
    imgContainer.appendChild(image);
    imgContainer.appendChild(btn);

    btn.addEventListener('click', (event) => {
        // Code to delete all works goes here
        event.preventDefault();
        fetch(`http://localhost:5678/api/works/${work.id}`, {
            method: 'DELETE', 
            headers: {
                'Authorization': `Bearer ${isAuthenticated}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur lors de la suppression des travaux');
            } else {
                console.log('Suppression réussie');
                // TODO: create function to delete work by id in html
                imgContainer.remove();
            }
        });
    });
}

async function createWorksToDelete() {
    if(!isAuthenticated){
        return;
    }
    const worksResponse = await fetch('http://localhost:5678/api/works');
    if (!worksResponse.ok) {
        throw new Error(`Erreur API`);
    }
    const works = await worksResponse.json();

    works.forEach((work) => {
        createWorkItemInModal(work)
    });
}

function setupModal() {
    if (!isAuthenticated) {
        return;
    }

    let modal1 = null;
    const focusableSelector = "button, a, input, textarea";
    let focusables = [];

    
    const openModal = function (event){
        event.preventDefault()
        modal1= document.querySelector(event.target.getAttribute('href'));
        modal1.style.display = null;
        modal1.removeAttribute('aria-hidden');
        modal1.setAttribute('aria-modal', 'true');
        focusables = Array.from(modal1.querySelectorAll(focusableSelector));
        focusables[0].focus();                                                                                                                                                                                                                                                                                                          
        modal1.addEventListener('click', closeModal);
        modal1.querySelector('.js-modal-close').addEventListener('click', closeModal);
        modal1.querySelector('.js-modal-stop').addEventListener('click', stopPropagation);
        document.body.classList.add('no-scroll');
    }

    const closeModal = function (event){
        if(modal1 === null) return
        event.preventDefault()
        modal1.style.display = "none";
        modal1.setAttribute('aria-hidden', 'true');
        modal1.removeAttribute('aria-modal');
        modal1.removeEventListener('click', closeModal);
        modal1.querySelector('.js-modal-close').removeEventListener('click', closeModal);
        modal1.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation);
        document.body.classList.remove('no-scroll');
        modal1 = null;
    }

    const stopPropagation = function (event) {
        event.stopPropagation()
    }

    const focusInModal = function (event) {
        event.preventDefault()
        let index = focusables.findIndex(f => f === document.activeElement);
        if(event.shiftKey === true){
            index --;
        } else {
            index ++;
        }
        if( index >= focusables.length) {
            index = 0
        }
        if (index < 0) {
            index = focusables.length -1
        }
    focusables[index].focus()
    }

    document.querySelectorAll('.js-modal').forEach(a => {
        createWorksToDelete();
        a.addEventListener('click', openModal)
    })

    window.addEventListener('keydown', function (event) {
        if(event.key === "Escape" || event.key === "Esc") {
            closeModal(event)
        }
        if(event.key === "Tab" && modal1 !== null) {
            focusInModal(event)
        }
    })    
}
setupModal();



function modal2Setup() {
    if (!isAuthenticated) {
        return;
    }
        let modal2 = null;
        const focusableSelector = "button, a, input, textarea";
        let focusables = [];
        

        const openModal2 = function (event){
            event.preventDefault()
            const modal = document.querySelector('.modal1')
            modal.style.display = "none";
            modal.setAttribute('aria-hidden', 'true');
            modal.removeAttribute('aria-modal');
            modal2= document.querySelector(event.target.getAttribute('href'));
            modal2.style.display = null;
            modal2.removeAttribute('aria-hidden');
            modal2.setAttribute('aria-modal', 'true');
            focusables = Array.from(modal2.querySelectorAll(focusableSelector));
            focusables[0].focus();                                                                                                                                                                                                                                                                                                          
            modal2.addEventListener('click', closeModal2);
            modal2.querySelector('.js-modal2-close').addEventListener('click', closeModal2);
            modal2.querySelector('.js-modal2-stop').addEventListener('click', stopPropagation);
            document.body.classList.add('no-scroll');
            
        }

        const closeModal2 = function (event){
            if(modal2 === null) return
            event.preventDefault()
            modal2.style.display = "none";
            modal2.setAttribute('aria-hidden', 'true');
            modal2.removeAttribute('aria-modal');
            modal2.removeEventListener('click', closeModal2);
            modal2.querySelector('.js-modal2-close').removeEventListener('click', closeModal2);
            modal2.querySelector('.js-modal2-stop').removeEventListener('click', stopPropagation);
            document.body.classList.remove('no-scroll');
            modal2 = null;
        }

        const stopPropagation = function (event) {
            event.stopPropagation()
        }

        const backToModal1 = function (event) {
            event.preventDefault()
            modal2.style.display = "none";
            modal2.setAttribute('aria-hidden', 'true');
            modal2.removeAttribute('aria-modal');
            const modal = document.querySelector('.modal1')
            modal.style.display = null;
            modal.removeAttribute('aria-hidden');
            modal.setAttribute('aria-modal', 'true');
        }

        document.querySelectorAll('.js-modal-back').forEach(a => {
            a.addEventListener('click', backToModal1)
        })

        const focusInModal2 = function (event) {
            event.preventDefault()
            let index = focusables.findIndex(f => f === document.activeElement);
            if(event.shiftKey === true){
                index --;
            } else {
                index ++;
            }
            if( index >= focusables.length) {
                index = 0
            }
            if (index < 0) {
                index = focusables.length -1
            }
        focusables[index].focus()
        }
        document.querySelectorAll('.js-modal2').forEach(a => {
            a.addEventListener('click', openModal2)
        })

        window.addEventListener('keydown', function (event) {
            if(event.key === "Escape" || event.key === "Esc") {
                closeModal2(event)
            }
            if(event.key === "Tab" && modal2 !== null) {
                focusInModal2(event)
            }
        })
}
modal2Setup();

function chargeNewWork() {
    const ajoutPhotoContainer = document.querySelector('.ajout-photo-container');
    const photoUpload = document.getElementById('photo-upload')

    console.log("Container trouvé :", ajoutPhotoContainer);
    console.log("Input file trouvé :", photoUpload);

    document.querySelector('.upload-instructions').addEventListener('click', (event) => {
            event.preventDefault()
            photoUpload.click();
        }); 
        
    photoUpload.addEventListener('change', () => {
        const file = photoUpload.files[0];
        if(!file) return;

        const reader = new FileReader();

        reader.onload = (event) => {
            let afficherImg = ajoutPhotoContainer.querySelector('img.preview');

            if(!afficherImg) {
                afficherImg = document.createElement('img');
                afficherImg.classList.add('preview');
                ajoutPhotoContainer.appendChild(afficherImg); 
            }    
            afficherImg.src = event.target.result;
            ajoutPhotoContainer.classList.add('has-image');
        }
        reader.readAsDataURL(file);
    });      
}
chargeNewWork();

async function categoriesNewWork(category){
    if(!isAuthenticated){
        return;
    }

    const optionCategorie = document.createElement("option");
    optionCategorie.value = category.name;
    optionCategorie.textContent = category.name;
    
    const selectCategory = document.getElementById('category');
    selectCategory.appendChild(optionCategorie);
    
    selectCategory.addEventListener('click', async(event) => {
        // Code to delete all works goes here
        event.preventDefault();
        if (event.tagert.value !== category.name) {
            return;
        }
        try{
            const response = await fetch(`http://localhost:5678/api/categories/${category.id}`);
                if (!response.ok) {
                    throw new Error('Erreur chargement categories');
            }
        const addedCategory = await response.json();
        optionCategorie.textContent = addedCategory.name;
        } catch (error) {
            console.error("Erreur lors du chargement des catégories :", error);
        }
    });

}


