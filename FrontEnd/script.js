// Affichage des travaux dans la galerie
async function showWorks() {
    try {
        const reponse = await fetch('http://localhost:5678/api/works');
        if (!reponse.ok) {
            throw new Error(`Erreur HTTP : ${reponse.status}`);
        }
        const works = await reponse.json();
    
        const galerie = document.querySelector(".gallery");

        works.forEach((work) => {
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
    } catch (error) {
        console.error("Erreur lors du chargement des travaux :", error);
    }
   
}      
// Appel de la fonction pour afficher les travaux au chargement de la page
showWorks();

// Filtrage des travaux par catégorie
async function categoriesFilters() {
    try {
        const categoriesResponse =await fetch ('http://localhost:5678/api/categories');
        if (!categoriesResponse.ok) {
            throw new Error(`Erreur HTTP : ${categoriesResponse.status}`);
        }
        const categories = await categoriesResponse.json();

        const filtersContainer = document.createElement("div");
        filtersContainer.classList.add("filters");
        const portfolioSection = document.querySelector("#portfolio");
        portfolioSection.insertBefore(filtersContainer, portfolioSection.firstChild);

        const boutonTous = document.createElement("button");
        boutonTous.textContent = "Tous";
        boutonTous.classList.add("filtre-actif");
        filtersContainer.appendChild(boutonTous);   

        categories.forEach((category) => {
            const button = document.createElement("button");
            button.textContent = category.name;
            button.dataset.id = category.id;
            filtersContainer.appendChild(button);
        });
    } catch (error) {
        console.error("Erreur lors du chargement des catégories :", error.message);
    }       
}
// Appel de la fonction pour afficher les filtres de catégories au chargement de la page
categoriesFilters();

// Gestion des filtres de catégories
// function filterWorksByCategory(categoryId) {
//     const  = document.querySelectorAll(".");
// document.addEventListener("click", async (event) => {
    
//     }
// });
