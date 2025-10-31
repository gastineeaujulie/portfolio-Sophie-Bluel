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
    const portfolioSection = document.querySelector("#portfolio");
    portfolioSection.insertBefore(filtersContainer, portfolioSection.firstChild);

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
showWorks();
