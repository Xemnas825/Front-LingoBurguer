document.addEventListener('DOMContentLoaded', function() {
    
    app.use(cors({
        origin: 'https://tu-dominio.com/',
        methods: ['GET', 'POST'],
        credentials: true
      }));
    
    // Variables para elementos del DOM
    const categoryBtns = document.querySelectorAll('.category-btn');
    const cartaSections = document.querySelectorAll('.carta-items');
    const header = document.querySelector('header');
    
    // ===== FUNCIONALIDAD DEL CARTA =====
    // Cambiar categorías del carta al hacer clic
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remover clase active de todos los botones
            categoryBtns.forEach(b => b.classList.remove('active'));
            
            // Añadir clase active al botón clickeado
            this.classList.add('active');
            
            // Obtener la categoría a mostrar
            const category = this.getAttribute('data-category');
            
            // Mostrar/ocultar las secciones del carta según la categoría
            cartaSections.forEach(section => {
                if (section.id === category) {
                    section.style.display = 'grid';
                } else {
                    section.style.display = 'none';
                }
            });
        });
    });
    
    // ===== NAVEGACIÓN SUAVE =====
    // Efecto de scroll suave para los enlaces internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return; // Prevenir acción en enlaces vacíos
            
            const targetElement = document.querySelector(targetId);
            if (!targetElement) return; // Verificar que el elemento existe
            
            window.scrollTo({
                top: targetElement.offsetTop - 80, // Offset para compensar header
                behavior: 'smooth'
            });
        });
    });
    
    // ===== CAMBIO DE HEADER AL HACER SCROLL =====
    // Efecto de transparencia y color en el header
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            // Header compacto al hacer scroll
            header.style.padding = '10px 0';
            header.style.background = 'rgba(0, 0, 0, 0.9)'; // Negro semi-transparente
            header.style.color = 'white';
        } else {
            // Header normal al inicio de la página
            header.style.padding = '20px 0';
            header.style.background = 'transparent'; // Transparente
            header.style.color = 'white';
        }
    });
});