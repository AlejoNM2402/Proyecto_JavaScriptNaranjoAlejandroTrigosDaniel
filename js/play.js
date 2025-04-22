function cargarSelect(endpoint, selectId) {
  fetch(`https://www.dnd5eapi.co/api/${endpoint}`)
      .then(res => res.json())
      .then(data => {
          const select = document.getElementById(selectId);
          // Limpiar opciones previas
          select.innerHTML = '<option value="">Seleccionar...</option>';
          
          data.results.forEach(item => {
              const option = document.createElement("option");
              option.value = item.index;
              option.textContent = item.name;
              select.appendChild(option);
          });
      })
      .catch(err => console.error(`Error al cargar ${selectId}:`, err));
}

// Cargar equipo específico
function cargarEquipo() {
  // Cargar armas
  fetch('https://www.dnd5eapi.co/api/equipment-categories/weapon')
      .then(res => res.json())
      .then(data => {
          const select = document.getElementById('armaSelect');
          select.innerHTML = '<option value="">Seleccionar...</option>';
          
          data.equipment.forEach(item => {
              const option = document.createElement("option");
              option.value = item.index;
              option.textContent = item.name;
              select.appendChild(option);
          });
      })
      .catch(err => console.error('Error al cargar armas:', err));
  
  // Cargar armaduras
  fetch('https://www.dnd5eapi.co/api/equipment-categories/armor')
      .then(res => res.json())
      .then(data => {
          const select = document.getElementById('armaduraSelect');
          select.innerHTML = '<option value="">Seleccionar...</option>';
          
          data.equipment.forEach(item => {
              const option = document.createElement("option");
              option.value = item.index;
              option.textContent = item.name;
              select.appendChild(option);
          });
      })
      .catch(err => console.error('Error al cargar armaduras:', err));
}

// Función que carga todos los datos 
function cargarDatosPersonaje() {
  // Mostrar el contenedor de características
  document.getElementById("caracteristicasPersonaje").style.display = "block";
  
  // Cargar datos para seleccionar
  cargarSelect("classes", "clase");
  cargarSelect("races", "raza");
  cargarSelect("backgrounds", "background");
  cargarSelect("alignments", "alineamiento");
  cargarSelect("features", "features");
  cargarSelect("subclasses", "subclases");
  cargarSelect("subraces", "subrazas");
  cargarSelect("proficiencies", "proficiencias");
  cargarSelect("languages", "lenguajes");
  
  // Cargar equipo
  cargarEquipo();
}

// Función para agregar un ítem con etiqueta y botón de eliminar
function agregarItem(valor, texto, contenedorId) {
  if (!valor) return;
  
  const contenedor = document.getElementById(contenedorId);
  
  // Verificar si ya existe
  const items = contenedor.querySelectorAll('.item-tag');
  for (let item of items) {
      if (item.dataset.valor === valor) return;
  }
  
  const tag = document.createElement('span');
  tag.className = 'item-tag';
  tag.dataset.valor = valor;
  tag.textContent = texto;
  
  const btnEliminar = document.createElement('button');
  btnEliminar.textContent = '×';
  btnEliminar.onclick = function() {
      contenedor.removeChild(tag);
  };
  
  tag.appendChild(btnEliminar);
  contenedor.appendChild(tag);
}

// Función para obtener todos los items seleccionados
function obtenerItemsSeleccionados(contenedorId) {
  const items = [];
  const contenedor = document.getElementById(contenedorId);
  const tags = contenedor.querySelectorAll('.item-tag');
  
  tags.forEach(tag => {
      items.push({
          valor: tag.dataset.valor,
          texto: tag.textContent.slice(0, -1) // Eliminar el botón '×'
      });
  });
  
  return items;
}

// Función para guardar un personaje
function guardarPersonaje() {
  const nombre = document.getElementById("nombrePersonaje").value;
  if (!nombre) {
      alert("El nombre del personaje es obligatorio");
      return;
  }
  
  const personaje = {
      id: Date.now(),
      nombre: nombre,
      raza: {
          id: document.getElementById("raza").value,
          nombre: document.getElementById("raza").options[document.getElementById("raza").selectedIndex].text
      },
      subraza: {
          id: document.getElementById("subrazas").value,
          nombre: document.getElementById("subrazas").options[document.getElementById("subrazas").selectedIndex].text
      },
      clase: {
          id: document.getElementById("clase").value,
          nombre: document.getElementById("clase").options[document.getElementById("clase").selectedIndex].text
      },
      subclase: {
          id: document.getElementById("subclases").value,
          nombre: document.getElementById("subclases").options[document.getElementById("subclases").selectedIndex].text
      },
      genero: document.getElementById("genero").value,
      background: {
          id: document.getElementById("background").value,
          nombre: document.getElementById("background").options[document.getElementById("background").selectedIndex].text
      },
      alineamiento: {
          id: document.getElementById("alineamiento").value,
          nombre: document.getElementById("alineamiento").options[document.getElementById("alineamiento").selectedIndex].text
      },
      estadisticas: {
          fuerza: document.getElementById("fuerza").value,
          destreza: document.getElementById("destreza").value,
          constitucion: document.getElementById("constitucion").value,
          inteligencia: document.getElementById("inteligencia").value,
          sabiduria: document.getElementById("sabiduria").value,
          carisma: document.getElementById("carisma").value
      },
      equipo: obtenerItemsSeleccionados("equipoSeleccionado"),
      habilidades: obtenerItemsSeleccionados("habilidadesSeleccionadas"),
      accesorios: obtenerItemsSeleccionados("accesoriosSeleccionados"),
      proficiencias: obtenerItemsSeleccionados("proficienciasSeleccionadas"),
      lenguajes: obtenerItemsSeleccionados("lenguajesSeleccionados"),
      descripcion: document.getElementById("descripcion").value
  };
  
  // Obtener personajes existentes o inicializar un array vacío
  let personajesGuardados = JSON.parse(localStorage.getItem("personajesDnD")) || [];
  
  // Agregar el nuevo personaje
  personajesGuardados.push(personaje);
  
  // Guardar en localStorage
  localStorage.setItem("personajesDnD", JSON.stringify(personajesGuardados));
  
  alert("¡Personaje guardado exitosamente!");
  
  // Limpiar formulario o redirigir
  document.getElementById("nombrePersonaje").value = "";
  document.getElementById("descripcion").value = "";
  document.getElementById("caracteristicasPersonaje").style.display = "none";
  
  // Actualizar lista de personajes
  cargarPersonajesGuardados();
  
  // Mostrar la pestaña de personajes guardados
  cambiarPestana('savedCharactersTab');
}

// Función para cargar los personajes guardados
function cargarPersonajesGuardados() {
  const listaPersonajes = document.getElementById("listaPersonajes");
  listaPersonajes.innerHTML = "";
  
  // Obtener personajes del localStorage
  const personajesGuardados = JSON.parse(localStorage.getItem("personajesDnD")) || [];
  
  if (personajesGuardados.length === 0) {
      listaPersonajes.innerHTML = "<p>No hay personajes guardados.</p>";
      return;
  }
  
  // Crear tarjeta para cada personaje
  personajesGuardados.forEach(personaje => {
      const card = document.createElement("div");
      card.className = "character-card";
      
      let statsHTML = '';
      for (const [stat, value] of Object.entries(personaje.estadisticas)) {
          statsHTML += `<strong>${stat.charAt(0).toUpperCase() + stat.slice(1)}:</strong> ${value}, `;
      }
      statsHTML = statsHTML.slice(0, -2); // Quitar la última coma y espacio
      
      // Crear elementos para listas
      let equipoHTML = '';
      personaje.equipo.forEach(item => {
          equipoHTML += `<span class="item-tag">${item.texto}</span>`;
      });
      
      let habilidadesHTML = '';
      personaje.habilidades.forEach(item => {
          habilidadesHTML += `<span class="item-tag">${item.texto}</span>`;
      });
      
      let accesoriosHTML = '';
      personaje.accesorios.forEach(item => {
          accesoriosHTML += `<span class="item-tag">${item.texto}</span>`;
      });
      
      let proficienciasHTML = '';
      personaje.proficiencias.forEach(item => {
          proficienciasHTML += `<span class="item-tag">${item.texto}</span>`;
      });
      
      let lenguajesHTML = '';
      personaje.lenguajes.forEach(item => {
          lenguajesHTML += `<span class="item-tag">${item.texto}</span>`;
      });
      
      // Construir HTML para la tarjeta
      card.innerHTML = `
          <h3>${personaje.nombre}</h3>
          <p><strong>Raza:</strong> ${personaje.raza.nombre} ${personaje.subraza.nombre ? '(' + personaje.subraza.nombre + ')' : ''}</p>
          <p><strong>Clase:</strong> ${personaje.clase.nombre} ${personaje.subclase.nombre ? '(' + personaje.subclase.nombre + ')' : ''}</p>
          <p><strong>Género:</strong> ${personaje.genero}</p>
          <p><strong>Trasfondo:</strong> ${personaje.background.nombre}</p>
          <p><strong>Alineamiento:</strong> ${personaje.alineamiento.nombre}</p>
          <p><strong>Estadísticas:</strong> ${statsHTML}</p>
          
          <h4>Equipo:</h4>
          <div>${equipoHTML || 'Ninguno'}</div>
          
          <h4>Habilidades:</h4>
          <div>${habilidadesHTML || 'Ninguna'}</div>
          
          <h4>Accesorios:</h4>
          <div>${accesoriosHTML || 'Ninguno'}</div>
          
          <h4>Proficiencias:</h4>
          <div>${proficienciasHTML || 'Ninguna'}</div>
          
          <h4>Lenguajes:</h4>
          <div>${lenguajesHTML || 'Ninguno'}</div>
          
          <h4>Historia:</h4>
          <p>${personaje.descripcion || 'Sin historia'}</p>
          
          <button class="btn" onclick="eliminarPersonaje(${personaje.id})">Eliminar</button>
      `;
      
      listaPersonajes.appendChild(card);
  });
}

// Función para eliminar un personaje
function eliminarPersonaje(id) {
  if (!confirm("¿Estás seguro de querer eliminar este personaje?")) return;
  
  // Obtener personajes
  let personajesGuardados = JSON.parse(localStorage.getItem("personajesDnD")) || [];
  
  // Filtrar para eliminar el personaje
  personajesGuardados = personajesGuardados.filter(p => p.id !== id);
  
  // Guardar la lista actualizada
  localStorage.setItem("personajesDnD", JSON.stringify(personajesGuardados));
  
  // Actualizar la vista
  cargarPersonajesGuardados();
}

// Función para cambiar entre pestañas
function cambiarPestana(tabId) {
  // Ocultar todas las pestañas
  document.querySelectorAll('.tab-content').forEach(tab => {
      tab.classList.remove('active');
  });
  
  // Mostrar la pestaña seleccionada
  document.getElementById(tabId).classList.add('active');
}

// Event listeners
document.addEventListener("DOMContentLoaded", function() {
  // Botón para iniciar creación de personaje
  const btnCrearPersonaje = document.getElementById("btnCrearPersonaje");
  btnCrearPersonaje.addEventListener("click", cargarDatosPersonaje);
  
  // Botón para guardar personaje
  const btnGuardarPersonaje = document.getElementById("btnGuardarPersonaje");
  btnGuardarPersonaje.addEventListener("click", guardarPersonaje);
  
  // Cambiar entre pestañas
  document.getElementById("btnShowCreator").addEventListener("click", function() {
      cambiarPestana('creatorTab');
  });
  
  document.getElementById("btnShowSaved").addEventListener("click", function() {
      cambiarPestana('savedCharactersTab');
      cargarPersonajesGuardados();
  });
  
  // Event listeners para agregar items
  document.getElementById("btnAgregarArma").addEventListener("click", function() {
      const select = document.getElementById("armaSelect");
      if (select.value) {
          agregarItem(select.value, select.options[select.selectedIndex].text, "equipoSeleccionado");
      }
  });
  
  document.getElementById("btnAgregarArmadura").addEventListener("click", function() {
      const select = document.getElementById("armaduraSelect");
      if (select.value) {
          agregarItem(select.value, select.options[select.selectedIndex].text, "equipoSeleccionado");
      }
  });
  
  document.getElementById("btnAgregarHabilidad").addEventListener("click", function() {
      const select = document.getElementById("features");
      if (select.value) {
          agregarItem(select.value, select.options[select.selectedIndex].text, "habilidadesSeleccionadas");
      }
  });
  
  document.getElementById("btnAgregarAccesorio").addEventListener("click", function() {
      const select = document.getElementById("accesorioSelect");
      const personalizado = document.getElementById("accesorioPersonalizado").value;
      
      let valor = select.value;
      let texto = select.value ? select.options[select.selectedIndex].text : '';
      
      if (personalizado) {
          valor = personalizado.toLowerCase().replace(/\s+/g, '-');
          texto = personalizado;
      }
      
      if (valor) {
          agregarItem(valor, texto, "accesoriosSeleccionados");
          document.getElementById("accesorioPersonalizado").value = "";
      }
  });
  
  document.getElementById("btnAgregarProficiencia").addEventListener("click", function() {
      const select = document.getElementById("proficiencias");
      if (select.value) {
          agregarItem(select.value, select.options[select.selectedIndex].text, "proficienciasSeleccionadas");
      }
  });
  
  document.getElementById("btnAgregarLenguaje").addEventListener("click", function() {
      const select = document.getElementById("lenguajes");
      if (select.value) {
          agregarItem(select.value, select.options[select.selectedIndex].text, "lenguajesSeleccionados");
      }
  });
  
  // Definir la función eliminarPersonaje en el ámbito global
  window.eliminarPersonaje = eliminarPersonaje;
  
  // Cargar personajes guardados al inicio
  cargarPersonajesGuardados();
});