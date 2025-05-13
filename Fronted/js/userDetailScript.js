document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const editBtn = document.getElementById('edit-info-btn');
    const orderPannel = document.getElementById('orders-pannel');
    const personalPannel = document.getElementById('persInfoPannel');
    const employeesPanel = document.getElementById('employees-panel');
    const productsPanel = document.getElementById('products-panel');
    const cancelBtn = document.getElementById('cancel-btn');
    const form = document.getElementById('personal-info-form');
    const formInputs = form.querySelectorAll('input, textarea, select');
    const formButtons = form.querySelector('.form-buttons');
    
    // Botones del menú lateral
    const persInfoBtn = document.getElementById('persInfoBtn').closest('a');
    const ordersBtn = document.getElementById('ordersBtn').closest('a');
    const employeesBtn = document.getElementById('employeesBtn').closest('a');
    const productsBtn = document.getElementById('productsBtn').closest('a');
    
    // Formularios de empleados y productos
    const employeeForm = document.getElementById('employee-form');
    const productForm = document.getElementById('product-form');
    const addEmployeeBtn = document.getElementById('add-employee-btn');
    const addProductBtn = document.getElementById('add-product-btn');
    const cancelEmployeeBtn = document.getElementById('cancel-employee-btn');
    const cancelProductBtn = document.getElementById('cancel-product-btn');
    
    // Función para cambiar entre paneles
    function showPanel(panelToShow) {
        // Oculta todos los paneles
        personalPannel.style.display = 'none';
        orderPannel.style.display = 'none';
        employeesPanel.style.display = 'none';
        productsPanel.style.display = 'none';
        
        // Muestra solo el panel seleccionado
        switch(panelToShow) {
            case 'personal':
                personalPannel.style.display = 'block';
                break;
            case 'orders':
                orderPannel.style.display = 'block';
                break;
            case 'employees':
                employeesPanel.style.display = 'block';
                break;
            case 'products':
                productsPanel.style.display = 'block';
                break;
        }
    }

    // Función para actualizar el menú activo
    function updateActiveMenu(clickedLink) {
        document.querySelectorAll('.nav-menu a').forEach(link => link.classList.remove('active'));
        clickedLink.classList.add('active');
    }

    // Eventos para los botones del menú
    persInfoBtn.addEventListener('click', function(e) {
        e.preventDefault();
        showPanel('personal');
        updateActiveMenu(this);
    });

    ordersBtn.addEventListener('click', function(e) {
        e.preventDefault();
        showPanel('orders');
        updateActiveMenu(this);
    });

    employeesBtn.addEventListener('click', function(e) {
        e.preventDefault();
        showPanel('employees');
        updateActiveMenu(this);
    });

    productsBtn.addEventListener('click', function(e) {
        e.preventDefault();
        showPanel('products');
        updateActiveMenu(this);
    });

    // Gestión de formularios de empleados
    addEmployeeBtn.addEventListener('click', function() {
        employeeForm.style.display = 'block';
        addEmployeeBtn.style.display = 'none';
    });

    cancelEmployeeBtn.addEventListener('click', function() {
        employeeForm.style.display = 'none';
        addEmployeeBtn.style.display = 'block';
        employeeForm.reset();
    });

    employeeForm.addEventListener('submit', function(e) {
        e.preventDefault();
        // Aquí irá la lógica para guardar el empleado
        alert('¡Empleado guardado correctamente!');
        employeeForm.style.display = 'none';
        addEmployeeBtn.style.display = 'block';
        employeeForm.reset();
    });

    // Gestión de formularios de productos
    addProductBtn.addEventListener('click', function() {
        productForm.style.display = 'block';
        addProductBtn.style.display = 'none';
    });

    cancelProductBtn.addEventListener('click', function() {
        productForm.style.display = 'none';
        addProductBtn.style.display = 'block';
        productForm.reset();
    });

    productForm.addEventListener('submit', function(e) {
        e.preventDefault();
        // Aquí irá la lógica para guardar el producto
        alert('¡Producto guardado correctamente!');
        productForm.style.display = 'none';
        addProductBtn.style.display = 'block';
        productForm.reset();
    });

    // Eventos existentes para edición de información personal
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
    persInfoBtn.classList.add('active');
});