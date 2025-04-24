// Mapeo de imágenes para razas (aquí puedes agregar más razas según necesites)
const razaImagenes = {
    "dragonborn": "https://cdnb.artstation.com/p/assets/images/images/047/067/749/large/clint-cearley-draconian-final-by-clint-cearley.jpg?1646681308",
    "dwarf": "https://cdnb.artstation.com/p/assets/images/images/029/056/277/large/diego-vila-turin-stormeye3.jpg?1596318545",
    "elf": "https://cdna.artstation.com/p/assets/images/images/074/590/546/large/duong-lam-ranger-final-v2.jpg?1712443792",
    "gnome": "https://cdnb.artstation.com/p/assets/images/images/026/915/751/large/rina-saethra-leera-and-brownie-00-copy-small.jpg?1590076399",
    "half-elf": "https://cdna.artstation.com/p/assets/images/images/077/926/954/large/zen-adventurer-bathed-in-sunrise.jpg?1720711685",
    "half-orc": "../assets/img/razas/half-orc.jpg",
    "halfling": "../assets/img/razas/halfling.jpg",
    "human": "../assets/img/razas/human.jpg",
    "tiefling": "../assets/img/razas/tiefling.jpg",
    "default": "../assets/img/razas/default.jpg" // Humano normal
};

// Función genérica para cargar datos desde la API
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
    document.getElementById("btnCrearPersonaje").style.display = "none";

    // Cargar datos para seleccionar
    cargarSelect("classes", "clase");
    cargarSelect("races", "raza");
    cargarSelect("features", "features");

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

    // Obtener personajes existentes o inicializar un array vacío
    let personajesGuardados = JSON.parse(localStorage.getItem("personajesDnD")) || [];

    // Agregar el nuevo personaje
    personajesGuardados.push(personaje);

    // Guardar en localStorage
    localStorage.setItem("personajesDnD", JSON.stringify(personajesGuardados));

    alert("¡Personaje guardado exitosamente!");

    // Limpiar formulario
    document.getElementById("nombrePersonaje").value = "";
    document.getElementById("caracteristicasPersonaje").style.display = "none";
    document.getElementById("btnCrearPersonaje").style.display = "block";

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

    // Agregar event listeners a los botones de detalles
    document.querySelectorAll('.ver-detalles').forEach(btn => {
        btn.addEventListener('click', () => mostrarDetallesPersonaje(btn.dataset.id));
    });
}

// ===== NUEVA IMPLEMENTACIÓN DE ELIMINAR PERSONAJE =====
// Esta función ahora usa un botón creado con JavaScript en lugar de HTML
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

    // Crear estadísticas HTML
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

    // Construir HTML para los detalles (SIN BOTÓN DE ELIMINAR)
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
    
    // Crear botón de eliminar con JavaScript
    const deleteButton = document.createElement('button');
    deleteButton.className = 'btn btn-delete';
    deleteButton.textContent = 'Eliminar Personaje';
    deleteButton.addEventListener('click', function() {
        eliminarPersonaje(personaje.id);
    });
    
    // Agregar el botón al contenedor
    document.getElementById('deleteButtonContainer').appendChild(deleteButton);

    // Mostrar el modal
    modal.style.display = "block";

    // Cerrar modal al hacer clic en la X
    document.querySelector(".close").onclick = function() {
        modal.style.display = "none";
    };

    // Cerrar modal al hacer clic fuera del contenido
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };
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

// Esto es necesario para que la función sea accesible globalmente (por si acaso)
window.eliminarPersonaje = eliminarPersonaje;