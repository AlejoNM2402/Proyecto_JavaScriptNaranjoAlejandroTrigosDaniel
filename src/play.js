// Imagenes que apareceran en las tarjetas de cada personaje creade dependiendo su raza
const razaImagenes = {
    "dragonborn": "https://cdnb.artstation.com/p/assets/images/images/040/208/865/large/stu-harrington-anubis-deathdragon-stuharrington.jpg?1628173232",
    "dwarf": "https://cdnb.artstation.com/p/assets/images/images/029/056/277/large/diego-vila-turin-stormeye3.jpg?1596318545",
    "elf": "https://cdna.artstation.com/p/assets/images/images/074/590/546/large/duong-lam-ranger-final-v2.jpg?1712443792",
    "gnome": "https://cdnb.artstation.com/p/assets/images/images/026/915/751/large/rina-saethra-leera-and-brownie-00-copy-small.jpg?1590076399",
    "half-elf": "https://cdna.artstation.com/p/assets/images/images/077/926/954/large/zen-adventurer-bathed-in-sunrise.jpg?1720711685",
    "half-orc": "https://cdna.artstation.com/p/assets/images/images/056/133/718/large/krzysztof-porchowski-jr-painted-warrior-illustration-final.jpg?1668533943",
    "halfling": "https://cdnb.artstation.com/p/assets/images/images/026/372/189/20200504110244/smaller_square/natalia-verauko-trykowska-gwennafred01-fin-medium.jpg?1588608165",
    "human": "https://cdna.artstation.com/p/assets/images/images/030/212/610/large/leo-gr1dwaf.jpg?1599934251",
    "tiefling": "https://cdnb.artstation.com/p/assets/images/images/019/358/075/large/victor-tan-co-thiefling-v2-lr.jpg?1563137340",
    "default": "https://cdna.artstation.com/p/assets/images/images/030/212/610/large/leo-gr1dwaf.jpg?1599934251" // Humano normal
};

// Carga de datos de la API
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

// equipo específico
function cargarEquipo() {
    // armas
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

    // armaduras
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

// Funcion para cargar todos los datos desde la api
function cargarDatosPersonaje() {
    // Mostrar las características
    document.getElementById("caracteristicasPersonaje").style.display = "block";
    document.getElementById("btnCrearPersonaje").style.display = "none";

    // Cargar de seleccion
    cargarSelect("classes", "clase");
    cargarSelect("races", "raza");
    cargarSelect("features", "features");

    // Cargar equipos
    cargarEquipo();
}

// Función para agregar un ítem con etiqueta y botón de eliminar
function agregarItem(valor, texto, contenedorId) {
    if (!valor) return;

    const contenedor = document.getElementById(contenedorId);

    // Verificar si ya existe el item
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

// Función para guardar el guardado de personajes
function guardarPersonaje() {
    const nombre = document.getElementById("nombrePersonaje").value;
    if (!nombre) {
        alert("El nombre del personaje es obligatorio");
        return;
    }

    const razaSelect = document.getElementById("raza");
    const razaValor = razaSelect.value;
    const razaNombre = razaValor ? razaSelect.options[razaSelect.selectedIndex].text : "";

    if (!razaValor) {
        alert("Debes seleccionar una raza para tu personaje");
        return;
    }
    const claseSelect = document.getElementById("clase");
    const claseValor = claseSelect.value;
    const claseNombre = claseValor ? claseSelect.options[claseSelect.selectedIndex].text : "";
    if (!claseValor) {
        alert("Debes seleccionar una clase para tu personaje");
        return;
    }

    const personaje = {
        id: Date.now(),
        nombre: nombre,
        raza: {
            id: razaValor,
            nombre: razaNombre
        },
        clase: {
            id: claseValor,
            nombre: claseNombre
        },
        genero: document.getElementById("genero").value,
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
        imagen: razaImagenes[razaValor] || razaImagenes["default"]
    };

    // Obtener personajes existentes o crear un array vacio
    let personajesGuardados = JSON.parse(localStorage.getItem("personajesDnD")) || [];

    // Agregar el nuevo personaje
    personajesGuardados.push(personaje);

    // Guardar en localStorage
    localStorage.setItem("personajesDnD", JSON.stringify(personajesGuardados));

    alert("¡Personaje guardado exitosamente!");

    document.getElementById("nombrePersonaje").value = "";
    document.getElementById("caracteristicasPersonaje").style.display = "none";
    document.getElementById("btnCrearPersonaje").style.display = "block";

    // Actualizacion de la lista
    cargarPersonajesGuardados();

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
        
        // Crear HTML para la tarjeta (solo nombre e imagen)
        card.innerHTML = `
            <img src="${personaje.imagen}" alt="${personaje.nombre}" class="character-img">
            <div class="character-info">
                <h3>${personaje.nombre}</h3>
                <button class="btn ver-detalles" data-id="${personaje.id}">Ver Detalles</button>
            </div>
        `;
        
        listaPersonajes.appendChild(card);
    });

    // eventos de escucha a los botones de detalles
    document.querySelectorAll('.ver-detalles').forEach(btn => {
        btn.addEventListener('click', () => mostrarDetallesPersonaje(btn.dataset.id));
    });
}

// funcion Eliminacion de personajes
function eliminarPersonaje(id) {
    if (!confirm("¿Estás seguro de querer eliminar este personaje?")) return;
    
    console.log("Eliminando personaje con ID:", id);
    
    // Obtener personajes
    let personajesGuardados = JSON.parse(localStorage.getItem("personajesDnD")) || [];
    
    // Filtrar para eliminar el personaje
    personajesGuardados = personajesGuardados.filter(p => p.id !== parseInt(id));
    
    // Guardar la lista actualizada
    localStorage.setItem("personajesDnD", JSON.stringify(personajesGuardados));
    
    // Cerrar el modal si está abierto
    document.getElementById("personajeModal").style.display = "none";
    
    // Actualizar la vista
    cargarPersonajesGuardados();
    
    console.log("Personaje eliminado correctamente");
}

// Función para mostrar detalles del personaje en un modal
function mostrarDetallesPersonaje(id) {
    const personajesGuardados = JSON.parse(localStorage.getItem("personajesDnD")) || [];
    const personaje = personajesGuardados.find(p => p.id.toString() === id.toString());

    if (!personaje) return;

    const modal = document.getElementById("personajeModal");
    const detalles = document.getElementById("detallesPersonaje");

    let statsHTML = '<div class="stats-detail">';
    for (const [stat, value] of Object.entries(personaje.estadisticas)) {
        statsHTML += `<div class="stat-item">${stat.charAt(0).toUpperCase() + stat.slice(1)}: ${value}</div>`;
    }
    statsHTML += '</div>';

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

    // HTML de detalles
    detalles.innerHTML = `
        <img src="${personaje.imagen}" alt="${personaje.nombre}" class="character-detail-img">
        <h2>${personaje.nombre}</h2>
        
        <div class="character-detail-section">
            <p><strong>Raza:</strong> ${personaje.raza.nombre}</p>
            <p><strong>Clase:</strong> ${personaje.clase.nombre}</p>
            <p><strong>Género:</strong> ${personaje.genero}</p>
        </div>
        
        <div class="character-detail-section">
            <h3>Estadísticas</h3>
            ${statsHTML}
        </div>
        
        <div class="character-detail-section">
            <h3>Equipo</h3>
            <div>${equipoHTML || 'Ninguno'}</div>
        </div>
        
        <div class="character-detail-section">
            <h3>Habilidades</h3>
            <div>${habilidadesHTML || 'Ninguna'}</div>
        </div>
        
        <div class="character-detail-section">
            <h3>Accesorios</h3>
            <div>${accesoriosHTML || 'Ninguno'}</div>
        </div>
        
        <div id="deleteButtonContainer"></div>
    `;
    
    // boton d eliminar
    const deleteButton = document.createElement('button');
    deleteButton.className = 'btn btn-delete';
    deleteButton.textContent = 'Eliminar Personaje';
    deleteButton.addEventListener('click', function() {
        eliminarPersonaje(personaje.id);
    });
    
    document.getElementById('deleteButtonContainer').appendChild(deleteButton);

    modal.style.display = "block";

    document.querySelector(".close").onclick = function() {
        modal.style.display = "none";
    };

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };
}

// Función de cambio entre pestañas
function cambiarPestana(tabId) {
    // Ocultar todas las pestañas
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    document.getElementById(tabId).classList.add('active');
}

document.addEventListener("DOMContentLoaded", function() {
    // Botón para iniciar creación de personaje
    const btnCrearPersonaje = document.getElementById("btnCrearPersonaje");
    btnCrearPersonaje.addEventListener("click", cargarDatosPersonaje);

    // Botón para guardar personaje
    const btnGuardarPersonaje = document.getElementById("btnGuardarPersonaje");
    btnGuardarPersonaje.addEventListener("click", guardarPersonaje);

    // Cambiar de pestaña
    document.getElementById("btnShowCreator").addEventListener("click", function() {
        cambiarPestana('creatorTab');
    });

    document.getElementById("btnShowSaved").addEventListener("click", function() {
        cambiarPestana('savedCharactersTab');
        cargarPersonajesGuardados();
    });

    // agregar items
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
        
        // Si hay texto personalizado, lo usamos
        if (personalizado) {
            valor = personalizado.toLowerCase().replace(/\s+/g, '-');
            texto = personalizado;
        }
        
        if (valor) {
            agregarItem(valor, texto, "accesoriosSeleccionados");
            document.getElementById("accesorioPersonalizado").value = "";
        }
    });
    
    // Cargar personajes guardados al inicio
    cargarPersonajesGuardados();
});

// FUncion de eliminar personaje para accesibilidad global
window.eliminarPersonaje = eliminarPersonaje;