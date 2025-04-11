// Toggle Dark Mode
function setupDarkMode() {
    const darkModeBtn = document.querySelector('.modo-oscuro-btn');
    if (!darkModeBtn) return; // Si no existe el botón, salir
    
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Función para actualizar el icono y el tema
    function updateTheme(isDark) {
        document.body.classList.remove('light-theme', 'dark-theme');
        document.body.classList.add(isDark ? 'dark-theme' : 'light-theme');
        
        // Actualizar el icono y el texto para lectores de pantalla
        const iconClass = isDark ? 'fa-sun' : 'fa-moon';
        const modeText = isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro';
        darkModeBtn.innerHTML = `<i class="fas ${iconClass}" aria-hidden="true"></i>`;
        darkModeBtn.setAttribute('aria-label', modeText);
        
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }

    // Inicializar tema basado en localStorage o preferencia del sistema
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        updateTheme(savedTheme === 'dark');
    } else {
        updateTheme(prefersDarkScheme.matches);
    }

    // Manejar clic en el botón
    darkModeBtn.addEventListener('click', () => {
        const isDark = document.body.classList.contains('light-theme');
        updateTheme(isDark);
    });
    
    // Manejar tecla Enter o Espacio cuando el botón tiene foco
    darkModeBtn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            const isDark = document.body.classList.contains('light-theme');
            updateTheme(isDark);
        }
    });

    // Manejar cambios en la preferencia del sistema
    prefersDarkScheme.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            updateTheme(e.matches);
        }
    });
}

// Cambiar entre precios mensuales y anuales
document.addEventListener('DOMContentLoaded', () => {
    const planToggle = document.getElementById('planToggle');
    const precioEstandar = document.querySelector('.precio-estandar');
    const precioVIP = document.querySelector('.precio-vip');
    const precioBásico = document.querySelector('.precio-basico');
    const textoPeriodo = document.querySelectorAll('.periodo');

    // Valores de precios
    const preciosMensuales = {
        basico: 25000,
        estandar: 35000,
        vip: 52500
    };

    const preciosAnuales = {
        basico: 225000,
        estandar: 315000,
        vip: 472500
    };

    // Función para actualizar precios
    function actualizarPrecios(esAnual) {
        precioBásico.textContent = esAnual ? preciosAnuales.basico : preciosMensuales.basico;
        precioEstandar.textContent = esAnual ? preciosAnuales.estandar : preciosMensuales.estandar;
        precioVIP.textContent = esAnual ? preciosAnuales.vip : preciosMensuales.vip;

        textoPeriodo.forEach(element => {
            element.textContent = esAnual ? '/año' : '/mes';
        });
    }

    // Event listener para el toggle
    planToggle.addEventListener('change', () => {
        actualizarPrecios(planToggle.checked);
    });

    // Inicializar precios
    actualizarPrecios(planToggle.checked);
});

// CONTADOR ANIMADO
function animateCounter() {
    const numero = document.querySelector('.numero');
    if (!numero) return;

    const target = 500;
    let current = 0;
    const duration = 2000; // 2 segundos
    const increment = target / (duration / 16); // 16ms por frame (aproximadamente 60fps)

    function updateCounter() {
        current += increment;
        if (current >= target) {
            current = target;
            numero.textContent = target;
            return;
        }
        numero.textContent = Math.round(current);
        requestAnimationFrame(updateCounter);
    }

    // Solo animar cuando el elemento esté en la vista
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                updateCounter();
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    observer.observe(numero);
}

// Inicializar el contador cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', animateCounter);


// Filtros de clases
document.addEventListener('DOMContentLoaded', () => {
    const filtroBtns = document.querySelectorAll('.filtro-btn');
    const claseContainers = document.querySelectorAll('.clase-container');

    filtroBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remover clase active de todos los botones
            filtroBtns.forEach(b => b.classList.remove('active'));
            // Agregar clase active al botón clickeado
            btn.classList.add('active');
            
            // Ocultar todos los contenedores de clase
            claseContainers.forEach(container => {
                container.style.display = 'none';
            });
            
            // Mostrar el contenedor correspondiente
            const claseId = btn.dataset.clase;
            document.getElementById(claseId).style.display = 'block';
        });
    });

    // Inicializar con Musculación activa
    document.querySelector('.filtro-btn[data-clase="musculacion"]').click();
});

// Sistema de Filtrado
document.addEventListener('DOMContentLoaded', function() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    const articles = document.querySelectorAll('.article-card');
    const tagFilters = document.querySelectorAll('.tag-filter label');

    // Función para filtrar artículos
    function filterArticles() {
        const selectedCategory = document.querySelector('.category-btn.active')?.dataset.category || 'all';
        const selectedTags = Array.from(tagFilters || [])
            .filter(label => label.classList.contains('active'))
            .map(label => label.dataset.tag);

        if (!articles.length) return;

        articles.forEach(article => {
            const articleTags = article.dataset.tags ? article.dataset.tags.split(' ') : [];
            const articleCategory = article.classList[1];

            // Mostrar si coincide con la categoría seleccionada
            const categoryMatch = selectedCategory === 'all' || articleCategory === selectedCategory;
            // Mostrar si tiene al menos una de las tags seleccionadas
            const tagMatch = selectedTags.length === 0 || 
                           articleTags.some(tag => selectedTags.includes(tag));

            article.style.display = categoryMatch && tagMatch ? 'block' : 'none';
        });
    }

    // Event listeners para botones de categoría
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            filterArticles();
        });
    });

    // Event listeners para filtros de tags
    tagFilters.forEach(label => {
        label.addEventListener('click', function() {
            // Alternar estado activo
            if (this.classList.contains('active')) {
                this.classList.remove('active');
            } else {
                this.classList.add('active');
            }

            filterArticles();
        });
    });

    // Efecto Scroll Reveal
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -100px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observar cada artículo
    articles.forEach(article => {
        observer.observe(article);
    });

    // Sistema de comentarios
    const commentForm = document.querySelector('.comment-form');
    const addCommentSection = document.querySelector('.add-comment');

    if (commentForm && addCommentSection) {
        commentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.querySelector('#name').value;
            const comment = document.querySelector('#comment').value;

            if (name && comment) {
                // Crear nuevo comentario
                const newComment = document.createElement('div');
                newComment.className = 'comment';
                newComment.innerHTML = `
                    <div class="comment-avatar">
                        <div class="avatar-circle"></div>
                    </div>
                    <div class="comment-content">
                        <div class="comment-header">
                            <span class="comment-author">${name}</span>
                            <span class="comment-date">${new Date().toLocaleDateString()}</span>
                        </div>
                        <p>${comment}</p>
                        <div class="comment-actions">
                            <button class="like-btn"><i class="fas fa-thumbs-up"></i> Me gusta</button>
                            <button class="reply-btn"><i class="fas fa-reply"></i> Responder</button>
                        </div>
                    </div>
                `;

                // Insertar antes del formulario
                addCommentSection.before(newComment);

                // Limpiar formulario
                commentForm.reset();
            }
        });
    }
});

// Mobile Menu Toggle
function setupMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const menu = document.querySelector('.menu');
    const dropdowns = document.querySelectorAll('.dropdown');

    if (!menuToggle || !menu) {
        console.log('Menu toggle or menu not found');
        return;
    }
    
    console.log('Menu toggle and menu found');
    // Toggle menu visibility when clicking the menu button
    menuToggle.addEventListener('click', () => {
        menu.classList.toggle('active');
        const isExpanded = menu.classList.contains('active');
        menuToggle.setAttribute('aria-expanded', isExpanded);
        console.log('Menu toggled:', isExpanded);
    });
    
    // Hacer que el menú móvil sea accesible con teclado
    menuToggle.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            menu.classList.toggle('active');
            const isExpanded = menu.classList.contains('active');
            menuToggle.setAttribute('aria-expanded', isExpanded);
            console.log('Menu toggled with keyboard:', isExpanded);
        }
    });

    // Handle dropdown menus on mobile
    dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('a');
        const submenu = dropdown.querySelector('.submenu');
        
        if (!link || !submenu) return;
        
        // Añadir control con teclado
        link.addEventListener('keydown', (e) => {
            // Si se presiona Enter o Espacio cuando el enlace tiene foco
            if ((e.key === 'Enter' || e.key === ' ') && window.innerWidth <= 768) {
                e.preventDefault();
                dropdown.classList.toggle('active');
                const isExpanded = dropdown.classList.contains('active');
                link.setAttribute('aria-expanded', isExpanded);
                console.log('Dropdown toggled with keyboard:', isExpanded);
                
                // Cerrar otros submenús
                dropdowns.forEach(otherDropdown => {
                    if (otherDropdown !== dropdown && otherDropdown.classList.contains('active')) {
                        otherDropdown.classList.remove('active');
                        const otherLink = otherDropdown.querySelector('a');
                        if (otherLink) otherLink.setAttribute('aria-expanded', 'false');
                    }
                });
            }
        });

        // For mobile view, prevent the dropdown link from navigating and toggle submenu instead
        link.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                dropdown.classList.toggle('active');
                const isExpanded = dropdown.classList.contains('active');
                link.setAttribute('aria-expanded', isExpanded);
                console.log('Dropdown toggled with click:', isExpanded);
                
                // Close other open dropdowns
                dropdowns.forEach(otherDropdown => {
                    if (otherDropdown !== dropdown && otherDropdown.classList.contains('active')) {
                        otherDropdown.classList.remove('active');
                        const otherLink = otherDropdown.querySelector('a');
                        if (otherLink) otherLink.setAttribute('aria-expanded', 'false');
                    }
                });
            }
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!menu.contains(e.target) && e.target !== menuToggle) {
            menu.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
            console.log('Menu closed by clicking outside');
            
            // Close all dropdowns
            dropdowns.forEach(dropdown => {
                dropdown.classList.remove('active');
                const link = dropdown.querySelector('a');
                if (link) link.setAttribute('aria-expanded', 'false');
            });
        }
    });
}

// Inicializar componentes cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    setupDarkMode();
    setupMobileMenu();
    animateCounter();
});