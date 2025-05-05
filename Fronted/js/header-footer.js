document.addEventListener('DOMContentLoaded', function() {
    // Menú unificado
    const menuToggle = document.getElementById('menu-toggle');
    const menuContent = document.getElementById('menu-content');
    
    menuToggle.addEventListener('click', function() {
        menuContent.classList.toggle('show-menu');
        
        // Si la búsqueda está abierta, la cerramos
        if (searchDropdown.classList.contains('show-search')) {
            searchDropdown.classList.remove('show-search');
        }
    });
    
    // Búsqueda desplegable
    const searchIcon = document.querySelector('.search-icon');
    const searchDropdown = document.getElementById('search-dropdown');
    
    searchIcon.addEventListener('click', function() {
        searchDropdown.classList.toggle('show-search');
        
        // Si el menú está abierto, lo cerramos
        if (menuContent.classList.contains('show-menu')) {
            menuContent.classList.remove('show-menu');
        }
        
        // Enfocamos en el campo de búsqueda
        if (searchDropdown.classList.contains('show-search')) {
            setTimeout(function() {
                searchDropdown.querySelector('.search-input').focus();
            }, 100);
        }
    });
    
    // Cerrar desplegables al hacer clic fuera
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.menu-content') && 
            !event.target.closest('.menu-toggle') &&
            !event.target.closest('.search-dropdown') &&
            !event.target.closest('.search-icon')) {
            
            if (menuContent.classList.contains('show-menu')) {
                menuContent.classList.remove('show-menu');
            }
            
            if (searchDropdown.classList.contains('show-search')) {
                searchDropdown.classList.remove('show-search');
            }
        }
    });
});
