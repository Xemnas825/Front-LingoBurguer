document.addEventListener('DOMContentLoaded', function() {
    // Verificar si el usuario está autenticado
    let userRole = sessionStorage.getItem('userRole');
    let userData = JSON.parse(sessionStorage.getItem('userData'));

    // URLs del API
    const apiUrlADDEmployee = 'http://localhost:8080/PruebaDBConsola/Controller?ACTION=EMPLOYEE.ADD';
    const apiUrlGetEmployees = 'http://localhost:8080/PruebaDBConsola/Controller?ACTION=EMPLOYEE.FIND_ALL';
    const apiUrlDeleteEmployee = 'http://localhost:8080/PruebaDBConsola/Controller?ACTION=EMPLOYEE.DELETE';
    const apiUrlUpdateEmployee = 'http://localhost:8080/PruebaDBConsola/Controller?ACTION=EMPLOYEE.UPDATE';
    const apiUrlGetJobs = 'http://localhost:8080/PruebaDBConsola/Controller?ACTION=JOB.FIND_ALL';
    const apiUrlGetEstablishments = 'http://localhost:8080/PruebaDBConsola/Controller?ACTION=ESTABLISHMENT.FIND_ALL';
    const apiUrlADDProduct = 'http://localhost:8080/PruebaDBConsola/Controller?ACTION=PRODUCT.ADD';

    let jobs = {};
    let establishments = {};
    let editingEmployeeId = null;
    let currentEmployeeEmail = null;

    // TEMPORAL: Si no hay datos en sessionStorage, usar datos de prueba
    if (!userRole || !userData) {
        userRole = 'employee'; // o 'client' para probar diferentes roles
        userData = {
            m_strFirstName: 'John',
            m_strLastName: 'Doe',
            m_strEmail: 'john.doe@example.com'
        };
        // En producción, descomentar esta redirección:
        // window.location.href = 'login.html';
        // return;
    }

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

    // Cargar datos del usuario
    document.querySelector('.user-name').textContent = userData.m_strFirstName + ' ' + userData.m_strLastName;
    document.querySelector('.user-email').textContent = userData.m_strEmail;

    // Configurar visibilidad según el rol
    const adminSection = document.querySelector('.nav-menu h3:nth-of-type(2)');
    const adminLinks = adminSection?.nextElementSibling;

    if (userRole === 'client') {
        // Ocultar sección de administración para clientes
        if (adminSection) adminSection.style.display = 'none';
        if (adminLinks) adminLinks.style.display = 'none';
    }
    
    // Función para cambiar entre paneles
    function showPanel(panelToShow) {
        // Oculta todos los paneles
        personalPannel.style.display = 'none';
        orderPannel.style.display = 'none';
        if (userRole === 'employee') {
            employeesPanel.style.display = 'none';
            productsPanel.style.display = 'none';
        }
        
        // Muestra solo el panel seleccionado
        switch(panelToShow) {
            case 'personal':
                personalPannel.style.display = 'block';
                break;
            case 'orders':
                orderPannel.style.display = 'block';
                break;
            case 'employees':
                if (userRole === 'employee') {
                    employeesPanel.style.display = 'block';
                    console.log('Cargando panel de empleados...');
                    
                    // Primero cargar los jobs
                    loadJobs().then(() => {
                        console.log('Jobs cargados, cargando establecimientos...');
                        return loadEstablishments();
                    }).then(() => {
                        console.log('Establecimientos cargados, cargando lista de empleados...');
                        loadEmployeesList();
                    }).catch(error => {
                        console.error('Error en la secuencia de carga:', error);
                    });
                }
                break;
            case 'products':
                if (userRole === 'employee') {
                    productsPanel.style.display = 'block';
                }
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

    if (userRole === 'employee') {
        employeesBtn?.addEventListener('click', function(e) {
            e.preventDefault();
            showPanel('employees');
            updateActiveMenu(this);
        });

        productsBtn?.addEventListener('click', function(e) {
            e.preventDefault();
            showPanel('products');
            updateActiveMenu(this);
        });
    }

    // Función para cargar la lista de empleados
    function loadEmployeesList() {
        console.log("Cargando lista de empleados...");
        fetch(apiUrlGetEmployees)
            .then(response => response.text())
            .then(text => {
                try {
                    let employees = [];
                    if (text.trim()) {
                        employees = JSON.parse(text);
                    }
                    
                    const tableBody = document.getElementById('employees-table-body');
                    if (!tableBody) {
                        console.error('No se encontró la tabla de empleados');
                        return;
                    }
                    
                    tableBody.innerHTML = '';

                    if (employees.length === 0) {
                        const row = document.createElement('tr');
                        row.innerHTML = '<td colspan="6" style="text-align: center;">No hay empleados registrados</td>';
                        tableBody.appendChild(row);
                        return;
                    }

                    employees.forEach(employee => {
                        let hireDate = employee.m_dtHireDate || employee.m_hireDate || employee.hire_date || '';
                        if (hireDate) {
                            try {
                                const getMonthNumber = (monthName) => {
                                    const months = {
                                        'jan': '01', 'feb': '02', 'mar': '03', 'apr': '04', 'may': '05', 'jun': '06',
                                        'jul': '07', 'aug': '08', 'sep': '09', 'oct': '10', 'nov': '11', 'dec': '12',
                                        'january': '01', 'february': '02', 'march': '03', 'april': '04', 'june': '06',
                                        'july': '07', 'august': '08', 'september': '09', 'october': '10', 'november': '11', 'december': '12',
                                        'ene': '01', 'feb': '02', 'mar': '03', 'abr': '04', 'may': '05', 'jun': '06',
                                        'jul': '07', 'ago': '08', 'sep': '09', 'oct': '10', 'nov': '11', 'dic': '12',
                                        'enero': '01', 'febrero': '02', 'marzo': '03', 'abril': '04', 'mayo': '05', 'junio': '06',
                                        'julio': '07', 'agosto': '08', 'septiembre': '09', 'octubre': '10', 'noviembre': '11', 'diciembre': '12'
                                    };
                                    return months[monthName.toLowerCase()];
                                };

                                if (typeof hireDate === 'string') {
                                    if (/^\d{4}\/\d{2}\/\d{2}$/.test(hireDate)) {
                                        // Ya está en formato correcto
                                    }
                                    else if (/[a-zA-Z]/.test(hireDate)) {
                                        const parts = hireDate.replace(',', '').split(' ');
                                        if (parts.length >= 3) {
                                            const month = getMonthNumber(parts[0]);
                                            const day = String(parseInt(parts[1])).padStart(2, '0');
                                            const year = parts[2];
                                            if (month && day && year) {
                                                hireDate = `${year}/${month}/${day}`;
                                            }
                                        }
                                    }
                                    else if (hireDate.includes('T') || hireDate.includes('-')) {
                                        const parts = hireDate.split(/[-T]/);
                                        if (parts.length >= 3) {
                                            hireDate = `${parts[0]}/${parts[1]}/${parts[2].split('T')[0]}`;
                                        }
                                    }
                                }
                            } catch (e) {
                                console.error('Error al formatear la fecha:', e);
                                const today = new Date();
                                hireDate = `${today.getFullYear()}/${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}`;
                            }
                        }
                        
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${employee.m_strFirstName || ''} ${employee.m_strLastName || ''}</td>
                            <td>${employee.m_strEmail || ''}</td>
                            <td>${employee.m_strTelephone || 'N/A'}</td>
                            <td>${getJobName(employee.m_fkJob)}</td>
                            <td>${hireDate}</td>
                            <td>
                                <button class="action-btn edit-btn" data-id="${employee.m_iId}" data-email="${employee.m_strEmail}">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="action-btn delete-btn" data-id="${employee.m_iId}">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </td>
                        `;
                        tableBody.appendChild(row);

                        // Añadir event listener al botón de editar
                        const editBtn = row.querySelector('.edit-btn');
                        editBtn.addEventListener('click', function() {
                            editingEmployeeId = this.getAttribute('data-id');
                            currentEmployeeEmail = this.getAttribute('data-email');
                            
                            // Rellenar el formulario con los datos del empleado
                            document.getElementById("emp-firstName").value = employee.m_strFirstName || '';
                            document.getElementById("emp-lastName").value = employee.m_strLastName || '';
                            document.getElementById("emp-email").value = employee.m_strEmail || '';
                            document.getElementById("emp-telephone").value = employee.m_strTelephone || '';
                            document.getElementById("emp-role").value = employee.m_fkJob || '';
                            document.getElementById("emp-establishment").value = employee.m_fkEstablishment || '';
                            document.getElementById("emp-salary").value = employee.m_dblSalary || '';
                            document.getElementById("emp-hire-date").value = hireDate;

                            // Ocultar y hacer no requerido el campo de contraseña durante edición
                            const passwordField = document.getElementById("emp-password");
                            const passwordLabel = passwordField.previousElementSibling;
                            passwordField.style.display = 'none';
                            passwordLabel.style.display = 'none';
                            passwordField.required = false;

                            // Mostrar el formulario
                            employeeForm.style.display = 'block';
                            addEmployeeBtn.style.display = 'none';
                            
                            // Cambiar el texto del botón submit
                            const submitBtn = employeeForm.querySelector('button[type="submit"]');
                            submitBtn.textContent = 'Update Employee';
                            
                            // Desplazarse suavemente hasta el formulario
                            employeeForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        });

                        // Añadir event listener al botón de eliminar
                        const deleteBtn = row.querySelector('.delete-btn');
                        deleteBtn.addEventListener('click', function() {
                            const employeeId = this.getAttribute('data-id');
                            const employeeEmail = employee.m_strEmail;
                            if (confirm('¿Estás seguro de que deseas eliminar este empleado?')) {
                                deleteEmployee(employeeId, employeeEmail);
                            }
                        });
                    });
                } catch (e) {
                    console.error('Error al parsear la respuesta:', e);
                    console.error('Texto que causó el error:', text);
                }
            })
            .catch(error => {
                console.error('Error al cargar empleados:', error);
            });
    }

    // Función para eliminar empleado
    function deleteEmployee(employeeId, employeeEmail) {
        if (!employeeId || !employeeEmail) {
            console.error('ID o email de empleado no válido');
            alert('Error: Datos de empleado no válidos');
            return;
        }

        const params = new URLSearchParams();
        params.append('email', employeeEmail);
        
        const urlWithParams = `${apiUrlDeleteEmployee}&${params.toString()}`;
        
        fetch(urlWithParams, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
        .then(response => response.text())
        .then(text => {
            if (text.includes("error") || text.includes("Error")) {
                throw new Error("No se pudo eliminar el empleado");
            }

            alert("Empleado eliminado correctamente");
            loadEmployeesList();
        })
        .catch(error => {
            console.error('Error al eliminar empleado:', error);
            alert("Error al eliminar empleado: " + error.message);
        });
    }

    // Gestión de formularios de empleados
    if (userRole === 'employee') {
        if (employeesPanel.style.display === 'block') {
            loadEmployeesList();
        }

        addEmployeeBtn?.addEventListener('click', function() {
            employeeForm.style.display = 'block';
            addEmployeeBtn.style.display = 'none';
            const passwordField = document.getElementById("emp-password");
            const passwordLabel = passwordField.previousElementSibling;
            passwordField.style.display = 'block';
            passwordLabel.style.display = 'block';
            passwordField.value = '';
            passwordField.placeholder = 'Enter password';
            passwordField.required = true;
        });

        cancelEmployeeBtn?.addEventListener('click', function() {
            employeeForm.style.display = 'none';
            addEmployeeBtn.style.display = 'block';
            
            // Resetear variables de edición
            editingEmployeeId = null;
            currentEmployeeEmail = null;
            
            // Mostrar y resetear el campo de contraseña
            const passwordField = document.getElementById("emp-password");
            const passwordLabel = passwordField.previousElementSibling;
            passwordField.style.display = 'block';
            passwordLabel.style.display = 'block';
            passwordField.required = true;
            
            // Cambiar el texto del botón submit de vuelta a su estado original
            const submitBtn = employeeForm.querySelector('button[type="submit"]');
            submitBtn.textContent = 'Save Employee';
            
            // Resetear el formulario
            employeeForm.reset();
        });

   employeeForm?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const isEditing = editingEmployeeId !== null;
    console.log('Modo:', isEditing ? 'Edición' : 'Creación');
    
    // 1. Recoger datos
    const formData = {
        firstName: document.getElementById("emp-firstName").value.trim(),
        lastName: document.getElementById("emp-lastName").value.trim(),
        email: document.getElementById("emp-email").value.trim(),
        telephone: document.getElementById("emp-telephone").value.trim(),
        password: document.getElementById("emp-password").value,
        jobId: document.getElementById("emp-role").value,
        establishmentId: document.getElementById("emp-establishment").value,
        salary: document.getElementById("emp-salary").value,
        hireDate: document.getElementById("emp-hire-date").value
    };

    // 2. Validación mínima
    if (!formData.firstName || !formData.lastName || !formData.email) {
        alert("Nombre, Apellido y Email son obligatorios");
        return;
    }

    // 3. Preparar parámetros para el backend
    const params = new URLSearchParams();
    
    // Parámetros clave para actualización
    if (isEditing) {
        params.append('email', currentEmployeeEmail); // Email ORIGINAL para búsqueda
    }
    
    // Campos obligatorios
    params.append('first_name', formData.firstName);
    params.append('last_name', formData.lastName);
    params.append('email', formData.email); // Nuevo email (si cambió)
    
    // Campos opcionales con valores por defecto
    params.append('telephone', formData.telephone || '');
    params.append('password_hash', formData.password || 'defaultPassword'); // Valor por defecto temporal
    params.append('job_id1', formData.jobId || '1'); // Valor por defecto temporal
    params.append('establishment_id1', formData.establishmentId || '1'); // Valor por defecto temporal
    params.append('salary', formData.salary || '0');
    
    // Formatear fecha al formato YYYY-MM-DD que espera el backend
    if (formData.hireDate) {
        const date = new Date(formData.hireDate);
        const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        params.append('hire_date', formattedDate);
    } else {
        // Fecha por defecto si no se proporciona
        const today = new Date();
        const defaultDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        params.append('hire_date', defaultDate);
    }

    console.log('Parámetros finales:', Object.fromEntries(params.entries()));

    // 4. Enviar petición
    const apiUrl = isEditing ? apiUrlUpdateEmployee : apiUrlADDEmployee;
    
    fetch(apiUrl, {
        method: "POST",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params
    })
    .then(response => response.text())
    .then(text => {
        console.log('Respuesta del servidor:', text);
        
        if (text.includes("error") || text.includes("Error") || text === "Faltan datos") {
            throw new Error(text);
        }
        
        alert(`Empleado ${isEditing ? 'actualizado' : 'creado'} correctamente!`);
        loadEmployeesList();
        resetEmployeeForm();
    })
    .catch(error => {
        console.error('Error:', error);
        alert(`Error: ${error.message}`);
    });
});
    }

    // Eventos para edición de información personal
    editBtn.addEventListener('click', function() {
        formInputs.forEach(input => input.disabled = false);
        formButtons.style.display = 'flex';
        editBtn.style.display = 'none';
    });
    
    cancelBtn.addEventListener('click', function() {
        formInputs.forEach(input => input.disabled = true);
        formButtons.style.display = 'none';
        editBtn.style.display = 'flex';
    });
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        formInputs.forEach(input => input.disabled = true);
        formButtons.style.display = 'none';
        editBtn.style.display = 'flex';
        alert('Information updated successfully!');
    });

    // Menú móvil (toggle)
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }

    // Gestión del logout
    const logoutBtn = document.querySelector('.logout-btn');
    logoutBtn.addEventListener('click', function() {
        sessionStorage.clear();
        window.location.href = 'login.html';
    });

    // Mostrar "Información Personal" por defecto al cargar la página
    showPanel('personal');
    persInfoBtn.classList.add('active');

    // Función para obtener el nombre del trabajo según el ID
    function getJobName(jobId) {
        if (!jobId) return 'N/A';
        return jobs[jobId] || 'Unknown';
    }

    // Función para cargar los trabajos
    function loadJobs() {
        console.log('Iniciando carga de jobs...');
        return fetch(apiUrlGetJobs)
            .then(response => response.text())
            .then(text => {
                try {
                    const jobsList = JSON.parse(text);
                    const jobSelect = document.getElementById('emp-role');
                    if (!jobSelect) {
                        console.error('No se encontró el elemento select de jobs');
                        return;
                    }
                    
                    jobSelect.innerHTML = '<option value="">Select a role</option>';
                    
                    jobsList.forEach(job => {
                        const jobId = job.m_iId || job.id;
                        const jobTitle = job.m_strTitle || job.title || job.getTitle || job.m_strName || 'Unknown';
                        jobs[jobId] = jobTitle;
                        
                        const option = document.createElement('option');
                        option.value = jobId;
                        option.textContent = jobTitle;
                        jobSelect.appendChild(option);
                    });
                } catch (e) {
                    console.error('Error al parsear jobs:', e);
                }
            })
            .catch(error => {
                console.error('Error al cargar jobs:', error);
            });
    }

    // Función para cargar los establecimientos
    function loadEstablishments() {
        return fetch(apiUrlGetEstablishments)
            .then(response => response.text())
            .then(text => {
                try {
                    const establishmentsList = JSON.parse(text);
                    const establishmentSelect = document.getElementById('emp-establishment');
                    const productEstablishmentSelect = document.getElementById('product-establishment');
                    
                    if (establishmentSelect) {
                        establishmentSelect.innerHTML = '<option value="">Select an establishment</option>';
                    }
                    if (productEstablishmentSelect) {
                        productEstablishmentSelect.innerHTML = '<option value="">Select an establishment</option>';
                    }
                    
                    establishmentsList.forEach(establishment => {
                        establishments[establishment.m_iId] = establishment.m_strName || establishment.getName || establishment.name || 'Unknown';
                        
                        if (establishmentSelect) {
                            const option = document.createElement('option');
                            option.value = establishment.m_iId;
                            option.textContent = establishments[establishment.m_iId];
                            establishmentSelect.appendChild(option);
                        }
                        
                        if (productEstablishmentSelect) {
                            const option = document.createElement('option');
                            option.value = establishment.m_iId;
                            option.textContent = establishments[establishment.m_iId];
                            productEstablishmentSelect.appendChild(option);
                        }
                    });
                } catch (e) {
                    console.error('Error al parsear establecimientos:', e);
                }
            })
            .catch(error => {
                console.error('Error al cargar establishments:', error);
            });
    }
});