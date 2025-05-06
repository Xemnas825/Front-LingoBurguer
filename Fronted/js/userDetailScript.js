document.addEventListener('DOMContentLoaded', function() {
    // Funcionalidad para editar información personal
    const editBtn = document.getElementById('edit-info-btn');
    const ratingsPannel = document.getElementById('comments-feed');
    const orderPannel = document.getElementById('orders-pannel');
    const ratingsBtn = document.getElementById('ratings-button');
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
    
    function showForm(formToShow) {
        // Ocultar todos los formularios
        form.style.display = 'none';
        orderPannel.style.display = 'none';
        ratingsPannel.style.display = 'none';
        
        // Mostrar el formulario seleccionado
        formToShow.style.display = 'block';
    }

    // Revisar !!!!!!!!!!!!!!!!!!!!!!!!!!
    ratingsBtn.addEventListener('click', function(){
        showForm(ratingsPannel);
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