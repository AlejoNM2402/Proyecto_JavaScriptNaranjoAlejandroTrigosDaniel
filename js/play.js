// Obtener y mostrar las clases
function cargarClases() {
    fetch("https://www.dnd5eapi.co/api/classes")
    .then(res => res.json())
    .then(data => {
        const select = document.getElementById("clase");
        data.results.forEach(clase => {
        const option = document.createElement("option");
        option.value = clase.index;
        option.textContent = clase.name;
        select.appendChild(option);
        });
    });
}

  // Obtener y mostrar las razas
function cargarRazas() {
    fetch("https://www.dnd5eapi.co/api/races")
    .then(res => res.json())
    .then(data => {
        const select = document.getElementById("raza");
        data.results.forEach(raza => {
        const option = document.createElement("option");
        option.value = raza.index;
        option.textContent = raza.name;
        select.appendChild(option);
        });
    });
}

  // Obtener y mostrar los backgrounds
function cargarBackgrounds() {
    fetch("https://www.dnd5eapi.co/api/backgrounds")
    .then(res => res.json())
    .then(data => {
        const select = document.getElementById("background");
        data.results.forEach(bg => {
        const option = document.createElement("option");
        option.value = bg.index;
        option.textContent = bg.name;
        select.appendChild(option);
        });
    });
}

  // Llamar a todas las funciones al cargar
cargarClases();
cargarRazas();
cargarBackgrounds();
