// Función para filtrar las clases
function filtrarClases(filtro) {
    const claseWrappers = document.querySelectorAll('.clase-wrapper');
    const horariosFilas = document.querySelectorAll('.horarios-fila');
    
    // Mostrar todos los horarios por defecto
    horariosFilas.forEach(fila => {
        fila.style.display = 'flex';
    });

    // Actualizar atributos ARIA para accesibilidad
    document.querySelectorAll('.filtro-btn').forEach(btn => {
        const isSelected = btn.dataset.filtro === filtro;
        btn.setAttribute('aria-selected', isSelected);
    });

    // Si el filtro es "todos", mostrar todas las clases
    if (filtro === 'todos') {
        claseWrappers.forEach(wrapper => {
            wrapper.style.display = 'flex';
            wrapper.setAttribute('aria-hidden', 'false');
        });
        return;
    }

    // Mostrar solo las clases que coincidan con el filtro
    claseWrappers.forEach(wrapper => {
        const clase = wrapper.getAttribute('data-clase');
        if (clase === filtro) {
            wrapper.style.display = 'flex';
            wrapper.setAttribute('aria-hidden', 'false');
        } else {
            wrapper.style.display = 'none';
            wrapper.setAttribute('aria-hidden', 'true');
        }
    });

    // Filtrar los horarios
    horariosFilas.forEach(fila => {
        const claseCell = fila.querySelector('.clase-cell');
        if (claseCell) {
            const clase = claseCell.textContent.trim();
            if (filtro !== 'todos' && clase !== filtro) {
                fila.style.display = 'none';
            } else {
                fila.style.display = 'flex';
            }
        }
    });

    // Si estamos en vista móvil, hacer scroll hasta las clases
    if (window.innerWidth < 768) {
        const clasesSection = document.querySelector('.galeria-clases');
        if (clasesSection) {
            // Scroll hasta el inicio de las clases con un pequeño offset para la navbar
            window.scrollTo({
                top: clasesSection.offsetTop - 70,
                behavior: 'smooth'
            });
        }
    }
}

// Función para adaptar comportamiento de las clases según el viewport
function adaptarClasesAViewport() {
    const isSmallScreen = window.innerWidth < 768;
    const claseItems = document.querySelectorAll('.clase-item');
    
    claseItems.forEach(item => {
        // Remover event listeners anteriores
        const newItem = item.cloneNode(true);
        item.parentNode.replaceChild(newItem, item);
        
        if (isSmallScreen) {
            // En pantallas pequeñas, mostrar descripción al hacer clic
            newItem.addEventListener('click', function() {
                const descripcionContainer = this.nextElementSibling;
                if (descripcionContainer) {
                    const isVisible = descripcionContainer.style.maxHeight;
                    
                    // Ocultar todas las descripciones primero
                    document.querySelectorAll('.clase-descripcion-container').forEach(desc => {
                        desc.style.maxHeight = null;
                    });
                    
                    // Mostrar/ocultar la descripción actual
                    if (!isVisible) {
                        descripcionContainer.style.maxHeight = descripcionContainer.scrollHeight + 'px';
                    }
                }
            });
        }
    });
    
    // Asegurar que los filtros sean visibles horizontalmente
    const filtroActivo = document.querySelector('.filtro-btn.active');
    if (filtroActivo && isSmallScreen) {
        filtroActivo.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
}

// Inicializar filtros y eventos
document.addEventListener('DOMContentLoaded', function() {
    // Agregar evento a los botones de filtro
    const filtroBtns = document.querySelectorAll('.filtro-btn');
    filtroBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remover clase active de todos los botones
            filtroBtns.forEach(b => b.classList.remove('active'));
            // Agregar clase active al botón clickeado
            this.classList.add('active');

            // Obtener el filtro seleccionado
            const filtro = this.dataset.filtro;
            filtrarClases(filtro);
        });
        
        // Soporte para teclado
        btn.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
    
    // Inicializar adaptación a viewport
    adaptarClasesAViewport();
    
    // Actualizar cuando cambia el tamaño de la ventana
    window.addEventListener('resize', adaptarClasesAViewport);
    
    // Detectar cuando se termina el scroll horizontal en tabla
    const horariosList = document.querySelector('.horarios-lista');
    if (horariosList) {
        horariosList.addEventListener('scroll', function() {
            const isAtEnd = this.scrollLeft + this.clientWidth >= this.scrollWidth - 10;
            if (isAtEnd) {
                this.classList.add('scrolled-end');
            } else {
                this.classList.remove('scrolled-end');
            }
        });
    }
    
    // Iniciar con filtro "todos" activo
    filtrarClases('todos');
});
