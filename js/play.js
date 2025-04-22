// La funcion que carga los datos generales de la api
function cargarSelect(endpoint, selectId) {
  fetch(`https://www.dnd5eapi.co/api/${endpoint}`)
      .then(res => res.json())
      .then(data => {
          const select = document.getElementById(selectId);
          data.results.forEach(item => {
              const option = document.createElement("option");
              option.value = item.index;
              option.textContent = item.name;
              select.appendChild(option);
          });
      })
      .catch(err => console.error(`Error al cargar ${selectId}:`, err));
}

// Funcion que carga todos los datos 
function cargarDatosPersonaje() {
  // Mostrar el contenedor de características
  document.getElementById("caracteristicasPersonaje").style.display = "block";
  
  // funcion que caga los datos para seleccionar
  cargarSelect("classes", "clase");
  cargarSelect("races", "raza");
  cargarSelect("backgrounds", "background");
  cargarSelect("alignments", "alineamiento");
  cargarSelect("ability-scores", "habilidades");
  cargarSelect("proficiencies", "proficiencias");
  cargarSelect("languages", "lenguajes");
  cargarSelect("features", "features");
  cargarSelect("subclasses", "subclases");
  cargarSelect("subraces", "subrazas");
}

// Event listener (evento de escucha) para el boton de creacion de personaje
document.addEventListener("DOMContentLoaded", function() {
  const btnCrearPersonaje = document.getElementById("btnCrearPersonaje");
  btnCrearPersonaje.addEventListener("click", cargarDatosPersonaje);
});
