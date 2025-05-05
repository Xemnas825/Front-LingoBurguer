document.addEventListener('DOMContentLoaded', function() {
    // Funcionalidad para editar información personal
    const editBtn = document.getElementById('edit-info-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    const form = document.getElementById('personal-info-form');
    const formInputs = form.querySelectorAll('input, textarea, select');
    const formButtons = form.querySelector('.form-buttons');
    
    // Activar modo edición
    editBtn.addEventListener('click', function() {
        formInputs.forEach(input => {
            input.disabled = false;
        });
        formButtons.style.display = 'flex';
        editBtn.style.display = 'none';
    });
    
    // Cancelar edición
    cancelBtn.addEventListener('click', function() {
        formInputs.forEach(input => {
            input.disabled = true;
        });
        formButtons.style.display = 'none';
        editBtn.style.display = 'flex';
    });
    
    // Envío del formulario
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Aquí iría la lógica para guardar los cambios
        
        formInputs.forEach(input => {
            input.disabled = true;
        });
        formButtons.style.display = 'none';
        editBtn.style.display = 'flex';
        
        // Mostrar un mensaje de éxito
        alert('¡Información actualizada correctamente!');
    });
    
    // Toggle para menú móvil
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
    
    // Navegación
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Aquí iría la lógica para cambiar de página o cargar contenido
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
});