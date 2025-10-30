async function showWorks() {
    try {
        const reponse = await fetch('http://localhost:5678/api/works');
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

showWorks();
