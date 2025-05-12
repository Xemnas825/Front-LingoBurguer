document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const editBtn = document.getElementById('edit-info-btn');
    const orderPannel = document.getElementById('orders-pannel');
    const personalPannel = document.getElementById('persInfoPannel');
    const cancelBtn = document.getElementById('cancel-btn');
    const form = document.getElementById('personal-info-form');
    const formInputs = form.querySelectorAll('input, textarea, select');
    const formButtons = form.querySelector('.form-buttons');
    
    // Botones del menú lateral (usando los IDs que ya tienes)
    const persInfoBtn = document.getElementById('persInfoBtn').closest('a'); // Selecciona el <a> que contiene el ícono
    const ordersBtn = document.getElementById('ordersBtn').closest('a');   // Selecciona el <a> que contiene el ícono
    
    // Función para cambiar entre paneles
    function showPanel(panelToShow) {
        // Oculta todos los paneles
        personalPannel.style.display = 'none';
        orderPannel.style.display = 'none';
        
        // Muestra solo el panel seleccionado
        if (panelToShow === 'personal') {
            personalPannel.style.display = 'block';
        } 
        else if (panelToShow === 'orders') {
            orderPannel.style.display = 'block';
        }
    }

    // Evento para el botón "Información Personal"
    persInfoBtn.addEventListener('click', function(e) {
        e.preventDefault();
        showPanel('personal');
        
        // Actualiza la clase 'active' en el menú
        document.querySelectorAll('.nav-menu a').forEach(link => link.classList.remove('active'));
        this.classList.add('active');
    });

    // Evento para el botón "Historial de Pedidos"
    ordersBtn.addEventListener('click', function(e) {
        e.preventDefault();
        showPanel('orders');
        
        // Actualiza la clase 'active' en el menú
        document.querySelectorAll('.nav-menu a').forEach(link => link.classList.remove('active'));
        this.classList.add('active');
    });

    editBtn.addEventListener('click', function() {
        formInputs.forEach(input => {
            input.disabled = false;
        });
        formButtons.style.display = 'flex';
        editBtn.style.display = 'none';
    });
    
    cancelBtn.addEventListener('click', function() {
        formInputs.forEach(input => {
            input.disabled = true;
        });
        formButtons.style.display = 'none';
        editBtn.style.display = 'flex';
    });
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        formInputs.forEach(input => {
            input.disabled = true;
        });
        formButtons.style.display = 'none';
        editBtn.style.display = 'flex';
        alert('¡Información actualizada correctamente!');
    });

    // Menú móvil (toggle)
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }

    // Mostrar "Información Personal" por defecto al cargar la página
    showPanel('personal');
    persInfoBtn.classList.add('active'); // Marcar como activo
});