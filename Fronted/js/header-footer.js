document.addEventListener('DOMContentLoaded', function() {
    // Menú móvil
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    
    menuToggle.addEventListener('click', function() {
        mobileMenu.classList.toggle('show-menu');
        
        // Si la búsqueda está abierta, la cerramos
        if (searchDropdown.classList.contains('show-search')) {
            searchDropdown.classList.remove('show-search');
        }
    });
    
    // Búsqueda desplegable
    // Corregido: seleccionamos por clase y el primer elemento que coincida
    const searchIcon = document.querySelector('.action-icon .fa-search').parentElement;
    const searchDropdown = document.getElementById('search-dropdown');
    
    searchIcon.addEventListener('click', function() {
        searchDropdown.classList.toggle('show-search');
        
        // Si el menú móvil está abierto, lo cerramos
        if (mobileMenu.classList.contains('show-menu')) {
            mobileMenu.classList.remove('show-menu');
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
        if (!event.target.closest('.mobile-menu') && 
            !event.target.closest('.mobile-menu-toggle') &&
            !event.target.closest('.search-dropdown') &&
            !event.target.closest('.action-icon .fa-search')) {  // Corregido: usamos selector de clase
            
            if (mobileMenu.classList.contains('show-menu')) {
                mobileMenu.classList.remove('show-menu');
            }
            
            if (searchDropdown.classList.contains('show-search')) {
                searchDropdown.classList.remove('show-search');
            }
        }
    });
});